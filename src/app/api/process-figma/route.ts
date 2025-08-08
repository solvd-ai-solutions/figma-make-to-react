import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'
import AdmZip from 'adm-zip'

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const sendProgress = (message: string, completed = false) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ message, completed })}\n\n`)
          )
        }

        sendProgress('Processing uploaded files...')

        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        if (files.length === 0) {
          throw new Error('No files uploaded')
        }

        // Use a serverless-safe temp working directory
        const workId = crypto.randomUUID()
        const workDir = path.join(os.tmpdir(), `figma-${workId}`)
        const codeDir = path.join(workDir, 'code')
        const assetsDir = path.join(workDir, 'assets')

        await fs.mkdir(codeDir, { recursive: true })
        await fs.mkdir(assetsDir, { recursive: true })

        sendProgress('Extracting files...')

        // Process each uploaded file
        for (const file of files) {
          const buffer = Buffer.from(await file.arrayBuffer())
          const fileName = file.name
          
          if (fileName.endsWith('.zip')) {
            // Extract ZIP file
            const zip = new AdmZip(buffer)
            const entries = zip.getEntries()
            
            for (const entry of entries) {
              if (entry.isDirectory) continue
              
              const entryPath = entry.entryName
              const fileContent = entry.getData()
              
              if (entryPath.endsWith('.css')) {
                // CSS files go to code directory
                const outputPath = path.join(codeDir, path.basename(entryPath))
                await fs.writeFile(outputPath, fileContent)
              } else if (entryPath.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i)) {
                // Image files go to assets directory
                const outputPath = path.join(assetsDir, path.basename(entryPath))
                await fs.writeFile(outputPath, fileContent)
              }
            }
          } else if (fileName.endsWith('.css')) {
            // Direct CSS file
            const outputPath = path.join(codeDir, fileName)
            await fs.writeFile(outputPath, buffer)
          } else if (fileName.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i)) {
            // Direct image file
            const outputPath = path.join(assetsDir, fileName)
            await fs.writeFile(outputPath, buffer)
          }
        }

        sendProgress('Analyzing CSS structure...')
        
        // Generate HTML structure from CSS
        const cssFiles = await fs.readdir(codeDir)
        if (cssFiles.length > 0) {
          const cssFile = cssFiles.find(f => f.endsWith('.css'))
          if (cssFile) {
            const cssPath = path.join(codeDir, cssFile)
            const cssContent = await fs.readFile(cssPath, 'utf-8')
            
            // Create a basic HTML structure based on CSS classes
            const htmlContent = generateHTMLFromCSS(cssContent)
            await fs.writeFile(path.join(codeDir, 'generated.html'), htmlContent)
          }
        }

        // Build a minimal React component from the generated HTML/CSS
        sendProgress('Converting to React components...')
        const cssFilesAfter = await fs.readdir(codeDir)
        const cssFileName = cssFilesAfter.find(f => f.endsWith('.css')) || 'styles.css'
        const cssPath = path.join(codeDir, cssFileName)
        const cssContent = await safeRead(cssPath)

        const generatedHtmlPath = path.join(codeDir, 'generated.html')
        const htmlContent = await safeRead(generatedHtmlPath)
        const componentTsx = generateComponentFromHtml(htmlContent)

        // Create a zip with component + css + assets
        sendProgress('Packaging results...')
        const zip = new AdmZip()
        zip.addFile('src/components/generated/Generated.tsx', Buffer.from(componentTsx, 'utf-8'))
        if (cssContent) {
          zip.addFile('src/styles/figma.css', Buffer.from(cssContent, 'utf-8'))
        }
        try {
          const assetFiles = await fs.readdir(assetsDir)
          for (const file of assetFiles) {
            const fileBuf = await fs.readFile(path.join(assetsDir, file))
            zip.addFile(`public/images/${file}`, fileBuf)
          }
        } catch {}

        const zipBuffer = zip.toBuffer()
        const base64 = zipBuffer.toString('base64')
        sendProgress('🎉 Conversion complete! Download your generated React code below.', true)
        // Send a final message with a data URL for download
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ downloadBase64: `data:application/zip;base64,${base64}`, downloadName: 'figma-react.zip' })}\n\n`
          )
        )
        
        controller.close()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            message: `❌ Error: ${errorMessage}`, 
            completed: false, 
            error: true 
          })}\n\n`)
        )
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

function generateHTMLFromCSS(cssContent: string): string {
  // Extract class names from CSS
  const classMatches = cssContent.match(/\.([a-zA-Z0-9_-]+)/g) || []
  const uniqueClasses = [...new Set(classMatches)].map(c => c.slice(1)) // Remove the dot
  
  // Create a basic HTML structure
  let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Figma Make Export</title>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n'
  
  // Create sections for each major class
  const mainClasses = uniqueClasses.filter(c => 
    c.includes('container') || c.includes('section') || c.includes('header') || 
    c.includes('footer') || c.includes('main') || c.includes('nav')
  )
  
  if (mainClasses.length > 0) {
    html += `<div class="${mainClasses[0]}">\n`
    html += '  <header class="header">\n'
    html += '    <nav class="nav">\n'
    html += '      <div class="nav-item">Home</div>\n'
    html += '      <div class="nav-item">About</div>\n'
    html += '      <div class="nav-item">Contact</div>\n'
    html += '    </nav>\n'
    html += '  </header>\n'
    html += '  <main class="main">\n'
    html += '    <section class="hero">\n'
    html += '      <h1 class="title">Welcome to Your App</h1>\n'
    html += '      <p class="subtitle">Built with Figma Make</p>\n'
    html += '    </section>\n'
    html += '  </main>\n'
    html += '  <footer class="footer">\n'
    html += '    <p>&copy; 2024 Your App</p>\n'
    html += '  </footer>\n'
    html += '</div>\n'
  } else {
    // Fallback structure
    html += '<div class="app">\n'
    html += '  <h1>Your Figma Make Design</h1>\n'
    html += '  <p>Converted to React components</p>\n'
    html += '</div>\n'
  }
  
  html += '</body>\n</html>'
  
  return html
}