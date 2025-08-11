import '../styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Figma Make to React Converter',
    template: '%s | Figma Converter'
  },
  description: 'Convert Figma Make designs into pixel-perfect, production-ready React applications with automatic Tailwind CSS generation.',
  keywords: ['Figma', 'React', 'Next.js', 'Tailwind CSS', 'Design to Code', 'Figma Make'],
  authors: [{ name: 'Your Name' }],
  creator: 'Figma Converter',
  publisher: 'Figma Converter',
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
    url: 'https://your-domain.com',
    title: 'Figma Make to React Converter',
    description: 'Convert Figma Make designs into pixel-perfect React applications',
    siteName: 'Figma Converter',
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
    title: 'Figma Make to React Converter',
    description: 'Convert Figma Make designs into pixel-perfect React applications',
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
      <body className="min-h-full bg-background text-neutral antialiased">
        {children}
      </body>
    </html>
  )
}
