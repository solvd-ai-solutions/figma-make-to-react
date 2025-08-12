'use client'

import { useState, useCallback, useRef, ChangeEvent, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState<string>('')
  const [downloadName, setDownloadName] = useState<string>('figma-react.zip')
  const [debugFiles, setDebugFiles] = useState<{ accepted: string[]; rejected: string[] }>({ accepted: [], rejected: [] })

  const folderInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = folderInputRef.current
    if (!el) return
    try {
      // Ensure attributes are present regardless of React DOM behavior
      el.setAttribute('webkitdirectory', '')
      el.setAttribute('directory', '')
      el.setAttribute('multiple', '')
    } catch {}
  }, [])

  // Auto-download when complete
  useEffect(() => {
    if (completed && downloadUrl) {
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = downloadName
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
  }, [completed, downloadUrl, downloadName])

  const processFiles = useCallback(async (acceptedFiles: File[]) => {
    console.log('Files to process:', acceptedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })))

    if (acceptedFiles.length === 0) {
      setError('No files were accepted. Please try dropping your exported folder, a ZIP, or individual files.')
      return
    }

    setIsProcessing(true)
    setProgress('Uploading files...')
    setError('')
    setCompleted(false)

    try {
      const formData = new FormData()
      acceptedFiles.forEach((file) => formData.append('files', file))

      const response = await fetch('/api/process-figma', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Upload failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            setProgress(data.message)
            if (data.completed) setCompleted(true)
            if (data.downloadBase64) {
              setDownloadUrl(data.downloadBase64 as string)
              if (data.downloadName) setDownloadName(data.downloadName as string)
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const onFolderSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setDebugFiles({ accepted: files.map(f => f.name), rejected: [] })
    void processFiles(files)
    // Reset input so selecting the same folder again works
    e.target.value = ''
  }, [processFiles])

  const onZipSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setDebugFiles({ accepted: files.map(f => f.name), rejected: [] })
    void processFiles(files)
    e.target.value = ''
  }, [processFiles])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    // Let users drop entire folders; file-selector used by react-dropzone will recurse
    onDrop: (acceptedFiles, fileRejections) => {
      setDebugFiles({
        accepted: acceptedFiles.map(f => f.name),
        rejected: fileRejections.map(r => r.file.name)
      })
      void processFiles(acceptedFiles)
    },
    // Accept everything; server will filter as needed
    accept: undefined,
    disabled: isProcessing,
    multiple: true,
    noClick: false,
    noKeyboard: false,
    preventDropOnDocument: true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-teal)]/10 to-[var(--color-primary-lavender)]/10 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-neutral-900)] mb-4">🎨 SOLVD AI SOLUTIONS</h1>
          <p className="text-xl text-[var(--color-primary-teal)] font-semibold mb-2">Figma Make → React App Converter</p>
          <p className="text-lg text-[var(--color-neutral-600)]">Drop your Figma Make export folder, a ZIP, or individual files.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-[var(--color-primary-teal)]/20">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all
              ${isDragActive ? (isDragReject ? 'border-[var(--color-semantic-error)] bg-[var(--color-semantic-error)]/10' : 'border-[var(--color-primary-teal)] bg-[var(--color-primary-teal)]/10') : (isProcessing ? 'border-[var(--color-neutral-300)] bg-[var(--color-neutral-100)]' : 'border-[var(--color-neutral-300)] hover:border-[var(--color-primary-teal)] hover:bg-[var(--color-primary-teal)]/10')}
              ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <input {...getInputProps()} />
            <input
              type="file"
              ref={folderInputRef}
              // Attributes are also set via useEffect for reliability
              // @ts-ignore
              webkitdirectory
              // @ts-ignore
              directory
              multiple
              className="hidden"
              onChange={onFolderSelect}
            />
            <input
              type="file"
              ref={zipInputRef}
              accept=".zip"
              className="hidden"
              onChange={onZipSelect}
            />

            {isProcessing ? (
              <div className="space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-[var(--color-primary-teal)] border-t-transparent rounded-full mx-auto"></div>
                <p className="text-lg font-medium text-[var(--color-neutral-700)]">{progress}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">📁</div>
                <div>
                  <p className="text-xl font-medium text-[var(--color-neutral-700)] mb-2">
                    {isDragActive ? (isDragReject ? 'Some files cannot be processed' : 'Drop here!') : 'Drag & drop your export folder or files'}
                  </p>
                  <p className="text-[var(--color-neutral-500)]">You can also choose a folder:</p>
                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="mt-3 inline-block bg-[var(--color-primary-teal)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-teal)]/90 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Choose Folder
                  </button>
                  <p className="text-[var(--color-neutral-500)] mt-6">Or one‑click with a ZIP:</p>
                  <button
                    type="button"
                    onClick={() => zipInputRef.current?.click()}
                    className="mt-3 inline-block bg-[var(--color-primary-coral)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-coral)]/90 transition-all transform hover:scale-105 shadow-lg"
                  >
                    One‑Click Convert (Choose ZIP)
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-[var(--color-semantic-error)]/10 border-2 border-[var(--color-semantic-error)] rounded-lg">
              <p className="text-[var(--color-semantic-error)] font-medium">❌ {error}</p>
            </div>
          )}

          {(debugFiles.accepted.length > 0 || debugFiles.rejected.length > 0) && (
            <div className="mt-4 p-4 bg-[var(--color-primary-teal)]/10 border-2 border-[var(--color-primary-teal)] rounded-lg">
              <h3 className="font-semibold text-[var(--color-primary-teal)] mb-2">Debug Info:</h3>
                              {debugFiles.accepted.length > 0 && (
                  <p className="text-[var(--color-semantic-success)] text-sm font-medium">✅ Accepted: {debugFiles.accepted.join(', ')}</p>
                )}
                {debugFiles.rejected.length > 0 && (
                  <p className="text-[var(--color-semantic-error)] text-sm font-medium">❌ Rejected: {debugFiles.rejected.join(', ')}</p>
                )}
            </div>
          )}

          {completed && (
            <div className="mt-4 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center space-y-4">
                <p className="text-green-700 font-medium text-lg">✅ Conversion Complete!</p>
                <p className="text-green-600 text-sm mb-4">🎯 Download the generated React code and open it in Cursor.</p>
                <div className="space-x-4">
                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      download={downloadName}
                      className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      ⬇️ Download Generated Code
                    </a>
                  )}
                  <a href="/preview" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">🚀 Preview Your App</a>
                  <button onClick={() => window.location.reload()} className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">🔄 Convert Another</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Auto-Convert</h3>
            <p className="text-gray-600">Automatically converts HTML to React components with TypeScript</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Pixel Perfect</h3>
            <p className="text-gray-600">Maintains exact spacing, colors, and typography from your design</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-bold text-lg mb-2">Deploy Ready</h3>
            <p className="text-gray-600">Production-ready code optimized for Vercel deployment</p>
          </div>
        </div>
      </div>
    </div>
  )
}