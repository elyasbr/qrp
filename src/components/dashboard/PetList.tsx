"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Eye, Search, Filter, MoreVertical, PawPrint, QrCode } from "lucide-react";
import { Pet, getAllPets, deletePet, getPetById } from "@/services/api/petService";
import { useSnackbar } from "@/hooks/useSnackbar";
import Snackbar from "@/components/common/Snackbar";
import PetForm from "./PetForm";
import QRCodeModal from "@/components/common/QRCodeModal";
import { formatPersianDate } from "@/utils/dateUtils";

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
            console.log("pet", pet);
        } catch (error: any) {
            showError("خطا در دریافت اطلاعات پت: " + (error.message || "خطای نامشخص"));
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
        showSuccess(editingPet ? "پت با موفقیت ویرایش شد" : "پت با موفقیت اضافه شد");
        handleFormClose();
        loadPets();
    };

    // Filter and search pets
    const filteredPets = pets.filter(pet => {
        const matchesSearch = pet.namePet.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                    <div className="text-[var(--main-color)] font-semibold">در حال بارگذاری...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen mt-14 lg:mt-0">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[var(--main-color)] mb-2">لیست پت</h1>
                    <p className="text-gray-600">مدیریت و مشاهده پت ثبت شده</p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="hidden lg:flex flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                            className="flex items-center gap-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-4 py-2 rounded-lg transition-colors"
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
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ پت یافت نشد</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm
                                ? "لطفاً جستجو را تغییر دهید یا پت جدیدی اضافه کنید"
                                : "برای شروع، پت جدیدی اضافه کنید"
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                افزودن پت جدید
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPets.map((pet, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Pet Image Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2"><PawPrint /></div>
                                        <div className="text-sm text-gray-600">{pet.typePet}</div>
                                    </div>
                                    {/* QR Code Indicator */}
                                    <div className="absolute top-2 right-2">
                                        <div className="bg-white/80 backdrop-blur-sm rounded-full p-1">
                                            <QrCode size={16} className="text-[var(--main-color)]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Pet Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{pet.namePet}</h3>
                                            <p className="text-sm text-gray-600">{pet.typePet}</p>
                                        </div>
                                    </div>

                                    {/* Pet Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">اسم:</span>
                                            <span className="text-gray-900">{pet.namePet}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">جنسیت:</span>
                                            <span className="text-gray-900">
                                                {pet.sex === "MEN" ? "نر" : pet.sex === "WOMEN" ? "ماده" : "نامشخص"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">گروه خونی:</span>
                                            <span className="text-gray-900">{pet.blood}</span>
                                        </div>
                                        {pet.birthDate && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">تاریخ تولد:</span>
                                                <span className="text-gray-900">{new Date(pet.birthDate).toLocaleDateString('fa-IR')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <button
                                            onClick={() => handleView(pet)}
                                            className="flex items-center justify-center gap-1 bg-[var(--main-color)]/10 hover:bg-[var(--main-color)]/20 text-[var(--main-color)] px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            <Eye size={16} />
                                            مشاهده
                                        </button>
                                        <button
                                            onClick={() => handleEdit(pet)}
                                            className="flex items-center justify-center gap-1 bg-[var(--main-color)]/10 hover:bg-[var(--main-color)]/20 text-[var(--main-color)] px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            <Edit size={16} />
                                            ویرایش
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleQRCode(pet)}
                                            className="flex items-center justify-center gap-1 bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)] px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            <QrCode size={16} />
                                            QR Code
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPetToDelete(pet);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors"
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
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setViewingPet(null)}>
                    <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute inset-0 -z-10 blur-2xl rounded-3xl bg-gradient-to-tr from-[var(--main-color)]/20 to-purple-400/20" />
                        <div className="bg-white/90 rounded-2xl shadow-xl ring-1 ring-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="sticky top-0 bg-white/90 z-10 flex items-center justify-between px-6 py-4 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-[var(--main-color)]/10 flex items-center justify-center text-2xl">🐾</div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{viewingPet.namePet}</h2>
                                        <p className="text-xs text-gray-500">{viewingPet.typePet}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQRCode(viewingPet)}
                                        className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        <QrCode size={16} />
                                        QR Code
                                    </button>
                                    <button onClick={() => setViewingPet(null)} className="text-gray-400 hover:text-[var(--main-color)] transition-colors" aria-label="Close">
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 overflow-y-auto flex-1">
                                {/* Media preview if exists */}
                                {(viewingPet.imageUrl || viewingPet.videoUrl) && (
                                    <div className="mb-5 overflow-hidden rounded-xl ring-1 ring-gray-200">
                                        {viewingPet.videoUrl ? (
                                            <video src={viewingPet.videoUrl} className="w-full h-auto" controls />
                                        ) : (
                                            <img src={viewingPet.imageUrl as any} alt={viewingPet.namePet} className="w-full h-auto" />
                                        )}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Pet Characteristics */}
                                    <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                                        <h3 className="text-md font-bold text-[var(--main-color)] mb-3">مشخصات حیوان خانگی</h3>
                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                            <span className="text-gray-500">نام پت</span><span className="text-gray-900">{viewingPet.namePet}</span>
                                            <span className="text-gray-500">نوع پت</span><span className="text-gray-900">{viewingPet.typePet}</span>
                                            <span className="text-gray-500">جنسیت</span><span className="text-gray-900">{viewingPet.sex === "MEN" ? "نر" : viewingPet.sex === "WOMEN" ? "ماده" : "نامشخص"}</span>
                                            <span className="text-gray-500">تاریخ تولد</span><span className="text-gray-900">{viewingPet.birthDate ? formatPersianDate(viewingPet.birthDate) : ""}</span>
                                            <span className="text-gray-500">شماره شناسنامه</span><span className="text-gray-900">{viewingPet.birthCertificateNumberPet}</span>
                                            <span className="text-gray-500">کد میکروچیپ</span><span className="text-gray-900">{viewingPet.microChipCode}</span>
                                            <span className="text-gray-500">رنگ پت</span><span className="text-gray-900">{viewingPet.colorPet}</span>
                                            <span className="text-gray-500">وزن</span><span className="text-gray-900">{viewingPet.weightPet} کیلوگرم</span>
                                            <span className="text-gray-500">قد</span><span className="text-gray-900">{viewingPet.heightPet} سانتی‌متر</span>
                                            <span className="text-gray-500">دامپزشک صادر کننده</span><span className="text-gray-900">{viewingPet.issuingVeterinarian}</span>
                                            <span className="text-gray-500">نظام دامپزشکی</span><span className="text-gray-900">{viewingPet.issuingMedicalSystem}</span>
                                        </div>
                                        {viewingPet.distinctiveFeature && (
                                            <div className="mt-3 text-sm">
                                                <div className="text-gray-700 font-semibold mb-1">ویژگی بارز ظاهری</div>
                                                <div className="text-gray-700">{viewingPet.distinctiveFeature}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Owner Information */}
                                    <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                                        <h3 className="text-md font-bold text-[var(--main-color)] mb-3">مشخصات سرپرست پت</h3>
                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                            <span className="text-gray-500">نام و نام خانوادگی</span><span className="text-gray-900">{viewingPet.nameHead}</span>
                                            <span className="text-gray-500">کد ملی</span><span className="text-gray-900">{viewingPet.nationalCodeHead}</span>
                                            <span className="text-gray-500">موبایل (۱)</span><span className="text-gray-900">{viewingPet.mobile1Head}</span>
                                            <span className="text-gray-500">موبایل (۲)</span><span className="text-gray-900">{viewingPet.mobile2Head}</span>
                                            <span className="text-gray-500">تلفن ثابت</span><span className="text-gray-900">{viewingPet.telHead}</span>
                                            <span className="text-gray-500">استان</span><span className="text-gray-900">{viewingPet.stateHead}</span>
                                            <span className="text-gray-500">شهر</span><span className="text-gray-900">{viewingPet.cityHead}</span>
                                            <span className="text-gray-500">کد پستی</span><span className="text-gray-900">{viewingPet.postalCodeHead}</span>
                                            <span className="text-gray-500">ایمیل</span><span className="text-gray-900">{viewingPet.emailHead}</span>
                                            <span className="text-gray-500">آدرس</span><span className="text-gray-900">{viewingPet.addressHead}</span>
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                                            {viewingPet.telegramHead && (<><span className="text-gray-500">تلگرام</span><span className="text-gray-900">{viewingPet.telegramHead}</span></>)}
                                            {viewingPet.whatsAppHead && (<><span className="text-gray-500">واتساپ</span><span className="text-gray-900">{viewingPet.whatsAppHead}</span></>)}
                                            {viewingPet.instagramHead && (<><span className="text-gray-500">اینستاگرام</span><span className="text-gray-900">{viewingPet.instagramHead}</span></>)}
                                            {viewingPet.youtubeHead && (<><span className="text-gray-500">یوتیوب</span><span className="text-gray-900">{viewingPet.youtubeHead}</span></>)}
                                            {viewingPet.linkedinHead && (<><span className="text-gray-500">لینکدین</span><span className="text-gray-900">{viewingPet.linkedinHead}</span></>)}
                                        </div>
                                    </div>

                                    {/* Health Information */}
                                    <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                                        <h3 className="text-md font-bold text-[var(--main-color)] mb-3">ویژگی و اطلاعات سلامتی</h3>
                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                            <span className="text-gray-500">دامپزشک عمومی</span><span className="text-gray-900">{viewingPet.generalVeterinarian}</span>
                                            <span className="text-gray-500">آدرس دامپزشک عمومی</span><span className="text-gray-900">{viewingPet.addressGeneralVeterinarian}</span>
                                            <span className="text-gray-500">تلفن دامپزشک عمومی</span><span className="text-gray-900">{viewingPet.phoneNumberGeneralVeterinarian}</span>
                                            <span className="text-gray-500">دامپزشک متخصص</span><span className="text-gray-900">{viewingPet.specialistVeterinarian}</span>
                                            <span className="text-gray-500">آدرس دامپزشک متخصص</span><span className="text-gray-900">{viewingPet.addressSpecialistVeterinarian}</span>
                                            <span className="text-gray-500">تلفن دامپزشک متخصص</span><span className="text-gray-900">{viewingPet.phoneNumberSpecialistVeterinarian}</span>
                                            <span className="text-gray-500">پت عقیم است</span><span className="text-gray-900">{viewingPet.isSterile ? "بله" : "خیر"}</span>
                                            <span className="text-gray-500">واکسن Rabiel</span><span className="text-gray-900">{viewingPet.vaccineRabiel ? "دارد" : "ندارد"}</span>
                                            <span className="text-gray-500">واکسن LDHPPi</span><span className="text-gray-900">{viewingPet.vaccineLDHPPi ? "دارد" : "ندارد"}</span>
                                            <span className="text-gray-500">واکسن R.C.P</span><span className="text-gray-900">{viewingPet.vaccineRCP ? "دارد" : "ندارد"}</span>
                                            <span className="text-gray-500">نوع تغذیه</span><span className="text-gray-900">{viewingPet.typeFeeding}</span>
                                            <span className="text-gray-500">تعداد وعده های غذایی</span><span className="text-gray-900">{viewingPet.numberMeal}</span>
                                        </div>
                                        <div className="mt-3 space-y-2 text-sm">
                                            {viewingPet.diet && (<div><span className="font-semibold text-gray-700">رژیم غذایی:</span> <span className="text-gray-700">{viewingPet.diet}</span></div>)}
                                            {viewingPet.prohibitedFoodItems && (<div><span className="font-semibold text-gray-700">موارد ممنوع تغذیه:</span> <span className="text-gray-700">{viewingPet.prohibitedFoodItems}</span></div>)}
                                            {viewingPet.regularlyUsedMedications && (<div><span className="font-semibold text-gray-700">داروهای مصرفی دائم:</span> <span className="text-gray-700">{viewingPet.regularlyUsedMedications}</span></div>)}
                                            {viewingPet.prohibitedDrugs && (<div><span className="font-semibold text-gray-700">داروهای ممنوعه:</span> <span className="text-gray-700">{viewingPet.prohibitedDrugs}</span></div>)}
                                            {viewingPet.favoriteEncouragement && (<div><span className="font-semibold text-gray-700">تشویقی مورد علاقه:</span> <span className="text-gray-700">{viewingPet.favoriteEncouragement}</span></div>)}
                                        </div>
                                    </div>

                                    {/* Behavioral Information */}
                                    <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                                        <h3 className="text-md font-bold text-[var(--main-color)] mb-3">اطلاعات و ویژگی‌های رفتاری شخصیتی</h3>
                                        <div className="space-y-2 text-sm">
                                            {viewingPet.behavioralHabits && (<div><span className="font-semibold text-gray-700">عادت های رفتاری:</span> <span className="text-gray-700">{viewingPet.behavioralHabits}</span></div>)}
                                            {viewingPet.susceptibility && (<div><span className="font-semibold text-gray-700">مهارت و استعدادها:</span> <span className="text-gray-700">{viewingPet.susceptibility}</span></div>)}
                                            {viewingPet.sensitivities && (<div><span className="font-semibold text-gray-700">حساسیت ها:</span> <span className="text-gray-700">{viewingPet.sensitivities}</span></div>)}
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                                            <span className="text-gray-500">با پت دیگری اقامت دارد؟</span><span className="text-gray-900">{viewingPet.connectOtherPets ? "بله" : "خیر"}</span>
                                            <span className="text-gray-500">با کودکان ارتباط دارد؟</span><span className="text-gray-900">{viewingPet.connectWithBaby ? "بله" : "خیر"}</span>
                                        </div>
                                    </div>

                                    {/* Consultations */}
                                    <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                                        <h3 className="text-md font-bold text-[var(--main-color)] mb-3">مشاوره ها</h3>
                                        <div className="space-y-2 text-sm">
                                            {viewingPet.nutritionalCounseling && (<div><span className="font-semibold text-gray-700">مشاوره متخصص تغذیه:</span> <span className="text-gray-700">{viewingPet.nutritionalCounseling}</span></div>)}
                                            {viewingPet.expertVeterinaryCounseling && (<div><span className="font-semibold text-gray-700">مشاوره دامپزشک متخصص:</span> <span className="text-gray-700">{viewingPet.expertVeterinaryCounseling}</span></div>)}
                                            {viewingPet.trainingAdvice && (<div><span className="font-semibold text-gray-700">مشاوره تربیت پت:</span> <span className="text-gray-700">{viewingPet.trainingAdvice}</span></div>)}
                                        </div>
                                    </div>

                                    {/* Digital Links */}
                                    <div className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                                        <h3 className="text-md font-bold text-[var(--main-color)] mb-3">لینک و اسناد دیجیتال</h3>
                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                            {viewingPet.certificatePDF && (<><span className="text-gray-500">PDF شناسنامه</span><a className="text-[var(--main-color)] underline" href={viewingPet.certificatePDF} target="_blank" rel="noreferrer">مشاهده</a></>)}
                                            {viewingPet.insurancePDF && (<><span className="text-gray-500">PDF بیمه نامه</span><a className="text-[var(--main-color)] underline" href={viewingPet.insurancePDF} target="_blank" rel="noreferrer">مشاهده</a></>)}
                                            {viewingPet.imageUrl && (<><span className="text-gray-500">عکس پت</span><a className="text-[var(--main-color)] underline" href={viewingPet.imageUrl} target="_blank" rel="noreferrer">مشاهده</a></>)}
                                            {viewingPet.videoUrl && (<><span className="text-gray-500">ویدئو پت</span><a className="text-[var(--main-color)] underline" href={viewingPet.videoUrl} target="_blank" rel="noreferrer">مشاهده</a></>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Footer Close */}
                            <div className="sticky bottom-0 px-6 py-4 border-t flex justify-end bg-white/90 z-10">
                                <button onClick={() => setViewingPet(null)} className="px-4 py-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white rounded-lg transition-colors">بستن</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteModalOpen && petToDelete && (
                <div className="fixed inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-4 text-gray-900">تایید حذف پت</h2>
                        <p className="mb-6 text-gray-700">آیا مطمئن هستید که می‌خواهید پت <span className="font-bold">{petToDelete.namePet}</span> را حذف کنید؟ این عملیات قابل بازگشت نیست.</p>
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
