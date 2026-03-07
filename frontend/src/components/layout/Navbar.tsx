"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, logout } = useAuth(); // adjust based on your actual hook return
  const [mounted, setMounted] = useState(false);

  const isLoggedIn = mounted && !!token;
  useEffect(() => {
    setMounted(true);
  }, []);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { title: "About", href: "/about" },
    ...(isLoggedIn ? [{ title: "Dashboard", href: "/dashboard/" }] : []),
  ];

  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const, // Add this
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring" as const, // Add this
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <nav className="nav-class">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand Name - Hidden on mobile */}
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring" as const,
              stiffness: 260,
              damping: 20,
            }}
          >
            <Link href="/">
              <span className="font-bold text-light-blue text-xl">T</span>
            </Link>
          </motion.div>
          <div className="hidden md:block">
            <p className="font-bold text-secondary-grey text-lg">TaskMind AI</p>
            <p className="text-xs text-primary-grey">
              All in one productivity app
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="text-gray-600 hover:text-rose-500 transition-colors duration-200"
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Desktop right-side elements */}
        {/* Desktop right-side elements */}
        <div className="hidden lg:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="text-primary-grey font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <motion.button
                  className="px-6 py-3 rounded-full font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-primary-grey font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-800 p-2 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <motion.div
          className="lg:hidden flex flex-col items-center mt-4 space-y-4"
          variants={menuVariants}
          initial="closed"
          animate="open"
        >
          {navLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="text-primary-grey text-lg hover:text-rose-500 transition-colors duration-200"
            >
              {link.title}
            </a>
          ))}
          <div className="flex items-center space-x-4 mt-4">
            <motion.button
              className="font-semibold text-primary-grey px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button
              className="px-6 py-3 rounded-full font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};
