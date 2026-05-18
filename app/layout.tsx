import type { Metadata } from 'next'
import { Inter, Special_Gothic_Expanded_One } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const specialGothic = Special_Gothic_Expanded_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-special-gothic',
  display: 'swap',
})

const baseUrl = 'https://r-o-design.tech'

const description =
  'Roman Ovcharenko — Product Designer with 6+ years in B2B SaaS, enterprise tools, and design systems. Turning complex products into clear, usable interfaces.'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s — Roman Ovcharenko',
    default: 'Roman Ovcharenko — Product Designer',
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Roman Ovcharenko',
    title: 'Roman Ovcharenko — Product Designer',
    description,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roman Ovcharenko — Product Designer',
    description,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${specialGothic.variable}`}
    >
      <body suppressHydrationWarning>
        {/* Inline script runs before paint to apply saved theme and avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(d?'dark':'light'));})();`,
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
