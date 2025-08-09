"use client"
import React, { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";

const Profile = () => {
    const [showForm, setShowForm] = useState(false);

    const handleToggleForm = () => {
        setShowForm((prev) => !prev);
    };

    return (
        <div className="p-4 mt-14 max-w-2xl mx-auto bg-white dark:bg-[var(--background)] rounded-2xl shadow-md">
            {/* پروفایل کاربر */}
            <div className="flex flex-col items-center text-center">
                <img
                    src="/images/avatar.png"
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full mb-4 border-4 border-[var(--main-color)]"
                />
                <h2 className="text-xl font-bold text-[var(--foreground)]">علیرضا بهلول</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">alireza@example.com</p>

                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                    <button className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)] transition">
                        <Pencil size={18} />
                        ویرایش پروفایل
                    </button>

                    <button
                        onClick={handleToggleForm}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)] transition"
                    >
                        <PlusCircle size={18} />
                        {showForm ? "بستن فرم" : "تکمیل اطلاعات پت"}
                    </button>
                </div>
            </div>

            {/* فرم اطلاعات حیوان خانگی */}
            {showForm && (
                <form className="mt-8 space-y-4 text-right">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">نام پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">نوع پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">نام نژاد</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">جنسیت پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">تاریخ تولد پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">شماره شناسنامه پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">کد میکروچیپ پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">رنگ پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">ویژگی باز ظاهری</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">وزن پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">قد پت</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div>
                            <label className="block mb-1">نام دامپزشک صادرکننده</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                        <div className="sm:col-span-2">
                            <label className="block mb-1">تلفن و آدرس دامپزشک</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] transition"
                            />                         </div>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="mt-6 px-6 py-2 rounded-xl bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)] transition"
                        >
                            ذخیره اطلاعات
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
