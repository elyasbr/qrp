"use client";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MoreVertical,
  PawPrint,
  QrCode,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Play,
  Shield,
} from "lucide-react";
import {
  Pet,
  getAllPets,
  deletePet,
  getPetById,
} from "@/services/api/petService";
import { useSnackbar } from "@/hooks/useSnackbar";
import Snackbar from "@/components/common/Snackbar";
import PetForm from "./PetForm";
import QRCodeModal from "@/components/common/QRCodeModal";
import { formatPersianDate } from "@/utils/dateUtils";
import { usePetFiles } from "@/hooks/usePetPublic";

// PetViewModal Component
function PetViewModal({ pet, onClose }: { pet: Pet; onClose: () => void }) {
  const { files, loading: filesLoading, error: filesError } = usePetFiles(pet);

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 -z-10 blur-2xl rounded-3xl bg-gradient-to-tr from-[var(--main-color)]/20 to-purple-400/20" />
        <div className="bg-white/90 rounded-2xl shadow-xl ring-1 ring-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white/90 z-10 flex items-center justify-between px-6 py-4 border-b">
            <div className="w-full flex justify-end gap-2">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-[var(--main-color)] transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto flex-1">
            <div className="space-y-6">
              {/* Pet Characteristics */}
              <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                <h3 className="text-md font-bold text-[var(--main-color)] mb-3">
                  مشخصات حیوان خانگی
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">تصویر پت</span>
                  <div className="flex justify-start mb-4">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-[var(--main-color)]/20 shadow-lg">
                      <img
                        src={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${pet.photoPet}`}
                        alt={pet.namePet}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-gray-500">شماره بیمه</span>
                  <span className="text-gray-900">
                    {pet.insuranceNumber || "تعیین نشده"}
                  </span>
                  <span className="text-gray-500">نام پت</span>
                  <span className="text-gray-900">{pet.namePet}</span>
                  <span className="text-gray-500">نوع پت</span>
                  <span className="text-gray-900">{pet.typePet}</span>
                  <span className="text-gray-500">جنسیت</span>
                  <span className="text-gray-900">
                    {pet.sex === "MEN"
                      ? "نر"
                      : pet.sex === "WOMEN"
                      ? "ماده"
                      : "نامشخص"}
                  </span>
                  <span className="text-gray-500">تاریخ تولد</span>
                  <span className="text-gray-900">
                    {pet.birthDate ? formatPersianDate(pet.birthDate) : ""}
                  </span>
                  <span className="text-gray-500">شماره شناسنامه</span>
                  <span className="text-gray-900">
                    {pet.birthCertificateNumberPet}
                  </span>
                  <span className="text-gray-500">کد میکروچیپ</span>
                  <span className="text-gray-900">{pet.microChipCode}</span>
                  <span className="text-gray-500">رنگ پت</span>
                  <span className="text-gray-900">{pet.colorPet}</span>
                  <span className="text-gray-500">وزن</span>
                  <span className="text-gray-900">{pet.weightPet} کیلوگرم</span>
                  <span className="text-gray-500">قد</span>
                  <span className="text-gray-900">
                    {pet.heightPet} سانتی‌متر
                  </span>
                  <span className="text-gray-500">دامپزشک صادر کننده</span>
                  <span className="text-gray-900">
                    {pet.issuingVeterinarian}
                  </span>
                  <span className="text-gray-500">نظام دامپزشکی</span>
                  <span className="text-gray-900">
                    {pet.issuingMedicalSystem}
                  </span>
                </div>
                {pet.distinctiveFeature && (
                  <div className="mt-3 text-sm">
                    <div className="text-gray-700 font-semibold mb-1">
                      ویژگی بارز ظاهری
                    </div>
                    <div className="text-gray-700">
                      {pet.distinctiveFeature}
                    </div>
                  </div>
                )}
              </div>

              {/* Owner Information */}
              <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                <h3 className="text-md font-bold text-[var(--main-color)] mb-3">
                  مشخصات سرپرست پت
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">نام و نام خانوادگی</span>
                  <span className="text-gray-900">{pet.nameHead}</span>
                  <span className="text-gray-500">کد ملی</span>
                  <span className="text-gray-900">{pet.nationalCodeHead}</span>
                  <span className="text-gray-500">موبایل (۱)</span>
                  <span className="text-gray-900">{pet.mobile1Head}</span>
                  <span className="text-gray-500">موبایل (۲)</span>
                  <span className="text-gray-900">{pet.mobile2Head}</span>
                  <span className="text-gray-500">تلفن ثابت</span>
                  <span className="text-gray-900">{pet.telHead}</span>
                  <span className="text-gray-500">استان</span>
                  <span className="text-gray-900">{pet.stateHead}</span>
                  <span className="text-gray-500">شهر</span>
                  <span className="text-gray-900">{pet.cityHead}</span>
                  <span className="text-gray-500">کد پستی</span>
                  <span className="text-gray-900">{pet.postalCodeHead}</span>
                  <span className="text-gray-500">ایمیل</span>
                  <span className="text-gray-900">{pet.emailHead}</span>
                  <span className="text-gray-500">آدرس</span>
                  <span className="text-gray-900">{pet.addressHead}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                  {pet.telegramHead && (
                    <>
                      <span className="text-gray-500">تلگرام</span>
                      <span className="text-gray-900">{pet.telegramHead}</span>
                    </>
                  )}
                  {pet.whatsAppHead && (
                    <>
                      <span className="text-gray-500">واتساپ</span>
                      <span className="text-gray-900">{pet.whatsAppHead}</span>
                    </>
                  )}
                  {pet.instagramHead && (
                    <>
                      <span className="text-gray-500">اینستاگرام</span>
                      <span className="text-gray-900">{pet.instagramHead}</span>
                    </>
                  )}
                  {pet.youtubeHead && (
                    <>
                      <span className="text-gray-500">یوتیوب</span>
                      <span className="text-gray-900">{pet.youtubeHead}</span>
                    </>
                  )}
                  {pet.linkedinHead && (
                    <>
                      <span className="text-gray-500">لینکدین</span>
                      <span className="text-gray-900">{pet.linkedinHead}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Health Information */}
              <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                <h3 className="text-md font-bold text-[var(--main-color)] mb-3">
                  ویژگی و اطلاعات سلامتی
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">دامپزشک</span>
                  <span className="text-gray-900">
                    {pet.generalVeterinarian}
                  </span>
                  <span className="text-gray-500">آدرس دامپزشک</span>
                  <span className="text-gray-900">
                    {pet.addressGeneralVeterinarian}
                  </span>
                  <span className="text-gray-500">تلفن دامپزشک</span>
                  <span className="text-gray-900">
                    {pet.phoneNumberGeneralVeterinarian}
                  </span>
                  <span className="text-gray-500">پت عقیم است</span>
                  <span className="text-gray-900">
                    {pet.isSterile ? "بله" : "خیر"}
                  </span>
                  <span className="text-gray-500">واکسن Rabiel</span>
                  <span className="text-gray-900">
                    {pet.vaccineRabiel ? "دارد" : "ندارد"}
                  </span>
                  <span className="text-gray-500">واکسن LDHPPi</span>
                  <span className="text-gray-900">
                    {pet.vaccineLDHPPi ? "دارد" : "ندارد"}
                  </span>
                  <span className="text-gray-500">واکسن R.C.P</span>
                  <span className="text-gray-900">
                    {pet.vaccineRCP ? "دارد" : "ندارد"}
                  </span>
                  <span className="text-gray-500">نوع تغذیه</span>
                  <span className="text-gray-900">{pet.typeFeeding}</span>
                  <span className="text-gray-500">تعداد وعده های غذایی</span>
                  <span className="text-gray-900">{pet.numberMeal}</span>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  {pet.diet && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        رژیم غذایی:
                      </span>{" "}
                      <span className="text-gray-700">{pet.diet}</span>
                    </div>
                  )}
                  {pet.prohibitedFoodItems && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        موارد ممنوع تغذیه:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.prohibitedFoodItems}
                      </span>
                    </div>
                  )}
                  {pet.regularlyUsedMedications && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        داروهای مصرفی دائم:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.regularlyUsedMedications}
                      </span>
                    </div>
                  )}
                  {pet.prohibitedDrugs && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        داروهای ممنوعه:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.prohibitedDrugs}
                      </span>
                    </div>
                  )}
                  {pet.favoriteEncouragement && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        تشویقی مورد علاقه:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.favoriteEncouragement}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Behavioral Information */}
              <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                <h3 className="text-md font-bold text-[var(--main-color)] mb-3">
                  اطلاعات و ویژگی‌های رفتاری شخصیتی
                </h3>
                <div className="space-y-2 text-sm">
                  {pet.behavioralHabits && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        عادت های رفتاری:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.behavioralHabits}
                      </span>
                    </div>
                  )}
                  {pet.susceptibility && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        مهارت و استعدادها:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.susceptibility}
                      </span>
                    </div>
                  )}
                  {pet.sensitivities && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        حساسیت ها:
                      </span>{" "}
                      <span className="text-gray-700">{pet.sensitivities}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">با پت دیگری اقامت دارد؟</span>
                  <span className="text-gray-900">
                    {pet.connectOtherPets ? "بله" : "خیر"}
                  </span>
                  <span className="text-gray-500">با کودکان ارتباط دارد؟</span>
                  <span className="text-gray-900">
                    {pet.connectWithBaby ? "بله" : "خیر"}
                  </span>
                </div>
              </div>

              {/* Consultations */}
              <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                <h3 className="text-md font-bold text-[var(--main-color)] mb-3">
                  مشاوره ها
                </h3>
                <div className="space-y-2 text-sm">
                  {pet.nutritionalCounseling && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        مشاوره متخصص تغذیه:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.nutritionalCounseling}
                      </span>
                    </div>
                  )}
                  {pet.expertVeterinaryCounseling && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        مشاوره دامپزشک متخصص:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.expertVeterinaryCounseling}
                      </span>
                    </div>
                  )}
                  {pet.trainingAdvice && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        مشاوره تربیت پت:
                      </span>{" "}
                      <span className="text-gray-700">
                        {pet.trainingAdvice}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Digital Documents */}
              <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-[var(--main-color)]/10 rounded-lg">
                    <FileText className="text-[var(--main-color)]" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--main-color)]">
                    اسناد دیجیتال
                  </h3>
                </div>

                {filesLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--main-color)] mb-3"></div>
                    <p className="text-sm text-gray-500">
                      در حال بارگذاری فایل‌ها...
                    </p>
                  </div>
                )}

                {filesError && (
                  <div className="text-center py-6">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-600">{filesError}</p>
                    </div>
                  </div>
                )}

                {!filesLoading && !filesError && (
                  <div className="space-y-6">
                    {/* PDF Documents Section */}
                    {(pet?.certificatePdf || pet?.insurancePdf) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FileText
                            className="text-[var(--main-color)]"
                            size={18}
                          />
                          اسناد رسمی
                        </h4>

                        {pet?.certificatePdf && (
                          <div className="group relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <FileText
                                    className="text-blue-600"
                                    size={20}
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    شناسنامه پت
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    سند رسمی شناسایی حیوان خانگی
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {pet?.certificatePdf}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${pet?.certificatePdf}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="مشاهده"
                                >
                                  <Play size={16} />
                                </a>
                                <a
                                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${pet?.certificatePdf}`}
                                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <Download size={16} />
                                  <span className="text-sm">دانلود</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {pet?.insurancePdf && (
                          <div className="group relative bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Shield
                                    className="text-green-600"
                                    size={20}
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    بیمه نامه
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    سند بیمه حیوان خانگی
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {pet?.insurancePdf}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${pet?.insurancePdf}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                  title="مشاهده"
                                >
                                  <Play size={16} />
                                </a>
                                <a
                                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${pet?.insurancePdf}`}
                                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <Download size={16} />
                                  <span className="text-sm">دانلود</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gallery Photos Section */}
                    {(pet?.galleryPhoto?.length ?? 0) > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <ImageIcon
                            className="text-[var(--main-color)]"
                            size={18}
                          />
                          گالری عکس‌ها
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {pet?.galleryPhoto?.length}
                          </span>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {pet?.galleryPhoto?.map((photo, index) => (
                            <div
                              key={index}
                              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                            >
                              <div className="aspect-square relative">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${photo}`}
                                  alt={`عکس ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <a
                                      href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${photo}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
                                      title="مشاهده"
                                    >
                                      <ImageIcon
                                        size={16}
                                        className="text-gray-700"
                                      />
                                    </a>
                                    <a
                                      href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${photo}`}
                                      className="bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
                                      title="دانلود"
                                    >
                                      <Download
                                        size={16}
                                        className="text-gray-700"
                                      />
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  عکس {index + 1}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {photo}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gallery Videos Section */}
                    {(pet?.galleryVideo?.length ?? 0) > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Video
                            className="text-[var(--main-color)]"
                            size={18}
                          />
                          گالری ویدیوها
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {pet?.galleryVideo?.length}
                          </span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {pet?.galleryVideo?.map((video, index) => (
                            <div
                              key={index}
                              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                            >
                              <div className="aspect-video relative">
                                <video
                                  src={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${video}`}
                                  className="w-full h-full object-cover"
                                  controls
                                  preload="metadata"
                                />
                                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                                  ویدیو {index + 1}
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  ویدیو {index + 1}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {video}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${video}`}
                                    className="flex items-center gap-1 text-[var(--main-color)] hover:text-[var(--main-color-dark)] text-sm transition-colors"
                                  >
                                    <Download size={14} />
                                    <span>دانلود</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No files message */}
                    {!pet?.certificatePdf &&
                      !pet?.insurancePdf &&
                      (pet?.galleryPhoto?.length ?? 0) === 0 &&
                      (pet?.galleryVideo?.length ?? 0) === 0 && (
                        <div className="text-center py-12">
                          <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <FileText size={32} className="text-gray-300" />
                          </div>
                          <h4 className="text-gray-600 font-medium mb-2">
                            هیچ سند دیجیتالی موجود نیست
                          </h4>
                          <p className="text-sm text-gray-500">
                            در حال حاضر هیچ فایل یا سندی برای این حیوان خانگی
                            آپلود نشده است.
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Footer Close */}
          <div className="sticky bottom-0 px-6 py-4 border-t flex justify-end bg-white/90 z-10">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white rounded-lg transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);
  const loadingRef = useRef(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedPetForQR, setSelectedPetForQR] = useState<Pet | null>(null);

  const { showError, showSuccess, snackbar, hideSnackbar } = useSnackbar();

  // Load pets on component mount
  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      setLoading(true);
      const petsData = await getAllPets();
      setPets(petsData);
    } catch (error: any) {
      showError("خطا در بارگذاری لیست پت ");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const handleDelete = async (petId: string) => {
    setDeleteModalOpen(false);
    setPetToDelete(null);
    try {
      await deletePet(petId);
      showSuccess("پت با موفقیت حذف شد");
      loadPets(); // Reload the list
    } catch (error: any) {
      showError("خطا در حذف پت: " + error.message);
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleView = async (pet: Pet) => {
    try {
      const latestPet = await getPetById(pet.petId || "");
      setViewingPet(latestPet);
    } catch (error: any) {
      showError(
        "خطا در دریافت اطلاعات پت: " + (error.message || "خطای نامشخص")
      );
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPet(null);
    setViewingPet(null);
  };

  const handleQRCode = (pet: Pet) => {
    setSelectedPetForQR(pet);
    setQrModalOpen(true);
    showSuccess(`QR Code برای ${pet.namePet} آماده شد`);
  };

  const handleQRModalClose = () => {
    setQrModalOpen(false);
    setSelectedPetForQR(null);
  };

  const handleFormSuccess = () => {
    showSuccess(
      editingPet ? "پت با موفقیت ویرایش شد" : "پت با موفقیت اضافه شد"
    );
    handleFormClose();
    loadPets();
  };

  // Filter and search pets
  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.namePet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.typePet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.colorPet.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-[var(--main-color)]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--main-color)] animate-spin"></div>
          </div>
          <div className="text-[var(--main-color)] font-semibold">
            در حال بارگذاری...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen mt-14 lg:mt-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--main-color)] mb-2">
            لیست پت
          </h1>
          <p className="text-gray-600">مدیریت و مشاهده پت ثبت شده</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="hidden lg:flex flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="جستجو در پت..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowForm(true)}
              className="flex cursor-pointer items-center gap-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              افزودن پت جدید
            </button>
          </div>
        </div>

        {/* Pets Grid */}
        {filteredPets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              هیچ پت یافت نشد
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "لطفاً جستجو را تغییر دهید یا پت جدیدی اضافه کنید"
                : "برای شروع، پت جدیدی اضافه کنید"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className=" cursor-pointer  bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-4 py-2 rounded-lg transition-colors"
              >
                افزودن پت جدید
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 w-full">
            {filteredPets.map((pet, index) => (
              <div
                key={index}
                className="bg-white md:min-w-[320px] md:max-w-[320px] w-full rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Pet Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {pet.namePet}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {pet.typePet}
                      </span>
                    </div>
                  </div>

                  {/* Pet Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">شماره بیمه:</span>
                      <span className="text-gray-900">
                        {pet.insuranceNumber || "تعیین نشده"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">اسم:</span>
                      <span className="text-gray-900">{pet.namePet}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">جنسیت:</span>
                      <span className="text-gray-900">
                        {pet.sex === "MEN"
                          ? "نر"
                          : pet.sex === "WOMEN"
                          ? "ماده"
                          : "نامشخص"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">کد میکروچیپ:</span>
                      <span className="text-gray-900">{pet.microChipCode}</span>
                    </div>
                    {pet.birthDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">تاریخ تولد:</span>
                        <span className="text-gray-900">
                          {new Date(pet.birthDate).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => handleView(pet)}
                      className="flex cursor-pointer items-center justify-center gap-1 bg-[var(--main-color)]/10 hover:bg-[var(--main-color)]/20 text-[var(--main-color)] px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Eye size={16} />
                      مشاهده
                    </button>
                    <button
                      onClick={() => handleEdit(pet)}
                      className="flex cursor-pointer items-center justify-center gap-1 bg-[var(--main-color)]/10 hover:bg-[var(--main-color)]/20 text-[var(--main-color)] px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Edit size={16} />
                      ویرایش
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQRCode(pet)}
                      className="flex cursor-pointer items-center justify-center gap-1 bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)] px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <QrCode size={16} />
                      QR Code
                    </button>
                    <button
                      onClick={() => {
                        setPetToDelete(pet);
                        setDeleteModalOpen(true);
                      }}
                      className="flex cursor-pointer items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Trash2 size={16} />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {/* <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-[var(--main-color)]">{pets.length}</div>
                            <div className="text-sm text-gray-600">کل پ</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{pets.filter(p => p.sex === "MEN").length}</div>
                            <div className="text-sm text-gray-600">نر</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-pink-600">{pets.filter(p => p.sex === "WOMEN").length}</div>
                            <div className="text-sm text-gray-600">ماده</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-600">{pets.filter(p => p.sex === "UNKNOWN").length}</div>
                            <div className="text-sm text-gray-600">نامشخص</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">{Array.from(new Set(pets.map(pet => pet.typePet))).length}</div>
                            <div className="text-sm text-gray-600">انواع مختلف</div>
                        </div>
                    </div>
                </div> */}
      </div>

      {/* Pet Form Modal */}
      {showForm && (
        <PetForm
          pet={editingPet}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Pet View Modal */}
      {viewingPet && (
        <PetViewModal pet={viewingPet} onClose={() => setViewingPet(null)} />
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && petToDelete && (
        <div className="fixed inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              تایید حذف پت
            </h2>
            <p className="mb-6 text-gray-700">
              آیا مطمئن هستید که می‌خواهید پت{" "}
              <span className="font-bold">{petToDelete.namePet}</span> را حذف
              کنید؟ این عملیات قابل بازگشت نیست.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setPetToDelete(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(petToDelete.petId || "")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalOpen && selectedPetForQR && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={handleQRModalClose}
          petId={selectedPetForQR.petId || ""}
          petName={selectedPetForQR.namePet}
          insuranceNumber={selectedPetForQR.insuranceNumber}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
        position="top-center"
      />
    </>
  );
}
