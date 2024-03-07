import { type Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Texas Rental Cars',
    default:
      'Texas Rental Cars is a car rental company located in The Woodlands, Texas. We offer a wide range of vehicles for rent, including cars, trucks, and vans.',
  },
  description:
    'Texas Rental Cars is a car rental company located in The Woodlands, Texas. We offer a wide range of vehicles for rent, including cars, trucks, and vans.',
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
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
    </html>
  )
}
