import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faYelp, faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { ContainerInner, ContainerOuter } from '@/components/Container'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="transition hover:text-blue-500 dark:hover:text-blue-400"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <NavLink href="/vehicles">Book reservation</NavLink>
                <NavLink href="/business-solutions">Business Solutions</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </div>
              <div className="flex gap-6">
                <Link href="https://www.instagram.com/southernrentalcars/" target="_blank">
                  <FontAwesomeIcon icon={faInstagram} className="h-6 w-6 text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors" />
                </Link>
                <Link href="https://www.yelp.com/biz/southern-rental-cars-the-woodlands" target="_blank">
                  <FontAwesomeIcon icon={faYelp} className="h-6 w-6 text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors" />
                </Link>
                <Link href="https://g.co/kgs/yA9XKBS" target="_blank">
                  <FontAwesomeIcon icon={faGoogle} className="h-6 w-6 text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors" />
                </Link>
                <Link href="https://www.facebook.com/southernrentalcars" target="_blank">
                  <FontAwesomeIcon icon={faFacebook} className="h-6 w-6 text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors" />
                </Link>
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Southern Rental Cars LLC. All
                rights reserved.
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
