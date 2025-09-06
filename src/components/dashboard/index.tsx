import React from 'react';
import Image from "next/image";;

export default function Dashboard() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 font-Morabba ">

        {/* Description */}
        <div className=" text-gray-600 text-base md:text-xl lg:max-w-2xl max-w-4xl mb-8 space-y-2 text-center font-extrabold leading-relaxed ">
        <div className="text-[var(--main-color)] font-extrabold text-xl font-Morabba">
        <Image src="/images/final.png" alt="header" width={600} height={600} />
          </div>
        </div>
    </main>
  );
}