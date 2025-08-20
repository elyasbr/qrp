import React from "react";
import { getPetByIdPublic, Pet } from "@/services/api/petService";

async function fetchPet(id: string): Promise<Pet | null> {
  try {
    return await getPetByIdPublic(id);
  } catch (e) {
    return null;
  }
}

export default async function QRPublicPage(props: any) {
  const rawParams = props?.params;
  const params = rawParams && typeof rawParams.then === "function" ? await rawParams : rawParams;
  const id: string | undefined = params?.id;
  const pet = id ? await fetchPet(id) : null;

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl border p-6 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-[var(--main-color)]">اطلاعات پت</h1>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">نام پت:</span><span>{pet.namePet}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">نوع:</span><span>{pet.typePet}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">رنگ:</span><span>{pet.colorPet}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">گروه خونی:</span><span>{pet.blood}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">جنسیت:</span><span>{pet.sex}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">تاریخ تولد (میلادی):</span><span>{pet.birthDate}</span></div>
        </div>
        {pet.imageUrl && (
          <div>
            <img src={pet.imageUrl} alt={pet.namePet} className="rounded-lg w-full h-auto" />
          </div>
        )}
        {pet.videoUrl && (
          <div className="aspect-video w-full">
            <video src={pet.videoUrl} className="w-full h-full rounded-lg" controls />
          </div>
        )}
      </div>
    </div>
  );
}


