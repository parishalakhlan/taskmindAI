"use client";

import React from "react";

import { Navbar } from "@/components/layout/Navbar";
import { AppFeatureSection } from "@/components/layout/AppFeatureSection";

import {
  FooterSection,
  FeaturesSection,
  HeroSection,
} from "@/components/layout/Footer";
export default function App() {
  return (
    <div className="min-h-screen font-sans">
      {/* Navbar  */}
      <Navbar />
      {/*  Hero Section  */}
      <HeroSection />
      <FeaturesSection />
      <AppFeatureSection
        title="Smart Task Management"
        subtitle="Plan. Create. Conquer."
        description="Create tasks in seconds, organize them with ease, and keep everything in one simple, powerful list."
        imageSrc="/newTask.png"
        priority={true}
      />

      <AppFeatureSection
        title="Your Dashboard, Your Control"
        subtitle="One view to rule them all"
        description="Stay on top of your day with a clean dashboard that shows exactly what matters — tasks, progress, and insights."
        imageSrc="/Dashboard.png"
        reverseLayout={true}
        priority={true}
      />

      <AppFeatureSection
        title="Track Weekly Progress"
        subtitle="Small steps, big wins"
        description="Visualize your week with bar and donut charts that turn your progress into clear, motivating insights."
        imageSrc="/BarChart.png"
        priority={true}
      />

      <AppFeatureSection
        title="Stay in Sync"
        subtitle="Your tasks, your flow"
        description="Whether it’s today’s priorities or long-term goals, everything stays connected and updated in real-time."
        imageSrc="/TaskList.png"
        reverseLayout={true}
        priority={true}
      />

      <AppFeatureSection
        title="Data That Motivates"
        subtitle="Progress you can see"
        description="Your completed tasks transform into charts that not only look good, but also push you to achieve more."
        imageSrc="/donutChart.png"
        priority={true}
      />

      <AppFeatureSection
        title="Your Profile Hub"
        subtitle="Personalized for you"
        description="Manage your profile, view your achievements, and watch your productivity story unfold in one place."
        imageSrc="/Profile.png"
        reverseLayout={true}
        priority={true}
      />

      <FooterSection />
    </div>
  );
}
