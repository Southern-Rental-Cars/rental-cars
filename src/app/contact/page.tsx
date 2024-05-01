import { type Metadata } from 'next'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { PhoneIcon } from '@heroicons/react/24/solid'

export const metadata: Metadata = {
  title: 'Contact | Texas Rental Cars',
  description:
    'Contact Texas Rental Cars in The Woodlands, Texas for car, truck, and van rentals. Get in touch by email or phone.',
}

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

const ContactPage = async () => {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        {/* Column 1: Contact Details */}
        <div className="lg:pl-20">
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

          <ul role="list" className="mt-8">
            <SocialLink
              href="mailto:info@texasrentalcars.com"
              icon={MailIcon}
              className="border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              info@texasrentalcars.com
            </SocialLink>
            <SocialLink
              href="tel:+1-832-334-3802"
              icon={PhoneIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              +1 (832) 334-3802
            </SocialLink>
          </ul>
        </div>

        {/* Column 2: Map */}
        <div className="h-96 overflow-hidden rounded-lg lg:order-first lg:h-auto">
          {' '}
          <iframe
            src="https://storage.googleapis.com/maps-solutions-994uusg9w0/locator-plus/ikr6/locator-plus.html"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </Container>
  )
}

export default ContactPage
