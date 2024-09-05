import { type Metadata } from 'next'
import Link from 'next/link'
import clsx from 'clsx'
import { PhoneIcon } from '@heroicons/react/24/solid'
import { Container } from '@/components/Container';

export const metadata: Metadata = {
  title: 'Contact | Southern Rental Cars',
  description:
    'Contact Southern Rental Cars in The Woodlands, Texas for car, truck, and van rentals. Get in touch by email or phone.',
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
    <Container className="mt-10">
      {/* Column 1: Contact Details */}
        <h1 className="text-center text-5xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          Contact
        </h1>

        <div className="mt-6 space-y-3 text-base text-zinc-600 dark:text-zinc-400">
          <p>
            Southern Rental Cars is the top car rental service in The Woodlands.
            We own a fleet of vehicles with sedans, SUVs, vans, and growing.
            Make a reservation and get top quality service.
          </p>
          <p>For inquiries or to book your next drive, reach out to:</p>
          <a
            href="mailto:sales@southernrentalcars.com"
            className="text-[#00205A] dark:text-blue-700"
          >
            sales@southernrentalcars.com{' '}
          </a>
          or by phone at{' '}
          <a
            href="tel:+1-281-555-5555"
            className="text-[#00205A] dark:text-blue-700"
          >
            +1 (832) 684-7072
          </a>
        </div>

        <ul role="list" className="mt-2">
          <SocialLink
            href="mailto:sales@southernrentalcars.com"
            icon={MailIcon}
            className="border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
          >
            sales@southernrentalcars.com
          </SocialLink>
          <SocialLink
            href="tel:+1-832-684-7072"
            icon={PhoneIcon}
            className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
          >
            +1 (832) 684-7072
          </SocialLink>
        </ul>
    </Container>
  )
}

export default ContactPage
