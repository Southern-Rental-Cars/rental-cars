'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Container } from '@/components/Container'
import { Bars3Icon } from '@heroicons/react/24/outline'
import logo from '@/images/transparent_southern_logo_3.png'

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
    <li onClick={onClick} className="relative group">
      <Link
        href={disabled ? "#" : href}
        className={clsx(
          'relative block px-3 py-2 transition',
          isActive ? 'text-blue-600' : 'hover:text-blue-600',
          disabled && 'text-gray-400 cursor-not-allowed'
        )}
        onClick={(e) => disabled && e.preventDefault()}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
        )}
      </Link>
      {/* Tooltip for 'Coming Soon' */}
      {disabled && (
        <span className="absolute left-0 -bottom-6 w-full text-center text-xs font-semibold text-white bg-gray-700 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Coming Soon
        </span>
      )}
    </li>
  )
}

function DesktopNavigation() {
  return (
    <nav className="hidden md:flex">
      <ul className="text-md flex space-x-6 font-semibold text-white">
        <NavItem href="/vehicles" disabled>Book Vehicle</NavItem>
        <NavItem href="/business-solutions">Business Solutions</NavItem>
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
      className={`absolute right-0 top-16 mt-2 w-48 transform rounded-md bg-[#19223E] shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <ul className="py-1 text-white">
        <NavItem href="/vehicles" onClick={onClose} disabled>Book Vehicle</NavItem>
        <NavItem href="/business-solutions" onClick={onClose}>Business Solutions</NavItem>
        <NavItem href="/contact" onClick={onClose}>Contact</NavItem>
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
      <Container className="flex items-center justify-between">
        {/* Title, Logo, and Navigation in One Line */}
        <div className="flex items-center space-x-4 py-4 md:py-8">
          {/* Clickable Logo Image */}
          <Link href="/" passHref>
            <div className="relative h-24 w-44 cursor-pointer md:w-80">
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
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="absolute right-4 top-12 ml-auto text-white md:hidden"
        >
          <Bars3Icon className="h-8 w-8" />
        </button>

        {/* Mobile Navigation */}
        <MobileNavigation isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </Container>
    </header>
  )
}
