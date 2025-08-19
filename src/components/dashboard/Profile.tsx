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
                <h2 className="text-xl font-bold text-[var(--foreground)]">ایران راد </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">iranrad@example.com</p>

                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                    <button className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)] transition">
                        <Pencil size={18} />
                        ویرایش پروفایل
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
