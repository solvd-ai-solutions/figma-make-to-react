import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--color-primary-teal)]/10 to-[var(--color-primary-lavender)]/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-neutral-900)] mb-4">
            🎨 SOLVD AI SOLUTIONS
          </h1>
          <p className="text-2xl text-[var(--color-primary-teal)] font-semibold mb-4">
            Figma Make → React App Converter
          </p>
          <p className="text-xl text-[var(--color-neutral-600)] max-w-2xl mx-auto mb-8">
            Convert your Figma Make exports into production-ready React applications with pixel-perfect accuracy
          </p>
          
          <div className="space-x-4">
            <Link
              href="/upload"
              className="inline-block bg-[var(--color-primary-teal)] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[var(--color-primary-teal)]/90 transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Upload Figma Export
            </Link>
            
            <Link
              href="/preview"
              className="inline-block bg-white text-[var(--color-primary-teal)] px-8 py-4 rounded-lg text-lg font-semibold border-2 border-[var(--color-primary-teal)] hover:bg-[var(--color-primary-teal)]/10 transition-all transform hover:scale-105 shadow-lg"
            >
              👀 Preview Components
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center border-2 border-[var(--color-primary-teal)]/20 hover:border-[var(--color-primary-teal)]/40 transition-all">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-[var(--color-neutral-900)] mb-3">Auto-Convert</h3>
            <p className="text-[var(--color-neutral-600)]">
              Drag & drop your Figma export and get React components with TypeScript automatically
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center border-2 border-[var(--color-primary-teal)]/20 hover:border-[var(--color-primary-teal)]/40 transition-all">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-[var(--color-neutral-900)] mb-3">Pixel Perfect</h3>
            <p className="text-[var(--color-neutral-600)]">
              Maintains exact spacing, colors, typography, and layout from your original design
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center border-2 border-[var(--color-primary-teal)]/20 hover:border-[var(--color-primary-teal)]/40 transition-all">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-[var(--color-neutral-900)] mb-3">Deploy Ready</h3>
            <p className="text-[var(--color-neutral-600)]">
              Production-optimized code ready for GitHub and Vercel deployment
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border-2 border-[var(--color-primary-teal)]/20">
          <h2 className="text-2xl font-bold text-[var(--color-neutral-900)] mb-6 text-center">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-[var(--color-primary-teal)]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border-2 border-[var(--color-primary-teal)]/30">
                <span className="text-[var(--color-primary-teal)] font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2 text-[var(--color-neutral-900)]">Export from Figma</h4>
              <p className="text-sm text-[var(--color-neutral-600)]">Export your design as code from Figma Make</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[var(--color-primary-teal)]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border-2 border-[var(--color-primary-teal)]/30">
                <span className="text-[var(--color-primary-teal)] font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2 text-[var(--color-neutral-900)]">Upload Files</h4>
              <p className="text-sm text-[var(--color-neutral-600)]">Drag & drop your ZIP or individual files</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[var(--color-primary-teal)]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border-2 border-[var(--color-primary-teal)]/30">
                <span className="text-[var(--color-primary-teal)] font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2 text-[var(--color-neutral-900)]">Auto-Convert</h4>
              <p className="text-sm text-[var(--color-neutral-600)]">AI converts to React components automatically</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[var(--color-primary-teal)]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border-2 border-[var(--color-primary-teal)]/30">
                <span className="text-[var(--color-primary-teal)] font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2 text-[var(--color-neutral-900)]">Deploy</h4>
              <p className="text-sm text-[var(--color-neutral-600)]">Push to GitHub and deploy to Vercel</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}