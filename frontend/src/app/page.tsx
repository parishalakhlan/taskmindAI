// src/app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        <div className="text-xl font-bold text-blue-600">TaskMind AI</div>

        <div className="space-x-6 hidden md:flex">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link href="/signup" className="text-gray-700 hover:text-blue-600">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to TaskMind AI</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Simplify your tasks with AI. Manage, track, and boost your
          productivity with ease.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold">Smart AI Tasks</h3>
            <p className="text-sm text-gray-600">
              Create and organize tasks with AI help.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Reminders & Deadlines</h3>
            <p className="text-sm text-gray-600">
              Never miss a deadline again.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Collaborate Easily</h3>
            <p className="text-sm text-gray-600">
              Invite others to manage tasks with you.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center text-sm">
        &copy; 2025 TaskMind AI. All rights reserved.
      </footer>
    </main>
  );
}
