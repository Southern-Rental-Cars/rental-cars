'use client'; // Ensures this is a client component

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter for logout
import clsx from 'clsx';
import { Container } from '@/components/Container';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline'; // Import the ChevronDown icon for the dropdown
import logo from '@/images/transparent_southern_logo_3.png';
import { useUser } from '@/components/contexts/UserContext'; // Import the useUser hook

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

function DesktopNavigation({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown
  const profileRef = useRef<HTMLDivElement>(null);

  // Close the profile dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="hidden md:flex">
      <ul className="flex space-x-6 text-md font-semibold text-white list-none m-0 p-0">
        <NavItem href="/book">Book</NavItem>
        <NavItem href="/business-solutions">Business Solutions</NavItem>
        <NavItem href="/contact">Contact</NavItem>
        {isLoggedIn ? (
          <>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="ml-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Profile <ChevronDownIcon className="h-5 w-5 ml-2" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
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
          </>
        ) : (
          <Link
            href="/login"
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </ul>
    </nav>
  );
}

function MobileNavigation({ isOpen, onClose, isLoggedIn, onLogout }: { isOpen: boolean; onClose: () => void; isLoggedIn: boolean; onLogout: () => void }) {
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
      <ul className="py-1 text-white list-none m-0 p-0">
        <NavItem href="/vehicles" onClick={onClose}>Book</NavItem>
        <NavItem href="/business-solutions" onClick={onClose}>Business Solutions</NavItem>
        <NavItem href="/contact" onClick={onClose}>Contact</NavItem>
        {isLoggedIn ? (
          <>
            <NavItem href="/dashboard" onClick={onClose}>Dashboard</NavItem>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="block w-full px-4 py-2 text-left text-white hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="block px-4 py-2 text-white hover:bg-blue-600 hover:text-white transition"
            onClick={onClose}
          >
            Login
          </Link>
        )}
      </ul>
    </div>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser } = useUser(); // Access the user and setUser from UserContext
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setUser(null); // Clear user from the context
    localStorage.removeItem('user'); // Clear user from localStorage
    router.push('/'); // Redirect to homepage or login page after logout
  };

  return (
    <header className="sticky top-0 z-50 bg-[#19223E] shadow-md">
      <Container className="flex justify-between items-center">
        {/* Title, Logo, and Navigation in One Line */}
        <div className="flex items-center py-4 md:py-8 space-x-4">
          {/* Clickable Logo Image */}
          <Link href="/" passHref>
            <div className="relative w-44 md:w-80 h-24 cursor-pointer">
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
          <DesktopNavigation
            isLoggedIn={!!user} // Pass login status
            onLogout={handleLogout} // Handle logout
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden ml-auto text-white absolute top-12 right-4"
        >
          <Bars3Icon className="h-8 w-8" />
        </button>

        {/* Mobile Navigation */}
        <MobileNavigation
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          isLoggedIn={!!user} // Pass login status
          onLogout={handleLogout} // Handle logout
        />
      </Container>
    </header>
  );
}
