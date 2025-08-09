import { ArrowRight, Link } from 'lucide-react'
import React from 'react'

export default function Dashboard() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 font-Morabba pt-32">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[var(--main-color)] mb-6 leading-tight">
        سامانه بیمه<br />آنلاین و هوشمند
      </h1>

      {/* Description */}
      <p className="text-center text-gray-600 text-base md:text-lg max-w-md mb-8">
        مدیریت درخواست‌ها، پشتیبانی و خدمات بیمه‌ای در بستری ساده، سریع و امن. هم‌اکنون وارد حساب کاربری خود شوید یا ثبت‌نام کنید.
      </p>

      {/* CTA Button */}
      <Link href="/auth">
        <button className="flex cursor-pointer items-center gap-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all">
          <ArrowRight className="text-xl" />
          شروع کنید
        </button>
      </Link>
    </main>
  )
}
``