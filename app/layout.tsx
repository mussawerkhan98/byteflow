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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${cardo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-white" style={{ fontFamily: 'var(--font-space), sans-serif', background: '#040D12' }}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyContactButtons />
      </body>
    </html>
  )
}
