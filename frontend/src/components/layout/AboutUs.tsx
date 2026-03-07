"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Navbar } from "@/components/layout/Navbar";
import {
  Briefcase,
  Code,
  GraduationCap,
  BarChart,
  User,
  ExternalLink,
  Loader2,
  Layers,
  CheckCircle2,
} from "lucide-react";

// Define a type for a skill
type Skill = {
  name: string;
  icon: React.ReactNode;
};

// Define a type for a feature

// Define a type for a link
type Link = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

// Main component for the About page
export default function AboutUs() {
  const [loading, setLoading] = useState(true);

  // Simulate a loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Your personal data (mock data - replace with your own)
  const personalInfo = {
    name: "Parisha Lakhlan",
    tagline: "Full-Stack Developer | Innovator | Problem Solver",
    bio: "I am a passionate developer with a knack for building intuitive and efficient web applications. My journey started with a fascination for how things work, leading me to create robust and scalable solutions. My latest project is a comprehensive task management app designed to streamline workflows and boost productivity.",
    profilePicUrl: "https://placehold.co/400x400/fff/374151?text=PL",
  };

  // Your task management app data
  const appInfo = {
    name: "TaskMind AI",
    description:
      "TaskMind is a modern, intuitive task management application built to help individuals and teams organize their work effortlessly. With features like real-time updates, customizable workflows, and intelligent notifications, it's designed to bring clarity and efficiency to your daily tasks.",
    features: [
      {
        name: "Task Management",
        description:
          "Easily add, edit, and organize your personal tasks with a clean, intuitive interface.",
        icon: <Layers size={24} />,
      },
      {
        name: "Personal Dashboard",
        description:
          "View all your tasks, stats, and progress in one simple, organized space.",
        icon: <CheckCircle2 size={24} />,
      },
      {
        name: "Progress & Charts",
        description:
          "Track your productivity trends with clear, interactive charts.",
        icon: <BarChart size={24} />,
      },
      {
        name: "Profile Management",
        description:
          "Customize your profile and keep your personal workspace organized.",
        icon: <User size={24} />,
      },
    ],
  };

  // Your skills
  const skills: Skill[] = [
    {
      name: "Next.js",
      icon: (
        <NextImage
          src="https://www.svgrepo.com/show/374026/nextjs.svg"
          alt="Next.js"
          width={20}
          height={20}
          className="h-6 w-6"
        />
      ),
    },
    {
      name: "React",
      icon: (
        <NextImage
          src="https://www.svgrepo.com/show/452092/react.svg"
          alt="React"
          className="h-6 w-6"
          width={20}
          height={20}
        />
      ),
    },
    {
      name: "TypeScript",
      icon: (
        <NextImage
          src="https://www.svgrepo.com/show/374146/typescript.svg"
          alt="TypeScript"
          width={20}
          height={20}
          className="h-6 w-6"
        />
      ),
    },
    {
      name: "Tailwind CSS",
      icon: (
        <NextImage
          src="https://www.svgrepo.com/show/374118/tailwind.svg"
          alt="Tailwind CSS"
          width={20}
          height={20}
          className="h-6 w-6"
        />
      ),
    },
    {
      name: "Node.js",
      icon: (
        <NextImage
          src="https://www.svgrepo.com/show/378877/node-js.svg"
          alt="Node.js"
          width={20}
          height={20}
          className="h-6 w-6"
        />
      ),
    },
    {
      name: "Express.js",
      icon: (
        <NextImage
          src="https://www.svgrepo.com/show/373595/graphql.svg"
          alt="GraphQL"
          width={20}
          height={20}
          className="h-6 w-6"
        />
      ),
    },
    {
      name: "JavaScript",
      icon: (
        <NextImage
          src="https://www.svgrepo.com/show/373595/graphql.svg"
          alt="GraphQL"
          width={20}
          height={20}
          className="h-6 w-6"
        />
      ),
    },
    {
      name: "MongoDB",
      icon: (
        <NextImage
          src="https://www.svgrepo.com/show/373845/mongodb.svg"
          alt="MongoDB"
          width={20}
          height={20}
          className="h-6 w-6"
        />
      ),
    },
  ];

  // Your social and portfolio links
  const socialLinks: Link[] = [
    { name: "Portfolio", url: "#", icon: <Briefcase size={20} /> },
    { name: "LinkedIn", url: "#", icon: <FaLinkedin size={20} /> },
    { name: "GitHub", url: "#", icon: <FaGithub size={20} /> },
  ];

  // Animation variants for Framer Motion
  // Replace your current variants with these
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
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const, // Use 'as const' to narrow the type
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-800">
        <Loader2 className="animate-spin h-10 w-10 text-rose-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatePresence>
        <motion.div
          className="bg-white text-gray-900 min-h-screen p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center font-inter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Main Container */}
          <motion.div
            className="container mx-auto max-w-5xl space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Hero Section */}
            <motion.section
              className="flex flex-col md:flex-row items-center gap-8 md:gap-16 text-center md:text-left p-6 bg-gray-50 rounded-3xl shadow-xl shadow-gray-200"
              variants={itemVariants}
            >
              <motion.img
                src={personalInfo.profilePicUrl}
                alt="Profile Picture"
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-rose-500 shadow-xl transition-transform duration-300 hover:scale-105"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              />
              <motion.div className="flex flex-col items-center md:items-start space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                  {" Hi , I'm "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
                    {personalInfo.name}
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 font-semibold">
                  {personalInfo.tagline}
                </p>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
                  {personalInfo.bio}
                </p>
              </motion.div>
            </motion.section>

            {/* Task Management App Section */}
            <motion.section
              className="p-6 bg-gray-50 rounded-3xl shadow-xl shadow-gray-200"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <Code size={36} className="text-rose-500" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  My Application: {appInfo.name}
                </h2>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                {appInfo.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {appInfo.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 transition-transform duration-300 hover:scale-105 hover:bg-pink-100"
                    variants={itemVariants}
                  >
                    <div className="text-rose-500 p-3 bg-white rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Skills & Education Section */}
            <motion.section
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              {/* Skills */}
              <motion.div
                className="p-6 bg-gray-50 rounded-3xl shadow-xl shadow-gray-200"
                variants={itemVariants}
              >
                <div className="flex items-center gap-4 mb-6">
                  <Code size={36} className="text-rose-500" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    My Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-105 hover:bg-pink-100 hover:text-gray-900"
                      variants={itemVariants}
                    >
                      {skill.icon}
                      <span>{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Education */}
              <motion.div
                className="p-6 bg-gray-50 rounded-3xl shadow-xl shadow-gray-200"
                variants={itemVariants}
              >
                <div className="flex items-center gap-4 mb-6">
                  <GraduationCap size={36} className="text-rose-500" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Education
                  </h2>
                </div>
                <div className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Bachelor of Computer Science and Technology
                    </h3>
                    <p className="text-gray-600">
                      Guru Jambeshwar University of Science
                      <br /> and Technology,2026
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.section>

            {/* Portfolio & Socials Section */}
            <motion.section
              className="p-6 bg-gray-50 rounded-3xl shadow-xl shadow-gray-200"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <ExternalLink size={36} className="text-rose-500" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Connect with Me
                </h2>
              </div>
              <div className="flex flex-wrap justify-center gap-6 md:justify-start">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-100 rounded-full transition-colors duration-300 hover:bg-pink-100 text-gray-700 hover:text-gray-900"
                    variants={itemVariants}
                  >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.section>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
