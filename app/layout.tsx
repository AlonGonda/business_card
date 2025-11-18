import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alon Gonda - Professional Saxophonist',
  description: 'Professional saxophone performances for events, weddings, corporate functions, and private occasions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#14b8a6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Alon Gonda" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

