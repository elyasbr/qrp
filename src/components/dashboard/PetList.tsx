"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, Filter, MoreVertical } from "lucide-react";
import { Pet, getAllPets, deletePet, getPetById } from "@/services/api/petService";
import { useSnackbar } from "@/hooks/useSnackbar";
import Snackbar from "@/components/common/Snackbar";
import PetForm from "./PetForm";

export default function PetList() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [viewingPet, setViewingPet] = useState<Pet | null>(null);

    const { showError, showSuccess, snackbar, hideSnackbar } = useSnackbar();

    // Load pets on component mount
    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        try {
            setLoading(true);
            const petsData = await getAllPets();
            setPets(petsData);
        } catch (error: any) {
            showError("خطا در بارگذاری لیست حیوانات: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (petId: string) => {
        if (!confirm("آیا از حذف این حیوان اطمینان دارید؟")) return;

        try {
            await deletePet(petId);
            showSuccess("حیوان با موفقیت حذف شد");
            loadPets(); // Reload the list
        } catch (error: any) {
            showError("خطا در حذف حیوان: " + error.message);
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
            showError("خطا در دریافت اطلاعات حیوان: " + (error.message || "خطای نامشخص"));
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingPet(null);
        setViewingPet(null);
    };

    const handleFormSuccess = () => {
        showSuccess(editingPet ? "حیوان با موفقیت ویرایش شد" : "حیوان با موفقیت اضافه شد");
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)]"></div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen mt-14 lg:mt-0">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">لیست حیوانات</h1>
                    <p className="text-gray-600">مدیریت و مشاهده حیوانات ثبت شده</p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="جستجو در حیوانات..."
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
                            افزودن حیوان جدید
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ حیوانی یافت نشد</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm
                                ? "لطفاً جستجو را تغییر دهید یا حیوان جدیدی اضافه کنید"
                                : "برای شروع، حیوان جدیدی اضافه کنید"
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                افزودن حیوان جدید
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPets.map((pet, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Pet Image Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">🐾</div>
                                        <div className="text-sm text-gray-600">{pet.typePet}</div>
                                    </div>
                                </div>

                                {/* Pet Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{pet.namePet}</h3>
                                            <p className="text-sm text-gray-600">{pet.typePet}</p>
                                        </div>
                                        <div className="relative">
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pet Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">جنسیت:</span>
                                            <span className="text-gray-900">
                                                {pet.sex === "MEN" ? "نر" : pet.sex === "WOMEN" ? "ماده" : "نامشخص"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">وزن:</span>
                                            <span className="text-gray-900">{pet.weightPet} کیلوگرم</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">رنگ:</span>
                                            <span className="text-gray-900">{pet.colorPet}</span>
                                        </div>
                                        {pet.birthDate && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">تاریخ تولد:</span>
                                                <span className="text-gray-900">{new Date(pet.birthDate).toLocaleDateString('fa-IR')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(pet)}
                                            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            <Eye size={16} />
                                            مشاهده
                                        </button>
                                        <button
                                            onClick={() => handleEdit(pet)}
                                            className="flex-1 flex items-center justify-center gap-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            <Edit size={16} />
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pet.petId || "")}
                                            className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors"
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
                <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-[var(--main-color)]">{pets.length}</div>
                            <div className="text-sm text-gray-600">کل حیوانات</div>
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
                </div>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">جزئیات حیوان</h2>
                                <button
                                    onClick={() => setViewingPet(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">اطلاعات اصلی</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="text-gray-500">نام:</span> {viewingPet.namePet}</div>
                                        <div><span className="text-gray-500">نوع:</span> {viewingPet.typePet}</div>
                                        <div><span className="text-gray-500">جنسیت:</span> {viewingPet.sex === "MEN" ? "نر" : viewingPet.sex === "WOMEN" ? "ماده" : "نامشخص"}</div>
                                        <div><span className="text-gray-500">رنگ:</span> {viewingPet.colorPet}</div>
                                        <div><span className="text-gray-500">وزن:</span> {viewingPet.weightPet} کیلوگرم</div>
                                        <div><span className="text-gray-500">قد:</span> {viewingPet.heightPet} سانتی‌متر</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">اطلاعات پزشکی</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="text-gray-500">واکسن هاری:</span> {viewingPet.vaccineRabiel ? "بله" : "خیر"}</div>
                                        <div><span className="text-gray-500">واکسن LDHPPi:</span> {viewingPet.vaccineLDHPPi ? "بله" : "خیر"}</div>
                                        <div><span className="text-gray-500">واکسن RCP:</span> {viewingPet.vaccineRCP ? "بله" : "خیر"}</div>
                                        <div><span className="text-gray-500">عقیم شده:</span> {viewingPet.isSterile ? "بله" : "خیر"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleEdit(viewingPet)}
                                    className="bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    ویرایش
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
