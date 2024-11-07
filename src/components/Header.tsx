'use client';

import { useState, useEffect, useRef, ReactNode, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import logo from '@/images/transparent_southern_logo_3.png';
import { useUser } from '@/components/contexts/UserContext';
import { Container } from '@/components/Container';

// Props for NavItem
interface NavItemProps {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
}

// Nav Item Component
function NavItem({ href, children, onClick }: NavItemProps) {
  const isActive = usePathname() === href;
  return (
    <li onClick={onClick} className="inline-block">
      <Link
        href={href}
        className={`relative block px-4 py-2 transition ${
          isActive ? 'text-blue-600' : 'hover:text-blue-600'
        }`}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
        )}
      </Link>
    </li>
  );
}

// Props for DesktopNavigation
interface DesktopNavigationProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

// Desktop Navigation Component
function DesktopNavigation({ isLoggedIn, onLogout }: DesktopNavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);  

  return (
    <nav className="hidden md:flex">
      <ul className="flex items-center space-x-8 text-md font-semibold text-white">
        <NavItem href="/book">Book</NavItem>
        <NavItem href="/business-solutions">Business Solutions</NavItem>
        <NavItem href="/contact">Contact</NavItem>
        {isLoggedIn ? (
          <div className="relative inline-block" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center px-4 py-2 text-white"
            >
              Profile <ChevronDownIcon className="h-5 w-5 ml-2" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <ul className="py-1">
                  <li>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="px-4 py-2 text-white rounded-md">
            Login
          </Link>
        )}
      </ul>
    </nav>
  );
}

// Props for MobileNavigation
interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

// Mobile Navigation Component
function MobileNavigation({ isOpen, onClose, isLoggedIn, onLogout }: MobileNavigationProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const menuOptions = [
    { label: 'Book', value: '/book' },
    { label: 'Business Solutions', value: '/business-solutions' },
    { label: 'Contact', value: '/contact' },
    ...(isLoggedIn
      ? [{ label: 'Dashboard', value: '/dashboard' }, { label: 'Logout', value: 'logout' }]
      : [{ label: 'Login', value: '/login' }]),
  ];

  const handleMenuSelect = (value: string) => {
    if (value === 'logout') onLogout();
    else router.push(value);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  return (
    <div
      ref={menuRef}
      className={`absolute top-16 right-0 mt-5 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <ul className="py-1 text-gray-800">
        {menuOptions.map((option) => (
          <li key={option.value}>
            <button
              onClick={() => handleMenuSelect(option.value)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Header Component
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useUser();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#19223E] shadow-md">
      <Container className="flex justify-between items-center">
        <div className="flex items-center py-4 md:py-8 space-x-8">
          <Link href="/">
            <div className="relative w-44 md:w-80 h-24 cursor-pointer">
              <Image src={logo} alt="Southern Rental Cars Logo" layout="fill" objectFit="contain" priority />
            </div>
          </Link>
          <DesktopNavigation isLoggedIn={!!user} onLogout={logout} />
        </div>
        <button
          onClick={toggleMobileMenu}
          className="md:hidden ml-auto text-white absolute top-12 right-4"
        >
          <Bars3Icon className="h-8 w-8" />
        </button>
        <MobileNavigation
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          isLoggedIn={!!user}
          onLogout={logout}
        />
      </Container>
    </header>
  );
}
