import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import portraitImage from '@/images/logo.png'
import { PhoneIcon } from '@heroicons/react/24/solid'

const SocialLink = ({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) => (
  <li className={clsx(className, 'flex')}>
    <Link
      href={href}
      className="group flex text-sm font-medium text-zinc-800 transition hover:text-[#00205A] dark:text-zinc-200 dark:hover:text-[#00205A]"
    >
      <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-[#00205A]" />
      <span className="ml-4">{children}</span>
    </Link>
  </li>
)

const MailIcon = (props: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Texas Rental Cars is a car rental company located in The Woodlands, Texas. We offer a wide range of vehicles for rent, including cars, trucks, and vans.',
}

export default function Contact() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Contact Us
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              Texas Rental Cars is a car rental company located in The
              Woodlands, Texas. We offer a wide range of vehicles for rent,
              including cars, trucks, and vans.
            </p>
            <p>
              If you have any questions or would like to make a reservation,
              please contact us by email at{' '}
              <a
                href="mailto:info@texasrentalcars.com"
                className="text-[#00205A] dark:text-blue-700"
              >
                info@texasrentalcars.com{' '}
              </a>
              {/* space */}
              or by phone at{' '}
              <a
                href="tel:+1-281-555-5555"
                className="text-[#00205A] dark:text-blue-700"
              >
                +1 (832) 334-3802
              </a>{' '}
              and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="mailto:info@texasrentals.io"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              info@texasrentalcars.com
            </SocialLink>
            <div className="mt-8 flex space-x-4 border-t border-zinc-100 pt-8 dark:border-zinc-700/40">
              <PhoneIcon className="h-6 w-6 flex-none fill-zinc-500" />
              <a
                href="tel:+1-832-684-7072"
                className="group flex text-sm font-medium text-zinc-800 transition hover:text-[#00205A] dark:text-zinc-200 dark:hover:text-[#00205A]"
              >
                +1 (832) 684-7072
              </a>
            </div>
          </ul>
        </div>
      </div>
    </Container>
  )
}
