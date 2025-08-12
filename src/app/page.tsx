import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* SOLVD Header with 2px Border (Signature Style) */}
      <div className="border-b-[2px] border-[var(--solv-black)] bg-gradient-to-r from-[var(--solv-coral)] via-[var(--solv-teal)] to-[var(--solv-lavender)]">
        <div className="container mx-auto px-[var(--space-4)] py-[var(--space-8)]">
          <div className="text-center">
            <h1 className="text-[var(--font-size-6xl)] font-extrabold text-white mb-[var(--space-2)] drop-shadow-lg">
              🎨 SOLVD AI SOLUTIONS
            </h1>
            <p className="text-[var(--font-size-3xl)] font-bold text-[var(--solv-black)] mb-[var(--space-2)]">
              Figma Make → React App Converter
            </p>
            <p className="text-[var(--font-size-xl)] text-[var(--solv-black)] font-semibold max-w-3xl mx-auto">
              Convert your Figma Make exports into production-ready React applications with pixel-perfect accuracy
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          
          <div className="space-x-[var(--space-4)]">
            <Link
              href="/upload"
              className="inline-block bg-[var(--solv-teal)] text-white px-[var(--space-6)] py-[var(--space-3)] rounded-[var(--radius-md)] text-[var(--font-size-xl)] font-semibold border-[2px] border-[var(--solv-teal)] hover:bg-[var(--solv-coral)] hover:text-[var(--solv-black)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] transform hover:translate-y-[-2px] shadow-lg"
            >
              🚀 Upload Figma Export
            </Link>
            
            <Link
              href="/preview"
              className="inline-block bg-transparent text-[var(--solv-black)] px-[var(--space-6)] py-[var(--space-3)] rounded-[var(--radius-md)] text-[var(--font-size-xl)] font-semibold border-[2px] border-[var(--solv-black)] hover:bg-[var(--solv-black)] hover:text-white transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] transform hover:translate-y-[-2px] shadow-lg"
            >
              👀 Preview Components
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-[var(--space-8)] max-w-4xl mx-auto">
          {/* SOLVD Card 1 - 2px Border + SOLVD Coral */}
          <div className="bg-[var(--solv-coral)] rounded-[var(--radius-lg)] p-[var(--card-padding)] shadow-lg text-center border-[2px] border-[var(--solv-black)] hover:border-[var(--solv-teal)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] transform hover:translate-y-[-2px] hover:shadow-xl">
            <div className="text-[var(--icon-2xl)] mb-[var(--space-4)]">⚡</div>
            <h3 className="text-[var(--font-size-2xl)] font-bold text-[var(--solv-black)] mb-[var(--space-3)]">Auto-Convert</h3>
            <p className="text-[var(--solv-black)] font-medium">
              Drag & drop your Figma export and get React components with TypeScript automatically
            </p>
          </div>
          
          {/* SOLVD Card 2 - 2px Border + SOLVD Teal */}
          <div className="bg-[var(--solv-teal)] rounded-[var(--radius-lg)] p-[var(--card-padding)] shadow-lg text-center border-[2px] border-[var(--solv-black)] hover:border-[var(--solv-coral)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] transform hover:translate-y-[-2px] hover:shadow-xl">
            <div className="text-[var(--icon-2xl)] mb-[var(--space-4)]">🎯</div>
            <h3 className="text-[var(--font-size-2xl)] font-bold text-[var(--solv-black)] mb-[var(--space-3)]">Pixel Perfect</h3>
            <p className="text-[var(--solv-black)] font-medium">
              Maintains exact spacing, colors, typography, and layout from your original design
            </p>
          </div>
          
          {/* SOLVD Card 3 - 2px Border + SOLVD Lavender */}
          <div className="bg-[var(--solv-lavender)] rounded-[var(--radius-lg)] p-[var(--card-padding)] shadow-lg text-center border-[2px] border-[var(--solv-black)] hover:border-[var(--solv-teal)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] transform hover:translate-y-[-2px] hover:shadow-xl">
            <div className="text-[var(--icon-2xl)] mb-[var(--space-4)]">🚀</div>
            <h3 className="text-[var(--font-size-2xl)] font-bold text-[var(--solv-black)] mb-[var(--space-3)]">Deploy Ready</h3>
            <p className="text-[var(--solv-black)] font-medium">
              Production-optimized code ready for GitHub and Vercel deployment
            </p>
          </div>
        </div>

        <div className="mt-[var(--space-16)] bg-white rounded-[var(--radius-xl)] shadow-xl p-[var(--space-8)] max-w-4xl mx-auto border-[2px] border-[var(--solv-black)]">
          <h2 className="text-[var(--font-size-3xl)] font-bold text-[var(--solv-black)] mb-[var(--space-8)] text-center">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-[var(--space-6)]">
            {/* Step 1 - SOLVD Coral */}
            <div className="text-center">
              <div className="bg-[var(--solv-coral)] rounded-full w-[var(--space-16)] h-[var(--space-16)] flex items-center justify-center mx-auto mb-[var(--space-4)] border-[2px] border-[var(--solv-black)]">
                <span className="text-[var(--solv-black)] font-bold text-[var(--font-size-xl)]">1</span>
              </div>
              <h4 className="font-bold mb-[var(--space-2)] text-[var(--solv-black)] text-[var(--font-size-lg)]">Export from Figma</h4>
              <p className="text-[var(--font-size-sm)] text-[var(--solv-black)] font-medium">Export your design as code from Figma Make</p>
            </div>
            
            {/* Step 2 - SOLVD Teal */}
            <div className="text-center">
              <div className="bg-[var(--solv-teal)] rounded-full w-[var(--space-16)] h-[var(--space-16)] flex items-center justify-center mx-auto mb-[var(--space-4)] border-[2px] border-[var(--solv-black)]">
                <span className="text-[var(--solv-black)] font-bold text-[var(--font-size-xl)]">2</span>
              </div>
              <h4 className="font-bold mb-[var(--space-2)] text-[var(--solv-black)] text-[var(--font-size-lg)]">Upload Files</h4>
              <p className="text-[var(--font-size-sm)] text-[var(--solv-black)] font-medium">Drag & drop your ZIP or individual files</p>
            </div>
            
            {/* Step 3 - SOLVD Lavender */}
            <div className="text-center">
              <div className="bg-[var(--solv-lavender)] rounded-full w-[var(--space-16)] h-[var(--space-16)] flex items-center justify-center mx-auto mb-[var(--space-4)] border-[2px] border-[var(--solv-black)]">
                <span className="text-[var(--solv-black)] font-bold text-[var(--font-size-xl)]">3</span>
              </div>
              <h4 className="font-bold mb-[var(--space-2)] text-[var(--solv-black)] text-[var(--font-size-lg)]">Auto-Convert</h4>
              <p className="text-[var(--font-size-sm)] text-[var(--solv-black)] font-medium">AI converts to React components automatically</p>
            </div>
            
            {/* Step 4 - SOLVD Black */}
            <div className="text-center">
              <div className="bg-[var(--solv-black)] rounded-full w-[var(--space-16)] h-[var(--space-16)] flex items-center justify-center mx-auto mb-[var(--space-4)] border-[2px] border-[var(--solv-black)]">
                <span className="text-white font-bold text-[var(--font-size-xl)]">4</span>
              </div>
              <h4 className="font-bold mb-[var(--space-2)] text-[var(--solv-black)] text-[var(--font-size-lg)]">Deploy</h4>
              <p className="text-[var(--font-size-sm)] text-[var(--solv-black)] font-medium">Push to GitHub and deploy to Vercel</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}