"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, SquareX, SquareChevronRight } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const links = [
    { label: "خانه", href: "/" },
    { label: "داشبورد", href: "/" },
    { label: "تماس با ما", href: "/contact" },
    { label: "خدمات", href: "#" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="w-full fixed top-0 z-50 px-2">
        <div className="max-w-5xl bg-white shadow-lg/10 ring-2 ring-[var(--main-color)] rounded-xl mt-2  mx-auto px-4 py-3 flex items-center justify-between">

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-700">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-[var(--main-color)] transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <SquareX size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Logo */}
          <div className="text-[var(--main-color)] font-extrabold text-xl font-Morabba">
            <Image alt="logo" src='/images/logo.jpg' width={100} height={100}/>
          </div>

        </div>

        {/* Mobile Menu */}
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 backdrop-blur-sm ${
            menuOpen ? "opacity-100 bg-black/30 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Mobile Menu */}
        <aside
          className={`
            fixed top-0 right-0 h-full w-64 bg-white shadow-xl rounded-l-2xl transform-gpu will-change-transform transition-all duration-500 ease-out z-50
            md:hidden
            ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Mobile header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="text-[var(--main-color)] font-extrabold text-xl font-Morabba">
                <Link href="/">
                  <Image alt="logo" src="/images/logo.jpg" width={100} height={100} />
                </Link>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-gray-600">
                <SquareChevronRight size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col flex-1">
              <div className="p-4 flex-1">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all mb-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-sm font-semibold">{link.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </aside>
      </nav>

      {/* Landing Section */}
      <main className="min-h-screen flex flex-col items-center justify- px-6  text-[var(--foreground)] font-Morabba mt-40">
        {/* Header */}
        <Image src="/images/final.png" alt="header" width={600} height={600} />

        {/* CTA Buttons */} 
        {isLoggedIn ? (
          <Link href="/dashboard">
            <button className="flex cursor-pointer items-center gap-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all">
              <ArrowRight className="text-xl" />
              داشبورد
            </button>
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link href="/signin" className="flex-1">
              <button className="w-full flex cursor-pointer items-center justify-center gap-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all">
                <ArrowRight className="text-xl" />
                ورود
              </button>
            </Link>
            <Link href="/signup" className="flex-1">
              <button className="w-full flex cursor-pointer items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[var(--main-color)] border-2 border-[var(--main-color)] px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all">
                ثبت نام
              </button>
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full  bg-white border-t border-gray-200 py-4 mt-auto text-center text-gray-500 text-sm font-medium shadow-inner">
        © {new Date().getFullYear()} ایران راد | تمامی حقوق محفوظ است.
      </footer>
    </>
  );
}
