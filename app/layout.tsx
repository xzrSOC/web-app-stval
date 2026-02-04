import type { Metadata } from 'next'
import { Great_Vibes } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Site pour ma valentine',
  description: 'Site Saint Valentin',
}

export const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
