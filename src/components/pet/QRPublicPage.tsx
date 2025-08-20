"use client";
import React, { useEffect } from "react";
import { Pet } from "@/services/api/petService";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Phone, Mail, MapPin, Calendar, User, PawPrint, Heart, Shield, FileText, Video, Image as ImageIcon, Home } from "lucide-react";
import { formatPersianDate } from "@/utils/dateUtils";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#f8f9fb] font-Morabba">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* <div className="flex items-center justify-center md:justify-start mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 bg-[var(--main-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--main-color-dark)] transition-colors duration-200 shadow-md"
            >
              <Home size={20} />
              <span className="font-medium">بازگشت به خانه</span>
            </Link>
          </div> */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--main-color)] mb-2">
              اطلاعات مربوط به پت
            </h1>
            <p className="text-gray-600">ایران راد - سامانه هوشمند پت خانگی</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Section 1: Pet Characteristics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[var(--main-color)] p-2 rounded-lg">
                  <PawPrint className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">مشخصات پت خانگی</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">نام پت:</span>
                    <span className="font-semibold text-gray-800">{pet.namePet}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">نوع پت:</span>
                    <span className="font-semibold text-gray-800">{pet.typePet}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">جنسیت:</span>
                    <span className="font-semibold text-gray-800">
                      {pet.sex === "MEN" ? "نر" : pet.sex === "WOMEN" ? "ماده" : "نامشخص"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">تاریخ تولد:</span>
                    <span className="font-semibold text-gray-800">{formatPersianDate(pet.birthDate)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">گروه خونی:</span>
                    <span className="font-semibold text-gray-800">{pet.blood}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">رنگ:</span>
                    <span className="font-semibold text-gray-800">{pet.colorPet}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">وزن:</span>
                    <span className="font-semibold text-gray-800">{pet.weightPet} کیلوگرم</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">قد:</span>
                    <span className="font-semibold text-gray-800">{pet.heightPet} سانتی‌متر</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">شماره شناسنامه:</span>
                    <span className="font-semibold text-gray-800">{pet.birthCertificateNumberPet}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">کد میکروچیپ:</span>
                    <span className="font-semibold text-gray-800">{pet.microChipCode}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">دامپزشک صادرکننده:</span>
                    <span className="font-semibold text-gray-800">{pet.issuingVeterinarian}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">نظام دامپزشکی:</span>
                    <span className="font-semibold text-gray-800">{pet.issuingMedicalSystem}</span>
                  </div>
                </div>
              </div>

              {pet.distinctiveFeature && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">ویژگی بارز ظاهری:</h3>
                  <p className="text-blue-700">{pet.distinctiveFeature}</p>
                </div>
              )}
            </div>

            {/* Section 2: Owner Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[var(--main-color)] p-2 rounded-lg">
                  <User className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">مشخصات سرپرست پت</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">نام و نام خانوادگی:</span>
                    <span className="font-semibold text-gray-800">{pet.nameHead}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">کد ملی:</span>
                    <span className="font-semibold text-gray-800">{pet.nationalCodeHead}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">موبایل اول:</span>
                    <span className="font-semibold text-gray-800">{pet.mobile1Head}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">موبایل دوم:</span>
                    <span className="font-semibold text-gray-800">{pet.mobile2Head}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">تلفن ثابت:</span>
                    <span className="font-semibold text-gray-800">{pet.telHead}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">استان:</span>
                    <span className="font-semibold text-gray-800">{pet.stateHead}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">شهر:</span>
                    <span className="font-semibold text-gray-800">{pet.cityHead}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">کد پستی:</span>
                    <span className="font-semibold text-gray-800">{pet.postalCodeHead}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">ایمیل:</span>
                    <span className="font-semibold text-gray-800">{pet.emailHead}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">آدرس:</span>
                    <span className="font-semibold text-gray-800">{pet.addressHead}</span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">شبکه‌های اجتماعی:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {pet.telegramHead && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <span>📱</span>
                      <span>تلگرام: {pet.telegramHead}</span>
                    </div>
                  )}
                  {pet.whatsAppHead && (
                    <div className="flex items-center gap-2 text-green-600">
                      <span>📱</span>
                      <span>واتساپ: {pet.whatsAppHead}</span>
                    </div>
                  )}
                  {pet.instagramHead && (
                    <div className="flex items-center gap-2 text-pink-600">
                      <span>📷</span>
                      <span>اینستاگرام: {pet.instagramHead}</span>
                    </div>
                  )}
                  {pet.youtubeHead && (
                    <div className="flex items-center gap-2 text-red-600">
                      <span>📺</span>
                      <span>یوتیوب: {pet.youtubeHead}</span>
                    </div>
                  )}
                  {pet.linkedinHead && (
                    <div className="flex items-center gap-2 text-blue-700">
                      <span>💼</span>
                      <span>لینکدین: {pet.linkedinHead}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Section 3: Health Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[var(--main-color)] p-2 rounded-lg">
                  <Heart className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">ویژگی و اطلاعات سلامتی</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">دامپزشک عمومی:</span>
                    <span className="font-semibold text-gray-800">{pet.generalVeterinarian}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">دامپزشک متخصص:</span>
                    <span className="font-semibold text-gray-800">{pet.specialistVeterinarian}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">عقیم شده:</span>
                    <span className="font-semibold text-gray-800">{pet.isSterile ? "بله" : "خیر"}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">واکسن هاری:</span>
                    <span className="font-semibold text-gray-800">{pet.vaccineRabiel ? "بله" : "خیر"}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">واکسن LDHPPi:</span>
                    <span className="font-semibold text-gray-800">{pet.vaccineLDHPPi ? "بله" : "خیر"}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">واکسن RCP:</span>
                    <span className="font-semibold text-gray-800">{pet.vaccineRCP ? "بله" : "خیر"}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">نوع تغذیه:</span>
                    <span className="font-semibold text-gray-800">{pet.typeFeeding}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">تعداد وعده‌های غذایی:</span>
                    <span className="font-semibold text-gray-800">{pet.numberMeal}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">رژیم غذایی:</span>
                    <span className="font-semibold text-gray-800">{pet.diet}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">مواد ممنوع تغذیه:</span>
                    <span className="font-semibold text-gray-800">{pet.prohibitedFoodItems}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">داروهای مصرفی دائم:</span>
                    <span className="font-semibold text-gray-800">{pet.regularlyUsedMedications}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">داروهای ممنوعه:</span>
                    <span className="font-semibold text-gray-800">{pet.prohibitedDrugs}</span>
                  </div>
                </div>
              </div>

              {pet.favoriteEncouragement && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">تشویقی مورد علاقه:</h3>
                  <p className="text-yellow-700">{pet.favoriteEncouragement}</p>
                </div>
              )}
            </div>

            {/* Section 4: Behavioral Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[var(--main-color)] p-2 rounded-lg">
                  <Shield className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">اطلاعات و ویژگی‌های رفتاری شخصیتی</h2>
              </div>

              <div className="space-y-4">
                {pet.behavioralHabits && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">عادت‌های رفتاری:</h3>
                    <p className="text-gray-700">{pet.behavioralHabits}</p>
                  </div>
                )}

                {pet.susceptibility && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">مهارت و استعدادها:</h3>
                    <p className="text-gray-700">{pet.susceptibility}</p>
                  </div>
                )}

                {pet.sensitivities && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">حساسیت‌ها:</h3>
                    <p className="text-gray-700">{pet.sensitivities}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">با پت دیگری زندگی می‌کند:</span>
                    <span className="font-semibold text-gray-800">{pet.connectOtherPets ? "بله" : "خیر"}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">با کودکان ارتباط دارد:</span>
                    <span className="font-semibold text-gray-800">{pet.connectWithBaby ? "بله" : "خیر"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Consultations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[var(--main-color)] p-2 rounded-lg">
                  <FileText className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">مشاوره‌ها</h2>
              </div>

              <div className="space-y-3">
                {pet.nutritionalCounseling && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">مشاوره متخصص تغذیه:</h3>
                    <p className="text-gray-700">{pet.nutritionalCounseling}</p>
                  </div>
                )}

                {pet.expertVeterinaryCounseling && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">مشاوره دامپزشک متخصص:</h3>
                    <p className="text-gray-700">{pet.expertVeterinaryCounseling}</p>
                  </div>
                )}

                {pet.trainingAdvice && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">مشاوره تربیت پت:</h3>
                    <p className="text-gray-700">{pet.trainingAdvice}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Veterinary Contact Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">اطلاعات تماس دامپزشکان</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">دامپزشک صادرکننده شناسنامه</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.issuingVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.addressVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.phoneNumberVeterinarian}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">دامپزشک عمومی</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.generalVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.addressGeneralVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.phoneNumberGeneralVeterinarian}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">دامپزشک متخصص</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.specialistVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.addressSpecialistVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-gray-700">{pet.phoneNumberSpecialistVeterinarian}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ایران راد | تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </div>
  );
}
