import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* SOLVD Header with Bold Black Border */}
      <div className="border-b-[6px] border-black bg-gradient-to-r from-[var(--color-solvd-secondary)] via-[var(--color-solvd-tertiary)] to-[var(--color-solvd-accent)]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-6xl font-black text-white mb-2 drop-shadow-lg">
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
              className="inline-block bg-[var(--color-solvd-primary)] text-white px-10 py-5 rounded-lg text-xl font-black border-[4px] border-black hover:bg-[var(--color-solvd-secondary)] hover:text-black transition-all transform hover:scale-105 shadow-xl"
            >
              🚀 Upload Figma Export
            </Link>
            
            <Link
              href="/preview"
              className="inline-block bg-[var(--color-solvd-secondary)] text-black px-10 py-5 rounded-lg text-xl font-black border-[4px] border-black hover:bg-[var(--color-solvd-tertiary)] transition-all transform hover:scale-105 shadow-xl"
            >
              👀 Preview Components
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* SOLVD Card 1 - Bold Black Border + SOLVD Secondary Color */}
          <div className="bg-[var(--color-solvd-secondary)] rounded-xl p-8 shadow-xl text-center border-[4px] border-black hover:border-[6px] transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-black text-black mb-3">Auto-Convert</h3>
            <p className="text-black font-semibold">
              Drag & drop your Figma export and get React components with TypeScript automatically
            </p>
          </div>
          
          {/* SOLVD Card 2 - Bold Black Border + SOLVD Tertiary Color */}
          <div className="bg-[var(--color-solvd-tertiary)] rounded-xl p-8 shadow-xl text-center border-[4px] border-black hover:border-[6px] transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-black text-black mb-3">Pixel Perfect</h3>
            <p className="text-black font-semibold">
              Maintains exact spacing, colors, typography, and layout from your original design
            </p>
          </div>
          
          {/* SOLVD Card 3 - Bold Black Border + SOLVD Accent Color */}
          <div className="bg-[var(--color-solvd-accent)] rounded-xl p-8 shadow-xl text-center border-[4px] border-black hover:border-[6px] transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-black text-black mb-3">Deploy Ready</h3>
            <p className="text-black font-semibold">
              Production-optimized code ready for GitHub and Vercel deployment
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border-[6px] border-black">
          <h2 className="text-3xl font-black text-black mb-8 text-center">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 - SOLVD Secondary Color */}
            <div className="text-center">
              <div className="bg-[var(--color-solvd-secondary)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-[4px] border-black">
                <span className="text-black font-black text-xl">1</span>
              </div>
              <h4 className="font-black mb-2 text-black text-lg">Export from Figma</h4>
              <p className="text-sm text-black font-semibold">Export your design as code from Figma Make</p>
            </div>
            
            {/* Step 2 - SOLVD Tertiary Color */}
            <div className="text-center">
              <div className="bg-[var(--color-solvd-tertiary)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-[4px] border-black">
                <span className="text-black font-black text-xl">2</span>
              </div>
              <h4 className="font-black mb-2 text-black text-lg">Upload Files</h4>
              <p className="text-sm text-black font-semibold">Drag & drop your ZIP or individual files</p>
            </div>
            
            {/* Step 3 - SOLVD Accent Color */}
            <div className="text-center">
              <div className="bg-[var(--color-solvd-accent)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-[4px] border-black">
                <span className="text-black font-black text-xl">3</span>
              </div>
              <h4 className="font-black mb-2 text-black text-lg">Auto-Convert</h4>
              <p className="text-sm text-black font-semibold">AI converts to React components automatically</p>
            </div>
            
            {/* Step 4 - SOLVD Primary Color (Black) */}
            <div className="text-center">
              <div className="bg-[var(--color-solvd-primary)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-[4px] border-black">
                <span className="text-white font-black text-xl">4</span>
              </div>
              <h4 className="font-black mb-2 text-black text-lg">Deploy</h4>
              <p className="text-sm text-black font-semibold">Push to GitHub and deploy to Vercel</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}