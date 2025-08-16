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
        title="Your Goals, Organized"
        subtitle="Plan smarter, live easier"
        description="Easily organize tasks, track your progress, and see your achievements grow over time."
        imageSrc="/images/integration-mockup.png"
      />
      <AppFeatureSection
        title="Stay On Top of Your Day"
        subtitle="Clarity meets control"
        description="From to-do lists to detailed charts, keep your work and progress in perfect sync."
        imageSrc="/images/integration-mockup.png"
        reverseLayout={true}
      />
      <AppFeatureSection
        title="All About You"
        subtitle="Your workspace, your way"
        description="Customize your profile, manage tasks, and stay productive in a space built just for you."
        imageSrc="/images/integration-mockup.png"
      />
      <AppFeatureSection
        title="Seamless Integration"
        subtitle="Connect effortlessly"
        description="Sync with all your favorite tools in just a few clicks. No coding required."
        imageSrc="/images/integration-mockup.png"
        reverseLayout={true}
      />
      <AppFeatureSection
        title="Visualize Your Progress"
        subtitle="Productivity at a glance"
        description="Turn your completed tasks into clear, beautiful charts that motivate you to keep going."
        imageSrc="/images/integration-mockup.png"
      />
      <AppFeatureSection
        title="Your Productivity Story"
        subtitle="Track. Improve. Achieve."
        description="See how far you’ve come with interactive charts and a dashboard that grows with you."
        imageSrc="/images/integration-mockup.png"
        reverseLayout={true}
      />
      <FooterSection />
    </div>
  );
}
