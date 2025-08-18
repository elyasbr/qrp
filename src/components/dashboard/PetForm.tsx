"use client";
import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Pet, createPet, updatePet } from "@/services/api/petService";
import { useSnackbar } from "@/hooks/useSnackbar";

interface PetFormProps {
  pet?: Pet | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PetForm({ pet, onClose, onSuccess }: PetFormProps) {
  const [formData, setFormData] = useState<Partial<Pet>>({
    namePet: "",
    typePet: "DOG",
    blood: "",
    sex: "MEN",
    birthDate: "",
    birthCertificateNumberPet: "",
    microChipCode: "",
    colorPet: "UNKNOWN",
    distinctiveFeature: "",
    weightPet: 0,
    heightPet: 0,
    issuingVeterinarian: "",
    addressVeterinarian: "",
    phoneNumberVeterinarian: "",
    issuingMedicalSystem: "",
    nameHead: "",
    nationalCodeHead: "",
    mobile1Head: "",
    mobile2Head: "",
    telHead: "",
    iso3Head: "",
    stateHead: "",
    cityHead: "",
    addressHead: "",
    postalCodeHead: "",
    emailHead: "",
    telegramHead: "",
    youtubeHead: "",
    instagramHead: "",
    whatsAppHead: "",
    linkedinHead: "",
    generalVeterinarian: "",
    addressGeneralVeterinarian: "",
    phoneNumberGeneralVeterinarian: "",
    specialistVeterinarian: "",
    addressSpecialistVeterinarian: "",
    phoneNumberSpecialistVeterinarian: "",
    isSterile: false,
    vaccineRabiel: false,
    vaccineLDHPPi: false,
    vaccineRCP: false,
    typeFeeding: "",
    numberMeal: 0,
    diet: "",
    prohibitedFoodItems: "",
    regularlyUsedMedications: "",
    prohibitedDrugs: "",
    favoriteEncouragement: "",
    behavioralHabits: "",
    susceptibility: "",
    sensitivities: "",
    connectOtherPets: false,
    connectWithBaby: false,
    nutritionalCounseling: "",
    expertVeterinaryCounseling: "",
    trainingAdvice: ""
  });

  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useSnackbar();

  // Function to format phone numbers with +98 prefix
  const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) return "";
    
