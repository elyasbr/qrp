import React from 'react';
import UploadTest from '@/components/common/UploadTest';

export default function Dashboard() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 font-Morabba pt-32">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center text-[var(--main-color)] mb-4 leading-tight text-balance max-w-4xl mx-auto">
          سامانه آنلاین و هوشمند<br />پت خانگی، ایران راد
        </h1>

        {/* Description */}
        <div className=" text-gray-600 text-base md:text-xl lg:max-w-2xl max-w-4xl mb-8 space-y-2 text-center font-extrabold leading-relaxed ">
          <p>
            مرجع جامع ثبت اطلاعات، مدیریت، سلامت و دریافت مشاوره تخصصی غذایی و درمانی. هم اکنون وارد حساب کاربری خود شوید یا ثبت نام کنید.
          </p>
        </div>
    </main>
  );
}