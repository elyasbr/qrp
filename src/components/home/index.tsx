"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, SquareX } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const links = [
    { label: "خانه", href: "/" },
    { label: "داشبور", href: "/" },
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

        {/* Mobile Menu with smoother animation */}
        <div className="relative">
          {/* Overlay */}
          {menuOpen && (
            <div
              className={`fixed inset-0 z-40  transition-opacity duration-500 ease-in-out md:hidden ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setMenuOpen(false)}
            />
          )}
          {/* Animated Menu */}
          <div
            className={`absolute top-full left-0 right-0 z-50 md:hidden transition-all duration-500 ease-in-out transform ${
              menuOpen
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
            } bg-white ring ring-blue-400 shadow-sm/30 mx-2 rounded-xl mt-2 shadow-lg border-t border-gray-200`}
            style={{ willChange: 'opacity, transform' }}
          >
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
        </div>
      </nav>

      {/* Landing Section */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#f8f9fb] text-[var(--foreground)] font-Morabba pt-32">
        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-[var(--main-color)] mb-4 leading-tight text-balance max-w-4xl mx-auto">
          سامانه آنلاین و هوشمند<br />پت خانگی، ایران راد
        </h1>

        {/* Description */}
        <div className=" text-gray-600 text-base md:text-xl lg:max-w-2xl max-w-4xl mb-8 space-y-2 text-center font-extrabold leading-relaxed ">
          <p>
            مرجع جامع ثبت اطلاعات، مدیریت، سلامت و دریافت مشاوره تخصصی غذایی و درمانی. هم اکنون وارد حساب کاربری خود شوید یا ثبت نام کنید.
          </p>
        </div>

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