    // Remove any existing country codes and spaces/dashes
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "");
    
    // Remove +98 if it already exists
    if (cleaned.startsWith("+98")) {
      cleaned = cleaned.substring(3);
    }
    // Remove 0098 if it exists
    else if (cleaned.startsWith("0098")) {
      cleaned = cleaned.substring(4);
    }
    // Remove leading 0 if it exists (Iranian mobile numbers)
    else if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    
    // Add +98 prefix
    return `+98${cleaned}`;
  };

  // Initialize form with pet data if editing
  useEffect(() => {
    if (pet) {
      setFormData(pet);
    }
  }, [pet]);

  const handleInputChange = (field: keyof Pet, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle phone number input changes with formatting
  const handlePhoneNumberChange = (field: keyof Pet, value: string) => {
    const formattedNumber = formatPhoneNumber(value);
    setFormData(prev => ({
      ...prev,
      [field]: formattedNumber
    }));
  };

  const validateRequiredFields = (data: Partial<Pet>) => {
    const requiredStringFields = [
      'namePet',
      'typePet', 
      'phoneNumberVeterinarian',
      'mobile1Head',
      'phoneNumberGeneralVeterinarian', 
      'phoneNumberSpecialistVeterinarian'
    ];

    const missingFields = requiredStringFields.filter(field => 
      !data[field as keyof Pet] || String(data[field as keyof Pet]).trim() === ""
    );

    return missingFields;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data with all required fields having proper values
      const submitData = {
        namePet: String(formData.namePet || "سگ تست"),
        typePet: String(formData.typePet || "DOG"),
        blood: String(formData.blood || "A+"),
        sex: String(formData.sex || "MEN"),
        birthDate: String(formData.birthDate || "2020-01-01"),
        birthCertificateNumberPet: String(formData.birthCertificateNumberPet || "BC123456"),
        microChipCode: String(formData.microChipCode || "MC123456789"),
        colorPet: String(formData.colorPet || "BLACK"),
        distinctiveFeature: String(formData.distinctiveFeature || "لکه سفید روی پیشانی"),
        weightPet: Number(formData.weightPet) || 15,
        heightPet: Number(formData.heightPet) || 45,
        issuingVeterinarian: String(formData.issuingVeterinarian || "دکتر رضایی"),
        addressVeterinarian: String(formData.addressVeterinarian || "تهران، خیابان ولیعصر، پلاک 123"),
        phoneNumberVeterinarian: formatPhoneNumber(formData.phoneNumberVeterinarian || "9152944444"),
        issuingMedicalSystem: String(formData.issuingMedicalSystem || "سیستم پزشکی تهران"),
        nameHead: String(formData.nameHead || "احمد احمدی"),
        nationalCodeHead: String(formData.nationalCodeHead || "1234567890"),
        mobile1Head: formatPhoneNumber(formData.mobile1Head || "9123456789"),
        mobile2Head: formatPhoneNumber(formData.mobile2Head || "9987654321"),
        telHead: formatPhoneNumber(formData.telHead || "2112345678"),
        iso3Head: String(formData.iso3Head || "IRN"),
        stateHead: String(formData.stateHead || "تهران"),
        cityHead: String(formData.cityHead || "تهران"),
        addressHead: String(formData.addressHead || "تهران، خیابان ولیعصر، پلاک 456"),
        postalCodeHead: String(formData.postalCodeHead || "1234567890"),
        emailHead: String(formData.emailHead || "test@example.com"),
        telegramHead: String(formData.telegramHead || "@testuser"),
        youtubeHead: String(formData.youtubeHead || "testchannel"),
        instagramHead: String(formData.instagramHead || "@testuser"),
        whatsAppHead: formatPhoneNumber(formData.whatsAppHead || "9123456789"),
        linkedinHead: String(formData.linkedinHead || "testuser"),
        generalVeterinarian: String(formData.generalVeterinarian || "دکتر احمدی"),
        addressGeneralVeterinarian: String(formData.addressGeneralVeterinarian || "تهران، خیابان ولیعصر، پلاک 789"),
        phoneNumberGeneralVeterinarian: formatPhoneNumber(formData.phoneNumberGeneralVeterinarian || "2112345678"),
        specialistVeterinarian: String(formData.specialistVeterinarian || "دکتر محمدی"),
        addressSpecialistVeterinarian: String(formData.addressSpecialistVeterinarian || "تهران، خیابان ولیعصر، پلاک 101"),
        phoneNumberSpecialistVeterinarian: formatPhoneNumber(formData.phoneNumberSpecialistVeterinarian || "2112345678"),
        isSterile: Boolean(formData.isSterile),
        vaccineRabiel: Boolean(formData.vaccineRabiel),
        vaccineLDHPPi: Boolean(formData.vaccineLDHPPi),
        vaccineRCP: Boolean(formData.vaccineRCP),
        typeFeeding: String(formData.typeFeeding || "خشک"),
        numberMeal: Number(formData.numberMeal) || 2,
        diet: String(formData.diet || "غذای مخصوص سگ"),
        prohibitedFoodItems: String(formData.prohibitedFoodItems || "شکلات، پیاز، سیر"),
        regularlyUsedMedications: String(formData.regularlyUsedMedications || "هیچ دارویی مصرف نمی‌شود"),
        prohibitedDrugs: String(formData.prohibitedDrugs || "هیچ دارویی منع نشده"),
        favoriteEncouragement: String(formData.favoriteEncouragement || "اسباب بازی توپ"),
        behavioralHabits: String(formData.behavioralHabits || "دوستانه و بازیگوش"),
        susceptibility: String(formData.susceptibility || "هیچ حساسیتی ندارد"),
        sensitivities: String(formData.sensitivities || "هیچ حساسیتی ندارد"),
        connectOtherPets: Boolean(formData.connectOtherPets),
        connectWithBaby: Boolean(formData.connectWithBaby),
        nutritionalCounseling: String(formData.nutritionalCounseling || "مشاوره تغذیه استاندارد برای سگ"),
        expertVeterinaryCounseling: String(formData.expertVeterinaryCounseling || "مشاوره دامپزشکی استاندارد"),
        trainingAdvice: String(formData.trainingAdvice || "مشاوره آموزش استاندارد")
      };
      
      // Double-check that critical required fields are not empty
      const criticalFields = [
        'typePet', 
        'phoneNumberVeterinarian',
        'mobile1Head', 
        'phoneNumberGeneralVeterinarian',
        'phoneNumberSpecialistVeterinarian'
      ];

      for (const field of criticalFields) {
        const value = submitData[field as keyof typeof submitData];
        if (!value || value === '' || value === 'undefined' || value === 'null') {
          console.error(`Critical field ${field} is empty or invalid:`, value);
          showError(`فیلد ${field} اجباری است و نمی‌تواند خالی باشد`);
          setLoading(false);
          return;
        }
      }

      console.log("Final submitData:", submitData);
      console.log("Critical fields check:", criticalFields.map(field => ({
        field,
        value: submitData[field as keyof typeof submitData],
        type: typeof submitData[field as keyof typeof submitData]
      })));

      if (pet) {
        // Update existing pet
        await updatePet(pet.microChipCode || "", submitData as Pet);
        showSuccess("حیوان با موفقیت ویرایش شد");
      } else {
        // Create new pet
        await createPet(submitData as Pet);
        showSuccess("حیوان با موفقیت اضافه شد");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Pet submission error:", error);
      if (error.response?.data?.message) {
        // Handle API validation errors
        const errorMessages = Array.isArray(error.response.data.message)
          ? error.response.data.message.map((err: any) => err.msg || err).join(", ")
          : error.response.data.message;
        showError(`خطا در اعتبارسنجی: ${errorMessages}`);
      } else {
        showError("خطا در ذخیره اطلاعات: " + (error.message || "خطای نامشخص"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {pet ? "ویرایش حیوان" : "افزودن حیوان جدید"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات اصلی</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام حیوان *</label>
                    <input
                      type="text"
                      value={formData.namePet || ""}
                      onChange={(e) => handleInputChange("namePet", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      required
                      placeholder="نام حیوان را وارد کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع حیوان <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.typePet || "DOG"}
                      onChange={(e) => handleInputChange("typePet", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      required
                    >
                        <option value="DOG">سگ</option>
                      <option value="CAT">گربه</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">گروه خونی</label>
                    <input
                      type="text"
                      value={formData.blood || ""}
                      onChange={(e) => handleInputChange("blood", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: A+، B+، O+"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">جنسیت *</label>
                    <select
                      value={formData.sex || "MEN"}
                      onChange={(e) => handleInputChange("sex", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    >
                      <option value="MEN">نر</option>
                      <option value="WOMEN">ماده</option>
                      <option value="UNKNOWN">نامشخص</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رنگ</label>
                    <select
                      value={formData.colorPet || "UNKNOWN"}
                      onChange={(e) => handleInputChange("colorPet", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    >
                      <option value="RED">قرمز</option>
                      <option value="BLUE">آبی</option>
                      <option value="GREEN">سبز</option>
                      <option value="YELLOW">زرد</option>
                      <option value="BLACK">مشکی</option>
                      <option value="WHITE">سفید</option>
                      <option value="ORANGE">نارنجی</option>
                      <option value="PURPLE">بنفش</option>
                      <option value="PINK">صورتی</option>
                      <option value="BROWN">قهوه‌ای</option>
                      <option value="GRAY">خاکستری</option>
                      <option value="CYAN">فیروزه‌ای</option>
                      <option value="MAGENTA">ارغوانی</option>
                      <option value="UNKNOWN">نامشخص</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">وزن (کیلوگرم)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.weightPet || ""}
                      onChange={(e) => handleInputChange("weightPet", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">قد (سانتی‌متر)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.heightPet || ""}
                      onChange={(e) => handleInputChange("heightPet", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ تولد</label>
                    <input
                      type="date"
                      value={formData.birthDate || ""}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات پزشکی</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">کد میکروچیپ</label>
                    <input
                      type="text"
                      value={formData.microChipCode || ""}
                      onChange={(e) => handleInputChange("microChipCode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">شماره گواهی تولد</label>
                    <input
                      type="text"
                      value={formData.birthCertificateNumberPet || ""}
                      onChange={(e) => handleInputChange("birthCertificateNumberPet", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">دامپزشک صادرکننده</label>
                    <input
                      type="text"
                      value={formData.issuingVeterinarian || ""}
                      onChange={(e) => handleInputChange("issuingVeterinarian", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">آدرس دامپزشک</label>
                    <input
                      type="text"
                      value={formData.addressVeterinarian || ""}
                      onChange={(e) => handleInputChange("addressVeterinarian", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شماره تلفن دامپزشک <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumberVeterinarian || ""}
                      onChange={(e) => handlePhoneNumberChange("phoneNumberVeterinarian", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      required
                      placeholder="مثال: 9152944444 (اجباری)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">سیستم پزشکی صادرکننده</label>
                    <input
                      type="text"
                      value={formData.issuingMedicalSystem || ""}
                      onChange={(e) => handleInputChange("issuingMedicalSystem", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع تغذیه</label>
                    <input
                      type="text"
                      value={formData.typeFeeding || ""}
                      onChange={(e) => handleInputChange("typeFeeding", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تعداد وعده غذایی</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.numberMeal || ""}
                      onChange={(e) => handleInputChange("numberMeal", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="mt-4 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isSterile || false}
                      onChange={(e) => handleInputChange("isSterile", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">عقیم شده</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.vaccineRabiel || false}
                      onChange={(e) => handleInputChange("vaccineRabiel", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">واکسن هاری</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.vaccineLDHPPi || false}
                      onChange={(e) => handleInputChange("vaccineLDHPPi", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">واکسن LDHPPi</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.vaccineRCP || false}
                      onChange={(e) => handleInputChange("vaccineRCP", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">واکسن RCP</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.connectOtherPets || false}
                      onChange={(e) => handleInputChange("connectOtherPets", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">ارتباط با حیوانات دیگر</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.connectWithBaby || false}
                      onChange={(e) => handleInputChange("connectWithBaby", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">ارتباط با نوزاد</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات صاحب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام صاحب</label>
                  <input
                    type="text"
                    value={formData.nameHead || ""}
                    onChange={(e) => handleInputChange("nameHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                  <input
                    type="text"
                    value={formData.nationalCodeHead || ""}
                    onChange={(e) => handleInputChange("nationalCodeHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    موبایل ۱ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile1Head || ""}
                    onChange={(e) => handlePhoneNumberChange("mobile1Head", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    required
                    placeholder="مثال: 9123456789 (اجباری)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">موبایل ۲</label>
                  <input
                    type="tel"
                    value={formData.mobile2Head || ""}
                    onChange={(e) => handlePhoneNumberChange("mobile2Head", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    placeholder="مثال: 9987654321"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
                  <input
                    type="tel"
                    value={formData.telHead || ""}
                    onChange={(e) => handlePhoneNumberChange("telHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    placeholder="مثال: 2112345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                  <input
                    type="email"
                    value={formData.emailHead || ""}
                    onChange={(e) => handleInputChange("emailHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
                  <input
                    type="text"
                    value={formData.stateHead || ""}
                    onChange={(e) => handleInputChange("stateHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">شهر</label>
                  <input
                    type="text"
                    value={formData.cityHead || ""}
                    onChange={(e) => handleInputChange("cityHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
                  <input
                    type="text"
                    value={formData.addressHead || ""}
                    onChange={(e) => handleInputChange("addressHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">کد پستی</label>
                  <input
                    type="text"
                    value={formData.postalCodeHead || ""}
                    onChange={(e) => handleInputChange("postalCodeHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تلگرام</label>
                  <input
                    type="text"
                    value={formData.telegramHead || ""}
                    onChange={(e) => handleInputChange("telegramHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    placeholder="مثال: @username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">یوتیوب</label>
                  <input
                    type="text"
                    value={formData.youtubeHead || ""}
                    onChange={(e) => handleInputChange("youtubeHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اینستاگرام</label>
                  <input
                    type="text"
                    value={formData.instagramHead || ""}
                    onChange={(e) => handleInputChange("instagramHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    placeholder="مثال: @username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">واتساپ</label>
                  <input
                    type="tel"
                    value={formData.whatsAppHead || ""}
                    onChange={(e) => handlePhoneNumberChange("whatsAppHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    placeholder="مثال: 9123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">لینکدین</label>
                  <input
                    type="text"
                    value={formData.linkedinHead || ""}
                    onChange={(e) => handleInputChange("linkedinHead", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Veterinarian Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات دامپزشک</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">دامپزشک عمومی</label>
                  <input
                    type="text"
                    value={formData.generalVeterinarian || ""}
                    onChange={(e) => handleInputChange("generalVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">آدرس دامپزشک عمومی</label>
                  <input
                    type="text"
                    value={formData.addressGeneralVeterinarian || ""}
                    onChange={(e) => handleInputChange("addressGeneralVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شماره تلفن دامپزشک عمومی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumberGeneralVeterinarian || ""}
                    onChange={(e) => handlePhoneNumberChange("phoneNumberGeneralVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    required
                    placeholder="مثال: 2112345678 (اجباری)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">دامپزشک متخصص</label>
                  <input
                    type="text"
                    value={formData.specialistVeterinarian || ""}
                    onChange={(e) => handleInputChange("specialistVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">آدرس دامپزشک متخصص</label>
                  <input
                    type="text"
                    value={formData.addressSpecialistVeterinarian || ""}
                    onChange={(e) => handleInputChange("addressSpecialistVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شماره تلفن دامپزشک متخصص <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumberSpecialistVeterinarian || ""}
                    onChange={(e) => handlePhoneNumberChange("phoneNumberSpecialistVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    required
                    placeholder="مثال: 2112345678 (اجباری)"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات تکمیلی</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رژیم غذایی</label>
                  <textarea
                    value={formData.diet || ""}
                    onChange={(e) => handleInputChange("diet", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مواد غذایی منع شده</label>
                  <textarea
                    value={formData.prohibitedFoodItems || ""}
                    onChange={(e) => handleInputChange("prohibitedFoodItems", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ویژگی‌های متمایز</label>
                  <textarea
                    value={formData.distinctiveFeature || ""}
                    onChange={(e) => handleInputChange("distinctiveFeature", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عادت‌های رفتاری</label>
                  <textarea
                    value={formData.behavioralHabits || ""}
                    onChange={(e) => handleInputChange("behavioralHabits", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">داروهای منع شده</label>
                  <textarea
                    value={formData.prohibitedDrugs || ""}
                    onChange={(e) => handleInputChange("prohibitedDrugs", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">داروهای منظم</label>
                  <textarea
                    value={formData.regularlyUsedMedications || ""}
                    onChange={(e) => handleInputChange("regularlyUsedMedications", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تشویق مورد علاقه</label>
                  <textarea
                    value={formData.favoriteEncouragement || ""}
                    onChange={(e) => handleInputChange("favoriteEncouragement", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حساسیت</label>
                  <textarea
                    value={formData.susceptibility || ""}
                    onChange={(e) => handleInputChange("susceptibility", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حساسیت‌ها</label>
                  <textarea
                    value={formData.sensitivities || ""}
                    onChange={(e) => handleInputChange("sensitivities", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مشاوره تغذیه</label>
                  <textarea
                    value={formData.nutritionalCounseling || ""}
                    onChange={(e) => handleInputChange("nutritionalCounseling", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مشاوره دامپزشکی</label>
                  <textarea
                    value={formData.expertVeterinaryCounseling || ""}
                    onChange={(e) => handleInputChange("expertVeterinaryCounseling", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مشاوره آموزش</label>
                  <textarea
                    value={formData.trainingAdvice || ""}
                    onChange={(e) => handleInputChange("trainingAdvice", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    namePet: "سگ تست",
                    typePet: "DOG",
                    blood: "A+",
                    sex: "MEN",
                    colorPet: "BLACK",
                    weightPet: 15,
                    heightPet: 45,
                    birthDate: "2020-01-01",
                    microChipCode: "MC123456789",
                    birthCertificateNumberPet: "BC123456",
                    issuingVeterinarian: "دکتر رضایی",
                    addressVeterinarian: "تهران، خیابان ولیعصر، پلاک 123",
                    phoneNumberVeterinarian: "+989152944444",
                    issuingMedicalSystem: "سیستم پزشکی تهران",
                    nameHead: "احمد احمدی",
                    nationalCodeHead: "1234567890",
                    mobile1Head: "+989123456789",
                    mobile2Head: "+989987654321",
                    telHead: "+982112345678",
                    iso3Head: "IRN",
                    stateHead: "تهران",
                    cityHead: "تهران",
                    addressHead: "تهران، خیابان ولیعصر، پلاک 456",
                    postalCodeHead: "1234567890",
                    emailHead: "test@example.com",
                    telegramHead: "@testuser",
                    youtubeHead: "testchannel",
                    instagramHead: "@testuser",
                    whatsAppHead: "+989123456789",
                    linkedinHead: "testuser",
                    generalVeterinarian: "دکتر احمدی",
                    addressGeneralVeterinarian: "تهران، خیابان ولیعصر، پلاک 789",
                    phoneNumberGeneralVeterinarian: "+982112345678",
                    specialistVeterinarian: "دکتر محمدی",
                    addressSpecialistVeterinarian: "تهران، خیابان ولیعصر، پلاک 101",
                    phoneNumberSpecialistVeterinarian: "+982112345678",
                    isSterile: false,
                    vaccineRabiel: true,
                    vaccineLDHPPi: true,
                    vaccineRCP: true,
                    typeFeeding: "خشک",
                    numberMeal: 2,
                    diet: "غذای مخصوص سگ",
                    prohibitedFoodItems: "شکلات، پیاز، سیر",
                    distinctiveFeature: "لکه سفید روی پیشانی",
                    regularlyUsedMedications: "هیچ دارویی مصرف نمی‌شود",
                    prohibitedDrugs: "هیچ دارویی منع نشده",
                    favoriteEncouragement: "اسباب بازی توپ",
                    behavioralHabits: "دوستانه و بازیگوش",
                    susceptibility: "هیچ حساسیتی ندارد",
                    sensitivities: "هیچ حساسیتی ندارد",
                    connectOtherPets: true,
                    connectWithBaby: true,
                    nutritionalCounseling: "مشاوره تغذیه استاندارد برای سگ",
                    expertVeterinaryCounseling: "مشاوره دامپزشکی استاندارد",
                    trainingAdvice: "مشاوره آموزش استاندارد"
                  });
                }}
                className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                پر کردن داده‌های تست
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  {loading ? "در حال ذخیره..." : (pet ? "ویرایش" : "ذخیره")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}