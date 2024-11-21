import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faYelp, faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { ContainerInner, ContainerOuter } from '@/components/Container';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="transition hover:text-blue-500 dark:hover:text-blue-400"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="flex-none bg-gray-50 dark:bg-zinc-900">
      <ContainerOuter>
        <div className="border-t border-zinc-200 dark:border-zinc-700/40 py-10">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-10 sm:flex-row">
              {/* Navigation Links */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <NavLink href="/vehicles">Book</NavLink>
                <NavLink href="/business-solutions">Business Solutions</NavLink>
                <NavLink href="/contact">Contact</NavLink>
                <NavLink href="/privacy-policy">Privacy</NavLink>
                <NavLink href="/terms-and-conditions">Terms & Conditions</NavLink>
              </div>

              {/* Social Media Links */}
              <div className="flex gap-6">
                <Link
                  href="https://www.instagram.com/southernrentalcars/"
                  target="_blank"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="h-6 w-6 text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors"
                  />
                </Link>
                <Link
                  href="https://www.yelp.com/biz/southern-rental-cars-the-woodlands"
                  target="_blank"
                  aria-label="Yelp"
                >
                  <FontAwesomeIcon
                    icon={faYelp}
                    className="h-6 w-6 text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors"
                  />
                </Link>
                <Link
                  href="https://g.co/kgs/yA9XKBS"
                  target="_blank"
                  aria-label="Google"
                >
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="h-6 w-6 text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors"
                  />
                </Link>
                <Link
                  href="https://www.facebook.com/southernrentalcars"
                  target="_blank"
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="h-6 w-6 text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors"
                  />
                </Link>
              </div>

              {/* Footer Text */}
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center sm:text-right">
                &copy; {new Date().getFullYear()} Southern Rental Cars LLC. All rights reserved.
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  );
}
