import type { Metadata } from 'next'
import { Space_Grotesk, Cardo } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import StickyContactButtons from './components/StickyContactButtons'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['300', '400', '500', '600', '700'],
})

const cardo = Cardo({
  subsets: ['latin'],
  variable: '--font-cardo',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Byteflow Information Technology',
  description: 'Leading IT solutions provider trusted by 500+ businesses across Dubai and UAE since 2017.',
  verification: {
    google: 'tAM-FG-hPH1-sxVzCRVhEVnLM0OhIATbEoeYXTTShc4',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${cardo.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-space), sans-serif', background: 'var(--bg-page)' }}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyContactButtons />
      </body>
    </html>
  )
}
