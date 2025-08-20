"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, Globe, Instagram, Clock, User } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] font-Morabba">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-[var(--main-color)] font-extrabold text-xl">
              <Image alt="logo" src="/images/logo.jpg" width={80} height={80} />
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[var(--main-color)] transition">
              <ArrowRight className="text-lg" />
              <span className="font-semibold">بازگشت به خانه</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--main-color)] mb-4">
            تماس با ما
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            پشتیبانی ایران راد آماده پاسخگویی به سوالات و درخواست‌های شماست
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Support Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[var(--main-color)] p-3 rounded-full">
                <User className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">پشتیبانی ایران راد</h3>
                <p className="text-gray-600">تماس رایگان / همه روزه 9 الی 21</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-[var(--main-color)] text-lg" />
                <div>
                  <p className="font-semibold text-gray-800">شماره تماس:</p>
                  <p className="text-lg font-bold text-[var(--main-color)]">90000878</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="text-[var(--main-color)] text-lg" />
                <div>
                  <p className="font-semibold text-gray-800">ساعات کاری:</p>
                  <p className="text-gray-600">همه روزه از 9 صبح تا 9 شب</p>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-500 p-3 rounded-full">
                <Phone className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">مشاوره تخصصی</h3>
                <p className="text-gray-600">مشاوره در زمینه پت و حیوانات خانگی</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-green-500 text-lg" />
                <div>
                  <p className="font-semibold text-gray-800">شماره مشاوره:</p>
                  <p className="text-lg font-bold text-green-500">09379372211</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  مشاوره تخصصی در زمینه نگهداری، تغذیه و سلامت حیوانات خانگی
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">روش‌های ارتباطی</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Website */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-4">
                <Globe className="text-white text-xl" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">وب سایت</h3>
              <a 
                href="https://www.iranrad.ir" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold transition"
              >
                www.iranrad.ir
              </a>
            </div>

            {/* Email */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-red-500 p-3 rounded-full w-fit mx-auto mb-4">
                <Mail className="text-white text-xl" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">ایمیل</h3>
              <a 
                href="mailto:info@iranrad.ir"
                className="text-red-600 hover:text-red-700 font-semibold transition"
              >
                info@iranrad.ir
              </a>
            </div>

            {/* Instagram */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-pink-500 p-3 rounded-full w-fit mx-auto mb-4">
                <Instagram className="text-white text-xl" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">اینستاگرام</h3>
              <a 
                href="https://instagram.com/iranrad.ir" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 font-semibold transition"
              >
                iranrad.ir
              </a>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-[var(--main-color)] to-[var(--main-color-dark)] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">چرا ایران راد؟</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            ما متعهد به ارائه بهترین خدمات پشتیبانی و مشاوره در زمینه حیوانات خانگی هستیم. 
            تیم متخصص ما آماده پاسخگویی به تمام سوالات شماست.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} ایران راد | تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
}
