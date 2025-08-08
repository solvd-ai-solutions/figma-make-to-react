'use client'

import { useState, useCallback, useRef, ChangeEvent, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [debugFiles, setDebugFiles] = useState<{ accepted: string[]; rejected: string[] }>({ accepted: [], rejected: [] })

  const folderInputRef = useRef<HTMLInputElement>(null)

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎨 Figma Make → React App</h1>
          <p className="text-lg text-gray-600">Drop your Figma Make export folder, a ZIP, or individual files.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div
            {...getRootProps()}
            className={`
              border-3 border-dashed rounded-xl p-12 text-center transition-all
              ${isDragActive ? (isDragReject ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50') : (isProcessing ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50')}
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

            {isProcessing ? (
              <div className="space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-lg font-medium text-gray-700">{progress}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">📁</div>
                <div>
                  <p className="text-xl font-medium text-gray-700 mb-2">
                    {isDragActive ? (isDragReject ? 'Some files cannot be processed' : 'Drop here!') : 'Drag & drop your export folder or files'}
                  </p>
                  <p className="text-gray-500">You can also choose a folder:</p>
                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="mt-3 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Choose Folder
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">❌ {error}</p>
            </div>
          )}

          {(debugFiles.accepted.length > 0 || debugFiles.rejected.length > 0) && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Debug Info:</h3>
              {debugFiles.accepted.length > 0 && (
                <p className="text-blue-700 text-sm">✅ Accepted: {debugFiles.accepted.join(', ')}</p>
              )}
              {debugFiles.rejected.length > 0 && (
                <p className="text-red-700 text-sm">❌ Rejected: {debugFiles.rejected.join(', ')}</p>
              )}
            </div>
          )}

          {completed && (
            <div className="mt-4 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center space-y-4">
                <p className="text-green-700 font-medium text-lg">✅ Conversion Complete!</p>
                <p className="text-green-600 text-sm mb-4">🎯 Your project should now be open in a new Cursor window for editing!</p>
                <div className="space-x-4">
                  <a href="/preview" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">🚀 Preview Your App</a>
                  <a href="http://localhost:6006" target="_blank" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">📚 View Components</a>
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