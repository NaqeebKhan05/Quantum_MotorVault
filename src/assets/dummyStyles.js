// src/assets/dummyStyles.js
import { FaStar, FaQuoteLeft, FaCar, FaRoad, FaKey, FaMapMarkerAlt } from 'react-icons/fa';

export const navbarStyles = {
  nav: {
    base: "fixed w-full top-0 z-50 transition-all duration-300",
    scrolled: "py-2",
    notScrolled: "py-4"
  },
  floatingNav: {
    base: "bg-white/95 backdrop-blur-md w-full rounded-full shadow-lg border border-gray-200 transition-all duration-300",
    scrolled: "py-2 px-4 md:px-6",
    notScrolled: "py-3 px-5 md:px-8"
  },
  logoContainer: "flex flex-col items-center text-xl md:text-2xl lg:text-2xl leading-none",
  logoText: "font-bold tracking-wider text-gray-900",
  navLinksContainer: "hidden md:flex md:items-center md:justify-center md:flex-1",
  navLinksInner: "flex items-center space-x-2 md:space-x-4 lg:space-x-6",
  navLink: {
    base: "px-3 py-2 rounded-md text-sm font-medium transition-colors",
    active: "text-orange-600 underline underline-offset-4",
    inactive: "text-gray-700 hover:text-orange-500"
  },
  separator: "hidden md:block h-6 w-px bg-gray-300 mx-2",
  userActions: "hidden md:flex md:items-center md:justify-end md:gap-4",
  authButton: "flex items-center gap-2 cursor-pointer text-gray-700 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2",
  authText: "text-sm font-medium",
  mobileMenuButton: "p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300",
  mobileMenu: {
    container: "md:hidden transition-all duration-200 overflow-hidden",
    open: "max-h-[400px] opacity-100",
    closed: "max-h-0 opacity-0 pointer-events-none"
  },
  mobileMenuInner: "bg-white border-t border-gray-200 shadow-lg mt-2 rounded-b-lg mx-3",
  mobileGrid: "grid grid-cols-1 sm:grid-cols-2 gap-2",
  mobileLink: {
    base: "block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors",
    active: "bg-gray-50 text-orange-600",
    inactive: "text-gray-700 hover:bg-gray-50"
  },
  divider: "border-t border-gray-100 my-1",
  mobileAuthButton: "w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
};

// heroStyles definition unchanged

// loginStyles definition unchanged

// signupStyles definition unchanged

// homeCarsStyles definition corrected where necessary:
export const homeCarsStyles = {
  // ... other unchanged styles ...
  specIconContainer: (isHovered) => `p-2.5 rounded-xl mb-1.5 transition-all ${isHovered ? 'bg-gradient-to-r from-sky-500/10 to-teal-500/10' : 'bg-gray-800'}`,
  specIcon: (isHovered) => `w-4 h-4 ${isHovered ? 'text-orange-400' : 'text-gray-500'}`,
  // ... rest unchanged ...
};

// carDetailStyles definition corrected where necessary:
export const carDetailStyles = {
  // ... other unchanged styles ...
  carouselIndicator: (active) => `w-3 h-3 rounded-full ${active ? 'bg-orange-500' : 'bg-gray-500'}`,
  inputContainer: (active) => `relative rounded-lg border transition-all ${active ? 'border-orange-500' : 'border-gray-600'}`,
  // ... rest unchanged ...
};

// testimonialStyles definition corrected where necessary:
export const testimonialStyles = {
  // ... other unchanged styles ...
  statValue: (color) => `text-4xl sm:text-5xl font-bold ${color} mb-2`,
  statLabel: (color) => `text-sm ${color} font-medium`,
  // ... rest unchanged ...
};

// footerStyles definition unchanged

// contactPageStyles definition corrected where necessary:
export const contactPageStyles = {
  // ... other unchanged styles ...
  iconContainer: (color) => `p-2 rounded-md mr-3 ${color}`,
  input: (isActive) => `w-full pl-10 pr-3 py-2 bg-gray-700/50 text-white rounded-lg border ${isActive ? 'border-orange-500' : 'border-gray-600'} focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm transition-all`,
  select: (isActive) => `w-full pl-10 pr-3 py-2 bg-gray-700/50 cursor-pointer text-white rounded-lg border ${isActive ? 'border-orange-500' : 'border-gray-600'} focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm appearance-none transition-all`,
  textarea: (isActive) => `w-full pl-10 pr-3 py-2 bg-gray-700/50 text-white rounded-lg border ${isActive ? 'border-orange-500' : 'border-gray-600'} focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm transition-all`,
  // ... rest unchanged ...
};

// carPageStyles definition unchanged
