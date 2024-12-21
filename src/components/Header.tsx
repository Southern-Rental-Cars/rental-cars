'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Container } from '@/components/Container'
import { Bars3Icon } from '@heroicons/react/24/outline'
import logo from '@/images/transparent_southern_logo_7.png'

function NavItem({
  href,
  children,
  onClick,
  disabled = false,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  const isActive = usePathname() === href

  return (
    <li onClick={onClick} className="group relative">
      <Link
        href={href}
        className={clsx(
          'relative block px-3 py-2 transition',
          isActive ? 'text-blue-600' : 'text-white hover:text-blue-600',
          disabled && 'cursor-not-allowed text-gray-400',
        )}
        onClick={(e) => disabled && e.preventDefault()}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
        )}
      </Link>
    </li>
  )
}

function DesktopNavigation() {
  return (
    <nav className="hidden md:flex">
      <ul className="text-md flex space-x-4">
        <NavItem href="/vehicles">Vehicles</NavItem>
        {/* <NavItem href="/business-solutions">Business Solutions</NavItem> */}
        <NavItem href="/contact">Contact</NavItem>
      </ul>
    </nav>
  )
}

function MobileNavigation({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div
      ref={menuRef}
      className={`absolute right-4 top-16 mt-2 w-48 transform rounded-md bg-[#19223E] shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <ul className="py-1 text-white">
        <NavItem href="/vehicles" onClick={onClose}>
          Vehicles
        </NavItem>
        {/* <NavItem href="/business-solutions" onClick={onClose}>
          Business Solutions
        </NavItem> */}
        <NavItem href="/contact" onClick={onClose}>
          Contact
        </NavItem>
      </ul>
    </div>
  )
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#19223E] shadow-md">
      <div className="relative mx-auto flex h-16 items-center justify-between px-4 md:px-16">
        {/* Empty div to maintain spacing on mobile */}
        <div className="w-8 md:hidden" />

        {/* Logo - centered on mobile, left on desktop */}
        <Link
          href="/"
          passHref
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform md:static md:left-auto md:translate-x-0 md:translate-y-0"
        >
          <div className="relative h-12 w-32 cursor-pointer">
            <Image
              src={logo}
              alt="Southern Rental Cars Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNavigation />

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="flex items-center text-white md:hidden"
        >
          <Bars3Icon className="h-8 w-8" />
        </button>

        {/* Mobile Navigation */}
        <MobileNavigation isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </div>
    </header>
  )
}
