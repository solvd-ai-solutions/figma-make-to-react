import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* SOLVD Header with 2px Border */}
      <div className="border-b-2 border-black bg-gradient-to-r from-[var(--solvd-coral)] via-[var(--solvd-teal)] to-[var(--solvd-lavender)]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-6xl font-extrabold text-white mb-2 drop-shadow-lg">
              🎨 SOLVD AI SOLUTIONS
            </h1>
            <p className="text-3xl font-bold text-black mb-2">
              Figma Make → React App Converter
            </p>
            <p className="text-xl text-black font-semibold max-w-3xl mx-auto">
              Convert your Figma Make exports into production-ready React applications with pixel-perfect accuracy
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          
          <div className="space-x-4">
            <Link
              href="/upload"
              className="inline-block bg-[var(--solvd-teal)] text-white px-6 py-3 rounded-lg text-xl font-semibold border-2 border-[var(--solvd-teal)] hover:bg-[var(--solvd-coral)] hover:text-black transition-all duration-300 ease-out transform hover:-translate-y-1 shadow-lg"
            >
              🚀 Upload Figma Export
            </Link>
            
            <Link
              href="/preview"
              className="inline-block bg-transparent text-black px-6 py-3 rounded-lg text-xl font-semibold border-2 border-black hover:bg-black hover:text-white transition-all duration-300 ease-out transform hover:-translate-y-1 shadow-lg"
            >
              👀 Preview Components
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* SOLVD Card 1 - 2px Border + SOLVD Coral */}
          <div className="bg-[var(--solvd-coral)] rounded-xl p-6 shadow-lg text-center border-2 border-black hover:border-[var(--solvd-teal)] transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-black mb-3">Auto-Convert</h3>
            <p className="text-black font-medium">
              Drag & drop your Figma export and get React components with TypeScript automatically
            </p>
          </div>
          
          {/* SOLVD Card 2 - 2px Border + SOLVD Teal */}
          <div className="bg-[var(--solvd-teal)] rounded-xl p-6 shadow-lg text-center border-2 border-black hover:border-[var(--solvd-teal)] transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-black mb-3">Pixel Perfect</h3>
            <p className="text-black font-medium">
              Maintains exact spacing, colors, typography, and layout from your original design
            </p>
          </div>
          
          {/* SOLVD Card 3 - 2px Border + SOLVD Lavender */}
          <div className="bg-[var(--solvd-lavender)] rounded-xl p-6 shadow-lg text-center border-2 border-black hover:border-[var(--solvd-teal)] transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-black mb-3">Deploy Ready</h3>
            <p className="text-black font-medium">
              Production-optimized code ready for GitHub and Vercel deployment
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border-2 border-black">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 - SOLVD Coral */}
            <div className="text-center">
              <div className="bg-[var(--solvd-coral)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <span className="text-black font-bold text-xl">1</span>
              </div>
              <h4 className="font-bold mb-2 text-black text-lg">Export from Figma</h4>
              <p className="text-sm text-black font-medium">Export your design as code from Figma Make</p>
            </div>
            
            {/* Step 2 - SOLVD Teal */}
            <div className="text-center">
              <div className="bg-[var(--solvd-teal)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <span className="text-black font-bold text-xl">2</span>
              </div>
              <h4 className="font-bold mb-2 text-black text-lg">Upload Files</h4>
              <p className="text-sm text-black font-medium">Drag & drop your ZIP or individual files</p>
            </div>
            
            {/* Step 3 - SOLVD Lavender */}
            <div className="text-center">
              <div className="bg-[var(--solvd-lavender)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <span className="text-black font-bold text-xl">3</span>
              </div>
              <h4 className="font-bold mb-2 text-black text-lg">Auto-Convert</h4>
              <p className="text-sm text-black font-medium">AI converts to React components automatically</p>
            </div>
            
            {/* Step 4 - Black */}
            <div className="text-center">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h4 className="font-bold mb-2 text-black text-lg">Deploy</h4>
              <p className="text-sm text-black font-medium">Push to GitHub and deploy to Vercel</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}