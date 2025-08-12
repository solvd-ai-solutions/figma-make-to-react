import '../styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'SOLVD AI SOLUTIONS - Figma Make to React Converter',
    template: '%s | SOLVD AI SOLUTIONS'
  },
  description: 'SOLVD AI SOLUTIONS: Convert Figma Make designs into pixel-perfect, production-ready React applications with automatic Tailwind CSS generation.',
  keywords: ['SOLVD AI', 'Figma', 'React', 'Next.js', 'Tailwind CSS', 'Design to Code', 'Figma Make', 'AI Solutions'],
  authors: [{ name: 'SOLVD AI SOLUTIONS' }],
  creator: 'SOLVD AI SOLUTIONS',
  publisher: 'SOLVD AI SOLUTIONS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cut-and-order-manager.vercel.app',
    title: 'SOLVD AI SOLUTIONS - Figma Make to React Converter',
    description: 'SOLVD AI SOLUTIONS: Convert Figma Make designs into pixel-perfect React applications',
    siteName: 'SOLVD AI SOLUTIONS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Figma Converter Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOLVD AI SOLUTIONS - Figma Make to React Converter',
    description: 'SOLVD AI SOLUTIONS: Convert Figma Make designs into pixel-perfect React applications',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full" data-theme="light">
      <body className="min-h-full bg-[var(--color-neutral-50)] text-[var(--color-neutral-900)] antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
