'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Container } from '@/components/Container';
import { Bars3Icon } from '@heroicons/react/24/outline';
import logo from '@/images/transparent_southern_logo_7.png';
import icon from '@/images/transparent_southern_logo_5.png';

function NavItem({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  let isActive = usePathname() === href;

  return (
    <li onClick={onClick}>
      <Link
        href={href}
        className={clsx(
          'relative block px-3 py-2 transition',
          isActive ? 'text-blue-600' : 'hover:text-blue-600'
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
        )}
      </Link>
    </li>
  );
}

function DesktopNavigation() {
  return (
    <nav className="hidden md:flex">
      <ul className="flex space-x-6 text-md font-semibold text-white">
        <NavItem href="/cars">Cars</NavItem>
        <NavItem href="/business-solutions">Business Solutions</NavItem>
        <NavItem href="/contact">Contact Us</NavItem>
      </ul>
    </nav>
  );
}

function MobileNavigation({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      className={`absolute top-16 right-0 mt-2 w-48 bg-[#19223E] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition transform ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <ul className="py-1 text-white">
        <NavItem href="/cars" onClick={onClose}>Cars</NavItem>
        <NavItem href="/business-solutions" onClick={onClose}>Business Solutions</NavItem>
        <NavItem href="/contact" onClick={onClose}>Contact Us</NavItem>
      </ul>
    </div>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#19223E] shadow-md">
      <Container className="flex justify-between items-center px-4 py-4">
        {/* Title, Logo, and Navigation in One Line */}
        <div className="flex items-center space-x-4 md:space-x-12">
          {/* Clickable Logo Image */}
          <Link href="/" passHref>
            <div className="relative w-44 h-16 cursor-pointer"> {/* Added cursor-pointer for better UX */}
              <Image
                src={logo} // Adjusted the path based on your directory structure
                alt="Southern Rental Cars Logo"
                layout="fill"
                objectFit="contain"
                priority // Prioritize loading for branding
              />
            </div>
          </Link>
          {/* Desktop Navigation */}
          <DesktopNavigation />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden ml-auto text-white absolute top-10 top-4 right-4"
        >
          <Bars3Icon className="h-8 w-8" />
        </button>

        {/* Mobile Navigation */}
        <MobileNavigation isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </Container>
    </header>
  );
}
