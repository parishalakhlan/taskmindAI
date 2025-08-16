import React from "react";
import { motion } from "framer-motion";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
// --- Custom SVG components for the Hero section ---
const LightbulbSVG = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 14c.07-.34.13-.68.19-1.02a11.19 11.19 0 0 0 .5-3.32c0-2.8-1.57-4.9-5-4.9S5 6.88 5 9.66a11.16 11.16 0 0 0 .5 3.32c.07.34.13.68.19 1.02" />
    <path d="M9 18h6a2 2 0 0 0 2-2v-2H7v2a2 2 0 0 0 2 2z" />
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
  </svg>
);

const PaperPlaneSVG = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12l-18 9V3l18 9z" />
  </svg>
);

const BlobSVG = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    fill="currentColor"
    className={className}
  >
    <path d="M100 0c27.6 0 50 22.4 50 50s-22.4 50-50 50S50 77.6 50 50 72.4 0 100 0z" />
  </svg>
);

const StarSVG = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.27l-6.18 3.28L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Main Hero Section Component
export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Animation for the floating SVGs
  const floatingItemVariants = {
    animate: (i: number) => ({
      y: [0, i % 2 === 0 ? -10 : 10, 0],
      rotate: [0, i * 5, 0],
      transition: {
        duration: 6,
        ease: "easeInOut" as const, // Add 'as const' to narrow the type
        repeat: Infinity,
        delay: i * 0.3,
      },
    }),
  };

  // Array of our custom SVG components with their positions and Tailwind styles
  const cartoonElements = [
    {
      id: 1,
      className: "top-10 left-10 w-12 md:w-20 text-indigo-500",
      element: <LightbulbSVG />,
    },
    {
      id: 2,
      className: "top-1/4 left-1/4 w-10 md:w-16 text-rose-400",
      element: <PaperPlaneSVG />,
    },
    {
      id: 3,
      className: "bottom-10 left-20 w-8 md:w-12 text-teal-400",
      element: <StarSVG />,
    },
    {
      id: 4,
      className: "top-1/2 right-1/4 w-16 md:w-24 text-fuchsia-400",
      element: <BlobSVG />,
    },
    {
      id: 5,
      className: "bottom-20 right-10 w-10 md:w-16 text-orange-400",
      element: <StarSVG />,
    },
    {
      id: 6,
      className: "top-1/3 left-1/2 w-8 md:w-12 text-blue-500",
      element: <PaperPlaneSVG />,
    },
    {
      id: 7,
      className: "top-[80%] left-[80%] w-10 md:w-16 text-yellow-500",
      element: <LightbulbSVG />,
    },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen bg-gray-50 flex items-center justify-center p-4 font-inter">
      {/* Floating cartoon elements */}
      {cartoonElements.map((element, index) => (
        <motion.div
          key={element.id}
          className={`absolute ${element.className}`}
          variants={floatingItemVariants}
          animate="animate"
          custom={index + 1}
        >
          {element.element}
        </motion.div>
      ))}

      {/* Hero content */}
      <div className="container mx-auto text-center z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4"
            variants={itemVariants}
          >
            Be productive, Be more with{" "}
            <span className="relative inline-block">
              TaskMind AI
              <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#6a82fb] to-[#fc5c7d]"></span>
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <span className="font-semibold">
              {" "}
              Because your brain is doing 100 things — let TaskMind do the rest.{" "}
            </span>
            <br />
            An AI that organizes your world the way you actually live it.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// New Footer Section Component
export const FooterSection = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const, // Add 'as const' to narrow the type
      },
    },
  };

  const sections = [
    {
      title: "Navigation",
      links: ["Home", "Dashboard", "About", "Blog"],
    },
    {
      title: "Contact",
      links: ["FAQ", "TOS"],
    },
    {
      title: "Social",
      links: ["Github", "LinkedIn"],
    },
    {
      title: "Grow",
      links: ["Contact Us", "Help"],
    },
  ];

  return (
    <motion.footer
      className="bg-gray-800 text-gray-300 p-8 md:p-12 font-inter"
      variants={footerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Company Info */}
        <div className="lg:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            {/* Using a placeholder for the logo, as per the screenshot */}
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-gray-800 font-bold">
              T
            </div>
            <div>
              <p className="font-bold text-gray-100 text-lg">TaskMind AI</p>
              <p className="text-xs text-gray-400">A productivity app</p>
            </div>
          </div>
          <p className="text-sm mb-6 text-gray-400 max-w-sm">
            {"Hey hope you are good. All the best for your grind."}
          </p>
          <div className="flex space-x-4">
            <motion.div
              className="text-white bg-gray-600 hover:bg-pink-600 transition-colors rounded-full p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="https://www.linkedin.com/in/parisha-lakhlan-a0baab235/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="w-5 h-5" />{" "}
              </Link>
            </motion.div>
            <motion.div
              className="text-white bg-gray-600 hover:bg-blue-400 transition-colors rounded-full p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="https://github.com/parishalakhlan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="w-5 h-5"></FaGithub>{" "}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Links Sections */}
        {sections.map((section, index) => (
          <div key={index} className="lg:col-span-1">
            <h3 className="font-semibold text-gray-100 mb-4">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-12 pt-6 border-t border-gray-700">
        &copy; 2025 TaskMind. All right reserved
      </div>
    </motion.footer>
  );
};

// Features Section Component
export const FeaturesSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const, // Add 'as const' to narrow the type
      },
    },
  };
  const buttonVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const, // Add 'as const' to narrow the type
      },
    },
  };

  return (
    <motion.section
      className="bg-gray-50 flex flex-col items-center justify-center p-8 md:p-12 text-center font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.p className="text-sm font-semibold text-rose-500 uppercase tracking-widest mb-4">
        Our Features
      </motion.p>

      <motion.h2
        className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        We are more than a productivity app, We are all in one productivity apps
      </motion.h2>

      <motion.div
        className="mt-12"
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
      >
        <button
          onClick={() => {
            const targetSection = document.getElementById("next-section-id");
            if (targetSection) {
              targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-pink-400 
               text-white shadow-lg transform transition-all duration-300 cursor-pointer"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </button>
      </motion.div>

      <p className="mt-4 text-gray-600 uppercase tracking-wide">Scroll Down</p>
    </motion.section>
  );
};
