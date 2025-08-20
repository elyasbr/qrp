"use client";
import React, { useEffect } from "react";
import { Pet } from "@/services/api/petService";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface QRPublicPageProps {
  pet: Pet | null;
  isLoading?: boolean;
  error?: string;
}

export default function QRPublicPage({ pet, isLoading, error }: QRPublicPageProps) {
  // Debug logging
  useEffect(() => {
    console.log("QRPublicPage render:", { pet, isLoading, error });
  }, [pet, isLoading, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <LoadingSpinner 
          size="lg" 
          text="در حال بارگذاری اطلاعات پت..." 
          className="max-w-xl w-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">خطا در بارگذاری</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[var(--main-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--main-color-dark)] transition"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-2xl font-bold text-[var(--main-color)] mb-2">اطلاعات یافت نشد</h1>
          <p className="text-gray-600">متاسفانه اطلاعات مربوط به این کد در دسترس نیست.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f9fb]">
      <div className="max-w-2xl w-full bg-white rounded-xl border p-6 shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-[var(--main-color)] mb-2">اطلاعات پت</h1>
          <p className="text-gray-600">ایران راد - سامانه هوشمند پت خانگی</p>
        </div>

        {/* Pet Image */}
        {pet.imageUrl && (
          <div className="text-center">
            <img 
              src={pet.imageUrl} 
              alt={pet.namePet} 
              className="rounded-lg w-full max-w-md h-auto mx-auto shadow-md" 
            />
          </div>
        )}

        {/* Pet Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">نام پت:</span>
            <span className="font-semibold text-gray-800">{pet.namePet}</span>
          </div>
          
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">نوع:</span>
            <span className="font-semibold text-gray-800">{pet.typePet}</span>
          </div>
          
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">رنگ:</span>
            <span className="font-semibold text-gray-800">{pet.colorPet}</span>
          </div>
          
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">گروه خونی:</span>
            <span className="font-semibold text-gray-800">{pet.blood}</span>
          </div>
          
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">جنسیت:</span>
            <span className="font-semibold text-gray-800">
              {pet.sex === "MEN" ? "نر" : pet.sex === "WOMEN" ? "ماده" : "نامشخص"}
            </span>
          </div>
          
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">تاریخ تولد:</span>
            <span className="font-semibold text-gray-800">{pet.birthDate}</span>
          </div>
        </div>

        {/* Additional Information */}
        {pet.distinctiveFeature && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">ویژگی‌های متمایز:</h3>
            <p className="text-blue-700">{pet.distinctiveFeature}</p>
          </div>
        )}

        {/* Video */}
        {pet.videoUrl && (
          <div className="aspect-video w-full">
            <video 
              src={pet.videoUrl} 
              className="w-full h-full rounded-lg shadow-md" 
              controls 
              preload="metadata"
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ایران راد | تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </div>
  );
}
