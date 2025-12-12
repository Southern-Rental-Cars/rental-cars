import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInstagram,
  faYelp,
  faGoogle,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons'
import { ContainerOuter, ContainerInner } from '@/components/Container'

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
      className="transition text-zinc-400 hover:text-gold-500"
    >
      {children}
    </Link>
  )
}

function SocialLink({
  href,
  icon,
}: {
  href: string
  icon: any
}) {
  return (
    <Link href={href} target="_blank" className="group">
      <FontAwesomeIcon
        icon={icon}
        className="h-5 w-5 text-zinc-400 transition group-hover:text-gold-500"
      />
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy-900 flex-none pt-16 pb-10">
      <ContainerOuter>
        <ContainerInner>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-1 text-sm font-medium">
              <NavLink href="/vehicles">Vehicles</NavLink>
              {/* <NavLink href="/business-solutions">Business Solutions</NavLink> */}
              <NavLink href="/contact">Contact</NavLink>
              <NavLink href="/privacy-policy">Privacy Policy</NavLink>
            </div>
            <div className="flex gap-6">
              <SocialLink
                href="https://www.instagram.com/southernrentalcars/"
                icon={faInstagram}
              />
              <SocialLink
                href="https://www.yelp.com/biz/southern-rental-cars-the-woodlands"
                icon={faYelp}
              />
              <SocialLink href="https://g.co/kgs/yA9XKBS" icon={faGoogle} />
              <SocialLink
                href="https://www.facebook.com/southernrentalcars"
                icon={faFacebook}
              />
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} Southern Rental Cars LLC. All rights reserved.
            </p>
            <p className="text-xs text-zinc-600">
              Serving The Woodlands & Greater Houston Area
            </p>
          </div>
        </ContainerInner>
      </ContainerOuter>
    </footer>
  )
}