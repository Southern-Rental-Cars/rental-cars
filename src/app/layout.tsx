import { type Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter, Playfair_Display } from 'next/font/google'
import clsx from 'clsx'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    template: 'Southern Rental Cars',
    default: 'Southern Rental Cars',
  },
  description:
    'Welcome to Southern Rental Cars based in The Woodlands, Texas. We offer delivery, and pick-up in the greater Houston area.',
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Add font variables to the html tag
    <html lang="en" className={clsx("h-full antialiased", inter.variable, playfair.variable)} suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black text-zinc-900 font-sans">
        <Providers>
          <div className="flex w-full">
            <Layout>
              {children}
              <Analytics />
              <SpeedInsights />
              <GoogleTagManager gtmId={process.env.GTAG_ID || ''} />
              <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6338076895094129"
              />
            </Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
