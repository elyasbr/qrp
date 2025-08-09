"use client"
import { AlignJustify, Info, Menu, Phone, Square, SquareX, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/dashboard/profile", label: "پروفایل", icon: <User /> },
  { href: "/about", label: "درباره ما", icon: <Info /> },
  { href: "/contact", label: "تماس با ما", icon: <Phone /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-white border-2 border-[var(--main-color)]  p-2 rounded-full shadow-lg"
      >
        <AlignJustify size={24} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen bg-white shadow-md z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:static md:block md:w-64`}
      >
        <div className="flex justify-between items-center p-4 md:hidden">
          <span className="font-bold text-lg text-[var(--main-color)]">منو</span>
          <button onClick={() => setOpen(false)} className="text-[var(--main-color)]">
            <SquareX size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <span className="hidden lg:block font-bold text-lg text-[var(--main-color)] mb-5 mr-4">منو</span>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all"
              onClick={() => setOpen(false)} // close on mobile
            >
              <span className="text-md">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
