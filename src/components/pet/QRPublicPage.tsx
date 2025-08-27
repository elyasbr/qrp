"use client";
import React, { useEffect } from "react";
import { Pet } from "@/services/api/petService";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Phone, Mail, MapPin, Calendar, User, PawPrint, Heart, Shield, FileText, Video, Image as ImageIcon, Home, Download, Play, Eye } from "lucide-react";
import { formatPersianDate } from "@/utils/dateUtils";
import Link from "next/link";
import { usePetPublic } from "@/hooks/usePetPublic";

interface QRPublicPageProps {
  pet: Pet | null;
  isLoading?: boolean;
  error?: string;
  petId?: string;
}

export default function QRPublicPage({ pet, isLoading, error, petId }: QRPublicPageProps) {
  // Use the hook to get pet data and media files
  const { pet: hookPet, isLoading: hookLoading, error: hookError, mediaFiles } = usePetPublic(petId || "");
  
  // Use hook data if available, otherwise use props
  const finalPet = hookPet || pet;
  const finalLoading = hookLoading || isLoading;
  const finalError = hookError || error;

  if (finalLoading) {
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

  if (finalError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">خطا در بارگذاری</h1>
          <p className="text-gray-600 mb-4">{finalError}</p>
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

  if (!finalPet) {
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
      {/* Header with Pet Image */}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Section 1: Pet Characteristics */}
            <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
              <h3 className="text-md font-bold text-[var(--main-color)] mb-3">مشخصات حیوان خانگی</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">تصویر پت</span>
                <div className="flex justify-start mb-4">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-[var(--main-color)]/20 shadow-lg">
                    <img
                      src={mediaFiles.photoPet?.url || "/images/pet.jpg"}
                      alt={finalPet.namePet}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-gray-500">شماره بیمه</span><span className="text-gray-900">{finalPet.insuranceNumber || "تعیین نشده"}</span>
                <span className="text-gray-500">نام پت</span><span className="text-gray-900">{finalPet.namePet}</span>
                <span className="text-gray-500">نوع پت</span><span className="text-gray-900">{finalPet.typePet}</span>
                <span className="text-gray-500">نام نژاد</span><span className="text-gray-900">{finalPet.blood}</span>
                <span className="text-gray-500">جنسیت</span><span className="text-gray-900">{finalPet.sex === "MEN" ? "نر" : finalPet.sex === "WOMEN" ? "ماده" : "نامشخص"}</span>
                <span className="text-gray-500">تاریخ تولد</span><span className="text-gray-900">{formatPersianDate(finalPet.birthDate)}</span>
                <span className="text-gray-500">شماره شناسنامه</span><span className="text-gray-900">{finalPet.birthCertificateNumberPet}</span>
                <span className="text-gray-500">کد میکروچیپ</span><span className="text-gray-900">{finalPet.microChipCode}</span>
                <span className="text-gray-500">رنگ پت</span><span className="text-gray-900">{finalPet.colorPet}</span>
                <span className="text-gray-500">وزن</span><span className="text-gray-900">{finalPet.weightPet} کیلوگرم</span>
                <span className="text-gray-500">قد</span><span className="text-gray-900">{finalPet.heightPet} سانتی‌متر</span>
                <span className="text-gray-500">نام دامپزشک صادر کننده شناسنامه</span><span className="text-gray-900">{finalPet.issuingVeterinarian}</span>
                <span className="text-gray-500" >  نظام دامپزشکی صادر کننده شناسنامه
                </span><span className="text-gray-900">{finalPet.issuingMedicalSystem === "IRAN" ? "ایران" : finalPet.issuingMedicalSystem === "IRAN_RAD" ? "ایران راد" : "نامشخص"}</span>
              </div>
              {finalPet.distinctiveFeature && (
                <div className="mt-3 text-sm">
                  <div className="text-gray-700 font-semibold mb-1">ویژگی بارز ظاهری</div>
                  <div className="text-gray-700">{finalPet.distinctiveFeature}</div>
                </div>
              )}
            </div>

            {/* Section 2: Owner Information */}
            <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
              <h3 className="text-md font-bold text-[var(--main-color)] mb-3">مشخصات سرپرست پت</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">نام و نام خانوادگی</span><span className="text-gray-900">{finalPet.nameHead}</span>
                <span className="text-gray-500">کد ملی</span><span className="text-gray-900">{finalPet.nationalCodeHead}</span>
                <span className="text-gray-500">موبایل (۱)</span><span className="text-gray-900">{finalPet.mobile1Head}</span>
                <span className="text-gray-500">موبایل (۲)</span><span className="text-gray-900">{finalPet.mobile2Head}</span>
                <span className="text-gray-500">تلفن ثابت</span><span className="text-gray-900">{finalPet.telHead}</span>
                <span className="text-gray-500">استان</span><span className="text-gray-900">{finalPet.stateHead}</span>
                <span className="text-gray-500">شهر</span><span className="text-gray-900">{finalPet.cityHead}</span>
                <span className="text-gray-500">آدرس</span><span className="text-gray-900">{finalPet.addressHead}</span>
                <span className="text-gray-500">کد پستی</span><span className="text-gray-900">{finalPet.postalCodeHead}</span>
                <span className="text-gray-500">ایمیل</span><span className="text-gray-900">{finalPet.emailHead}</span>
                {finalPet.telegramHead && (<><span className="text-gray-500">تلگرام</span><span className="text-gray-900">{finalPet.telegramHead}</span></>)}
                {finalPet.whatsAppHead && (<><span className="text-gray-500">واتساپ</span><span className="text-gray-900">{finalPet.whatsAppHead}</span></>)}
                {finalPet.instagramHead && (<><span className="text-gray-500">اینستاگرام</span><span className="text-gray-900">{finalPet.instagramHead}</span></>)}
                {finalPet.youtubeHead && (<><span className="text-gray-500">یوتیوب</span><span className="text-gray-900">{finalPet.youtubeHead}</span></>)}
                {finalPet.linkedinHead && (<><span className="text-gray-500">لینکدین</span><span className="text-gray-900">{finalPet.linkedinHead}</span></>)}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Section 3: Health Information */}
            <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
              <h3 className="text-md font-bold text-[var(--main-color)] mb-3">ویژگی و اطلاعات سلامتی</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">دامپزشک عمومی</span><span className="text-gray-900">{finalPet.generalVeterinarian}</span>
                <span className="text-gray-500">آدرس دامپزشک عمومی</span><span className="text-gray-900">{finalPet.addressGeneralVeterinarian}</span>
                <span className="text-gray-500">تلفن دامپزشک عمومی</span><span className="text-gray-900">{finalPet.phoneNumberGeneralVeterinarian}</span>
                <span className="text-gray-500">دامپزشک متخصص</span><span className="text-gray-900">{finalPet.specialistVeterinarian}</span>
                <span className="text-gray-500">آدرس دامپزشک متخصص</span><span className="text-gray-900">{finalPet.addressSpecialistVeterinarian}</span>
                <span className="text-gray-500">تلفن دامپزشک متخصص</span><span className="text-gray-900">{finalPet.phoneNumberSpecialistVeterinarian}</span>
                <span className="text-gray-500">پت عقیم است</span><span className="text-gray-900">{finalPet.isSterile ? "بله" : "خیر"}</span>
                <span className="text-gray-500">واکسن Rabiel</span><span className="text-gray-900">{finalPet.vaccineRabiel ? "دارد" : "ندارد"}</span>
                <span className="text-gray-500">واکسن LDHPPi</span><span className="text-gray-900">{finalPet.vaccineLDHPPi ? "دارد" : "ندارد"}</span>
                <span className="text-gray-500">واکسن R.C.P</span><span className="text-gray-900">{finalPet.vaccineRCP ? "دارد" : "ندارد"}</span>
                <span className="text-gray-500">نوع تغذیه</span><span className="text-gray-900">{finalPet.typeFeeding}</span>
                <span className="text-gray-500">تعداد وعده‌های غذایی</span><span className="text-gray-900">{finalPet.numberMeal}</span>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {finalPet.diet && (<div><span className="font-semibold text-gray-700">رژیم غذایی:</span> <span className="text-gray-700">{finalPet.diet}</span></div>)}
                {finalPet.prohibitedFoodItems && (<div><span className="font-semibold text-gray-700">موارد ممنوع تغذیه:</span> <span className="text-gray-700">{finalPet.prohibitedFoodItems}</span></div>)}
                {finalPet.regularlyUsedMedications && (<div><span className="font-semibold text-gray-700">داروهای مصرفی دائم:</span> <span className="text-gray-700">{finalPet.regularlyUsedMedications}</span></div>)}
                {finalPet.prohibitedDrugs && (<div><span className="font-semibold text-gray-700">داروهای ممنوعه:</span> <span className="text-gray-700">{finalPet.prohibitedDrugs}</span></div>)}
                {finalPet.favoriteEncouragement && (<div><span className="font-semibold text-gray-700">تشویقی مورد علاقه:</span> <span className="text-gray-700">{finalPet.favoriteEncouragement}</span></div>)}
              </div>
            </div>

            {/* Section 4: Behavioral Information */}
            <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
              <h3 className="text-md font-bold text-[var(--main-color)] mb-3">اطلاعات و ویژگی‌های رفتاری شخصیتی</h3>
              <div className="space-y-2 text-sm">
                {finalPet.behavioralHabits && (<div><span className="font-semibold text-gray-700">عادت‌های رفتاری:</span> <span className="text-gray-700">{finalPet.behavioralHabits}</span></div>)}
                {finalPet.susceptibility && (<div><span className="font-semibold text-gray-700">مهارت و استعدادها:</span> <span className="text-gray-700">{finalPet.susceptibility}</span></div>)}
                {finalPet.sensitivities && (<div><span className="font-semibold text-gray-700">حساسیت‌ها:</span> <span className="text-gray-700">{finalPet.sensitivities}</span></div>)}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">با پت دیگری زندگی می‌کند</span><span className="text-gray-900">{finalPet.connectOtherPets ? "بله" : "خیر"}</span>
                <span className="text-gray-500">با کودکان ارتباط دارد</span><span className="text-gray-900">{finalPet.connectWithBaby ? "بله" : "خیر"}</span>
              </div>
            </div>

            {/* Section 5: Consultations */}
            <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
              <h3 className="text-md font-bold text-[var(--main-color)] mb-3">مشاوره‌ها</h3>
              <div className="space-y-2 text-sm">
                {finalPet.nutritionalCounseling && (<div><span className="font-semibold text-gray-700">مشاوره متخصص تغذیه:</span> <span className="text-gray-700">{finalPet.nutritionalCounseling}</span></div>)}
                {finalPet.expertVeterinaryCounseling && (<div><span className="font-semibold text-gray-700">مشاوره دامپزشک متخصص:</span> <span className="text-gray-700">{finalPet.expertVeterinaryCounseling}</span></div>)}
                {finalPet.trainingAdvice && (<div><span className="font-semibold text-gray-700">مشاوره تربیت پت:</span> <span className="text-gray-700">{finalPet.trainingAdvice}</span></div>)}
              </div>
            </div>

            {/* Section 6: Digital Documents */}
            <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
              <h3 className="text-md font-bold text-[var(--main-color)] mb-3">اسناد دیجیتال</h3>
              
              {/* Gallery Photos */}
              {mediaFiles.galleryPhoto && mediaFiles.galleryPhoto.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <ImageIcon size={16} />
                    گالری عکس‌های پت
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {mediaFiles.galleryPhoto.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.url}
                          alt={`عکس پت ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <a
                          href={photo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <Eye size={20} className="text-white" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Videos */}
              {mediaFiles.galleryVideo && mediaFiles.galleryVideo.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Video size={16} />
                    گالری ویدیوهای پت
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaFiles.galleryVideo.map((video, index) => (
                      <div key={index} className="relative">
                        <video
                          src={video.url}
                          className="w-full h-48 object-cover rounded-lg border shadow-sm"
                          controls
                        />
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <Eye size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Documents */}
              <div className="space-y-3">
                {mediaFiles.certificatePdf && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-[var(--main-color)]" />
                      <div>
                        <div className="font-semibold text-gray-900">شناسنامه پت</div>
                        <div className="text-sm text-gray-500">فایل PDF</div>
                      </div>
                    </div>
                    <a
                      href={mediaFiles.certificatePdf.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-[var(--main-color)] text-white px-3 py-2 rounded-lg hover:bg-[var(--main-color-dark)] transition-colors"
                    >
                      <Download size={16} />
                      دانلود
                    </a>
                  </div>
                )}

                {mediaFiles.insurancePdf && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-[var(--main-color)]" />
                      <div>
                        <div className="font-semibold text-gray-900">بیمه نامه پت</div>
                        <div className="text-sm text-gray-500">فایل PDF</div>
                      </div>
                    </div>
                    <a
                      href={mediaFiles.insurancePdf.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-[var(--main-color)] text-white px-3 py-2 rounded-lg hover:bg-[var(--main-color-dark)] transition-colors"
                    >
                      <Download size={16} />
                      دانلود
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Veterinary Contact Information */}
        <div className="mt-8 bg-white rounded-lg ring-1 ring-gray-200 p-4">
          <h3 className="text-md font-bold text-[var(--main-color)] mb-3">اطلاعات تماس دامپزشکان</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">دامپزشک صادرکننده شناسنامه</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="text-gray-500" size={16} />
                  <span className="text-gray-700">{finalPet.issuingVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-500" size={16} />
                  <span className="text-gray-700">{finalPet.addressVeterinarian}</span>
                </div>
                <div className="flex items_center gap-2">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-gray-700">{finalPet.phoneNumberVeterinarian}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">دامپزشک متخصص</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="text-gray-500" size={16} />
                  <span className="text-gray-700">{finalPet.specialistVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-500" size={16} />
                  <span className="text-gray-700">{finalPet.addressSpecialistVeterinarian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-gray-700">{finalPet.phoneNumberSpecialistVeterinarian}</span>
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
