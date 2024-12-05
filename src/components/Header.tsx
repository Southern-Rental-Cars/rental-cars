'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon } from '@heroicons/react/24/outline';
import logo from '@/images/transparent_southern_logo_7.png';
import { useUser } from '@/components/contexts/UserContext';
import { useRouter } from 'next/navigation';

export function Header() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);
 const { user, logout } = useUser();
 const router = useRouter();

 const menuOptions = [
   { label: 'Book', href: '/book' },
   { label: 'Business Solutions', href: '/business-solutions' },
   { label: 'Contact', href: '/contact' },
   ...(user
     ? [
         { label: 'Dashboard', href: '/dashboard' },
         { label: 'Logout', action: logout },
       ]
     : [{ label: 'Login', href: '/login' }]),
 ];

 const handleMenuSelect = (option: typeof menuOptions[0]) => {
   if (option.action) {
     option.action();
   } else {
     router.push(option.href!);
   }
   setIsMenuOpen(false);
 };

 useEffect(() => {
   const handleClickOutside = (event: Event) => {
     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
       setIsMenuOpen(false);
     }
   };

   document.addEventListener('mousedown', handleClickOutside);
   return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 return (
<header className="sticky top-0 z-50 bg-[#19223E] shadow-md">
 <div className="max-w-7xl mx-auto px-4 py-4">
   <div className="flex items-center justify-between lg:justify-start">
     {/* Logo */}
     <Link href="/" className="flex-none">
       <div className="relative w-40 h-14 md:w-48 md:h-16">
         <Image 
           src={logo} 
           alt="Southern Rental Cars" 
           layout="fill" 
           objectFit="contain" 
           priority 
         />
       </div>
     </Link>

     {/* Desktop Navigation */}
     <nav className="hidden lg:flex flex-1 justify-center space-x-12">
       {menuOptions.map((option, index) => (
         <Link
           key={index}
           href={option.href || '#'}
           onClick={(e) => {
             if (option.action) {
               e.preventDefault();
               option.action();
             }
           }}
           className="text-white hover:text-blue-400 transition-colors duration-200"
         >
           {option.label}
         </Link>
       ))}
     </nav>

     {/* Mobile Menu Button */}
     <button
       onClick={() => setIsMenuOpen((prev) => !prev)}
       className="lg:hidden flex-none text-white focus:outline-none hover:text-blue-400 transition-colors duration-200"
       aria-label="Toggle menu"
     >
       <Bars3Icon className="h-8 w-8" />
     </button>
   </div>

   {/* Mobile Menu */}
   {isMenuOpen && (
     <div
       ref={menuRef}
       className="absolute top-full right-4 w-48 bg-white rounded-lg overflow-hidden"
     >
       <ul className="divide-y divide-gray-100">
         {menuOptions.map((option, index) => (
           <li key={index}>
             <button
               onClick={() => handleMenuSelect(option)}
               className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 
                        transition-colors duration-200"
             >
               {option.label}
             </button>
           </li>
         ))}
       </ul>
     </div>
   )}
 </div>
</header>
 );
}