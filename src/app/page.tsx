import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🎨 Figma Make → React App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Convert your Figma Make exports into production-ready React applications with pixel-perfect accuracy
          </p>
          
          <div className="space-x-4">
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🚀 Upload Figma Export
            </Link>
            
            <Link
              href="/preview"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              👀 Preview Components
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Auto-Convert</h3>
            <p className="text-gray-600">
              Drag & drop your Figma export and get React components with TypeScript automatically
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pixel Perfect</h3>
            <p className="text-gray-600">
              Maintains exact spacing, colors, typography, and layout from your original design
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Deploy Ready</h3>
            <p className="text-gray-600">
              Production-optimized code ready for GitHub and Vercel deployment
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Export from Figma</h4>
              <p className="text-sm text-gray-600">Export your design as code from Figma Make</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Upload Files</h4>
              <p className="text-sm text-gray-600">Drag & drop your ZIP or individual files</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Auto-Convert</h4>
              <p className="text-sm text-gray-600">AI converts to React components automatically</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Deploy</h4>
              <p className="text-sm text-gray-600">Push to GitHub and deploy to Vercel</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}