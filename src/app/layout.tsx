import '../styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Figma Make → React',
  description: 'Conversion pipeline initialized with Next.js + Tailwind + tokens',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full" data-theme="light">
      <body className="min-h-full bg-background text-neutral antialiased">
        {children}
      </body>
    </html>
  )
}
