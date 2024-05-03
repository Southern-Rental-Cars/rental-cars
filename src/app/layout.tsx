import { type Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    template: 'Texas Rental Cars',
    default: 'Texas Rental Cars',
  },
  description:
    'Welcome to Texas Rental Cars based in The Woodlands, Texas. We offer a wide range of vehicles for rent, delivery, and pick-up in the greater Houston area. We are a family-owned and operated business that provides exceptional customer service and competitive pricing. Our goal is to make your rental experience as easy and convenient as possible. We look forward to serving you!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>
              {children}
              <Analytics />
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
