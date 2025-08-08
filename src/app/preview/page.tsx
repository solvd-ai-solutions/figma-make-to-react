import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { PreviewClient } from './preview-client'

async function getGeneratedComponents() {
  try {
    const componentsDir = path.join(process.cwd(), 'src', 'components', 'generated')
    const files = await fs.readdir(componentsDir)
    const componentFiles = files.filter(file => file.endsWith('.tsx') && !file.endsWith('.stories.tsx'))
    
    const components = []
    
    for (const file of componentFiles) {
      const componentName = file.replace('.tsx', '')
      const filePath = path.join(componentsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      
      // Extract props interface if it exists
      const propsMatch = content.match(/interface\s+(\w+Props)\s*{([^}]+)}/s)
      const props = propsMatch ? propsMatch[2].trim().split('\n').map(line => line.trim()).filter(Boolean) : []
      
      components.push({
        name: componentName,
        file,
        props
      })
    }
    
    return components
  } catch (error) {
    return []
  }
}

export default async function PreviewPage() {
  const components = await getGeneratedComponents()

  if (components.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-6xl">📁</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Components Yet</h1>
            <p className="text-gray-600 mb-6">Upload your Figma Make export to get started!</p>
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Figma Files
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <PreviewClient components={components} />
}