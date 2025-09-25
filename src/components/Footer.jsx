import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaYoutube, FaFacebookF, FaTwitter } from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";

const Footer = () => {
    const { user } = useUser();
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL_ID;

  const isAdmin = user?.emailAddresses?.some(
    (email) => email.emailAddress === adminEmail
  );

  return (
    <footer className="bg-black text-gray-300 px-8 py-6 rounded-4xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* ================= Logo ================= */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="QMV Logo"
            className="h-10 w-auto object-contain"
          />
          <h2 className="text-white font-bold text-lg leading-tight">
            Quantum <br /> MotorVault
          </h2>
        </Link>

        {/* ================= Navigation ================= */}
        <ul className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/search" className="hover:text-white transition">Search</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-white transition">Admin</Link>
          )}
        </ul>

        {/* ================= Social Icons ================= */}
        <div className="flex gap-5">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram className="h-5 w-5 hover:text-white transition" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <FaYoutube className="h-5 w-5 hover:text-white transition" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebookF className="h-5 w-5 hover:text-white transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter className="h-5 w-5 hover:text-white transition" />
          </a>
        </div>
      </div>

      {/* ================= Bottom Strip ================= */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Quantum MotorVault. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
