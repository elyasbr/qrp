"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, Square } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const links = [
    { label: "خانه", href: "/" },
    { label: "درباره ما", href: "#" },
    { label: "تماس با ما", href: "#" },
    { label: "خدمات", href: "#" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-white  shadow-md fixed top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

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
          
          {/* Logo */}
          <div className="text-[var(--main-color)] font-extrabold text-xl font-Morabba">
            <Image alt="logo" src='/images/logo.jpg' width={100} height={100}/>
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <Square size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden">
            <div className="flex flex-col gap-3 p-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-[var(--main-color)] transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Landing Section */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#f8f9fb] text-[var(--foreground)] font-Morabba pt-32">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[var(--main-color)] mb-6 leading-tight">
          سامانه بیمه<br />آنلاین و هوشمند
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 text-base md:text-lg max-w-md mb-8">
          مدیریت درخواست‌ها، پشتیبانی و خدمات بیمه‌ای در بستری ساده، سریع و امن. هم‌اکنون وارد حساب کاربری خود شوید یا ثبت‌نام کنید.
        </p>

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
    </>
  );
}
