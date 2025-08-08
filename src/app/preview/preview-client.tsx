'use client'

import Link from 'next/link'

interface Component {
  name: string
  file: string
  props: string[]
}

interface PreviewClientProps {
  components: Component[]
}

export function PreviewClient({ components }: PreviewClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Your React Components
          </h1>
          <p className="text-gray-600 mb-4">
            This page shows all the components that were generated from your Figma Make export.
            You can see how they look and test their functionality.
          </p>
        </div>

        <div className="mb-6 flex justify-center space-x-4">
          <Link
            href="/upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Upload New Files
          </Link>
          <a
            href="http://localhost:6006"
            target="_blank"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            📚 Open Storybook
          </a>
          <Link
            href="/"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            🏠 View Live App
          </Link>
        </div>

        <div className="grid gap-6">
          {components.map((component) => (
            <div key={component.name} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {component.name}
                </h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Component
                </span>
              </div>
              
              {component.props.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Props:</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-sm text-gray-600">
                      {component.props.map((prop, index) => (
                        <div key={index}>{prop}</div>
                      ))}
                    </code>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <a
                  href={`http://localhost:6006/?path=/story/generated-${component.name.toLowerCase()}--default`}
                  target="_blank"
                  className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                >
                  📚 View in Storybook
                </a>
                <button
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(`import ${component.name} from '@/components/generated/${component.name}'`)
                  }}
                >
                  📋 Copy Import
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🚀 Ready to Deploy?
          </h3>
          <p className="text-blue-700 mb-4">
            Your React app is production-ready! Push to GitHub and deploy to Vercel.
          </p>
          <div className="space-y-2 text-sm text-blue-600">
            <div><code>git add .</code></div>
            <div><code>git commit -m "Add converted Figma components"</code></div>
            <div><code>git push</code></div>
          </div>
        </div>
      </div>
    </div>
  )
} 