"use client";
import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { Pet, createPet, updatePet, getPetById } from "@/services/api/petService";
import { uploadFile } from "@/services/api/uploadService";
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
    breedName: "",
    blood: "",
    sex: "MEN",
    birthDate: "",
    birthCertificateNumberPet: "",
    microChipCode: "",
    insuranceNumber: "",
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
  const [formSearch, setFormSearch] = useState("");
  const [selectedIdentificationImage, setSelectedIdentificationImage] = useState<File | null>(null);
  const [selectedPetImages, setSelectedPetImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [selectedCertificatePDF, setSelectedCertificatePDF] = useState<File | null>(null);
  const [selectedInsurancePDF, setSelectedInsurancePDF] = useState<File | null>(null);
  
  // File preview URLs
  const [identificationImagePreview, setIdentificationImagePreview] = useState<string | null>(null);
  const [petImagePreviews, setPetImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  // Format file size utility function
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection with preview
  const handleFileSelect = (file: File | null, type: 'identificationImage' | 'petImage' | 'video' | 'pdf', setter: (file: File | null) => void, previewSetter?: (preview: string | null) => void) => {
    if (file) {
      // File size validation
      const maxSizes = {
        identificationImage: 5 * 1024 * 1024, // 5MB
        petImage: 5 * 1024 * 1024, // 5MB
        video: 20 * 1024 * 1024, // 20MB
        pdf: 10 * 1024 * 1024 // 10MB
      };
      
      if (file.size > maxSizes[type]) {
        const maxSizeMB = maxSizes[type] / (1024 * 1024);
        showError(`حجم فایل بیش از ${maxSizeMB}MB است`);
        return;
      }
      
      // File type validation
      const validTypes = {
        identificationImage: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        petImage: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'],
        pdf: ['application/pdf']
      };
      
      if (!validTypes[type].includes(file.type)) {
        showError(`نوع فایل نامعتبر است. لطفاً فایل ${type === 'identificationImage' || type === 'petImage' ? 'تصویر' : type === 'video' ? 'ویدیو' : 'PDF'} انتخاب کنید`);
        return;
      }
    }
    
    setter(file);
    
    if (file) {
      if (type === 'identificationImage' || type === 'petImage') {
        const reader = new FileReader();
        reader.onload = (e) => previewSetter?.(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (type === 'video') {
        const reader = new FileReader();
        reader.onload = (e) => setVideoPreviews([e.target?.result as string]);
        reader.readAsDataURL(file);
      }
    } else {
      if (type === 'identificationImage' || type === 'petImage') {
        previewSetter?.(null);
      } else if (type === 'video') {
        setVideoPreviews([]);
      }
    }
  };

  // Handle multiple file selection for gallery
  const handleGalleryFileSelect = (files: FileList | null, type: 'petImage' | 'video') => {
    if (!files || files.length === 0) return;

    const maxSizes = {
      petImage: 5 * 1024 * 1024, // 5MB
      video: 20 * 1024 * 1024, // 20MB
    };

    const validTypes = {
      petImage: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'],
    };

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // File size validation
      if (file.size > maxSizes[type]) {
        const maxSizeMB = maxSizes[type] / (1024 * 1024);
        showError(`فایل ${file.name} بیش از ${maxSizeMB}MB است`);
        continue;
      }
      
      // File type validation
      if (!validTypes[type].includes(file.type)) {
        showError(`فایل ${file.name} نوع نامعتبر است`);
        continue;
      }

      newFiles.push(file);
    }

    if (type === 'petImage') {
      setSelectedPetImages(prev => [...prev, ...newFiles]);
      // Generate previews for new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPetImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    } else if (type === 'video') {
      setSelectedVideos(prev => [...prev, ...newFiles]);
      // Generate previews for new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setVideoPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove file from gallery
  const removeFileFromGallery = (index: number, type: 'petImage' | 'video') => {
    if (type === 'petImage') {
      setSelectedPetImages(prev => prev.filter((_, i) => i !== index));
      setPetImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'video') {
      setSelectedVideos(prev => prev.filter((_, i) => i !== index));
      setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Normalize digits to ASCII for backend compatibility
  const toEnglishDigits = (input: string): string => {
    if (!input) return input;
    const persian = "۰۱۲۳۴۵۶۷۸۹";
    const arabic = "٠١٢٣٤٥٦٧٨٩";
    return input
      .replace(/[۰-۹]/g, (d) => String(persian.indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String(arabic.indexOf(d)));
  };

  const defaultFormData: Partial<Pet> = {
    namePet: "",
    typePet: "DOG",
    breedName: "",
    blood: "",
    sex: "MEN",
    birthDate: "",
    birthCertificateNumberPet: "",
    microChipCode: "",
    insuranceNumber: "",
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
    trainingAdvice: "",
  };

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

    // Only add +98 if there is something left
    if (!cleaned) return "";
    // Add +98 prefix
    return `+98${cleaned}`;
  };

  // Initialize form with pet data if editing
  useEffect(() => {
    if (pet && pet.petId) {
      getPetById(pet.petId).then((data) => {
        setFormData({ ...defaultFormData, ...data });
      });
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
      const submitData: any = {
        namePet: String(formData.namePet || "سگ تست"),
        typePet: String(formData.typePet || "DOG"),
        breedName: String(formData.breedName || ""),
        blood: String(formData.blood || "A+"),
        sex: String(formData.sex || "MEN"),
        birthDate: toEnglishDigits(String(formData.birthDate || "2020-01-01")),
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

      // Upload files if selected
      if (selectedIdentificationImage) {
        try {
          const imgRes = await uploadFile(selectedIdentificationImage, false); // Public image
          submitData.identificationImageUrl = imgRes.url;
        } catch (err) {
          console.error("Identification image upload failed", err);
          showError("آپلود عکس شناسایی ناموفق بود");
          setLoading(false);
          return;
        }
      }

      // Upload multiple pet images
      if (selectedPetImages.length > 0) {
        try {
          const imageUrls = [];
          for (const image of selectedPetImages) {
            const imgRes = await uploadFile(image, false); // Public image
            imageUrls.push(imgRes.url);
          }
          submitData.imageUrls = imageUrls; // Array of image URLs
        } catch (err) {
          console.error("Pet images upload failed", err);
          showError("آپلود عکس‌های پت ناموفق بود");
          setLoading(false);
          return;
        }
      }

      // Upload multiple videos
      if (selectedVideos.length > 0) {
        try {
          const videoUrls = [];
          for (const video of selectedVideos) {
            const vidRes = await uploadFile(video, false); // Public video
            videoUrls.push(vidRes.url);
          }
          submitData.videoUrls = videoUrls; // Array of video URLs
        } catch (err) {
          console.error("Videos upload failed", err);
          showError("آپلود ویدیوها ناموفق بود");
          setLoading(false);
          return;
        }
      }

      if (selectedCertificatePDF) {
        try {
          const certRes = await uploadFile(selectedCertificatePDF, true); // Private PDF
          submitData.certificatePDF = certRes.url;
        } catch (err) {
          console.error("Certificate PDF upload failed", err);
          showError("آپلود فایل PDF شناسنامه ناموفق بود");
          setLoading(false);
          return;
        }
      }

      if (selectedInsurancePDF) {
        try {
          const insRes = await uploadFile(selectedInsurancePDF, true); // Private PDF
          submitData.insurancePDF = insRes.url;
        } catch (err) {
          console.error("Insurance PDF upload failed", err);
          showError("آپلود فایل PDF بیمه نامه ناموفق بود");
          setLoading(false);
          return;
        }
      }

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

      if (pet) {
        // Update existing pet
        await updatePet(pet.petId || "", submitData as Pet);
        showSuccess("پت با موفقیت ویرایش شد");
      } else {
        // Create new pet
        await createPet(submitData as Pet);
        showSuccess("پت با موفقیت اضافه شد");
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
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ring-3 ring-[var(--main-color)]">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {pet ? "ویرایش پت" : "افزودن پت جدید"}
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
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">مشخصات حیوان خانگی</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1"> شماره بیمه</label>
                  <input
                    type="text"
                    value={formData.insuranceNumber || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    placeholder=""
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">عکس شناسایی پت</label>
                    
                    {!selectedIdentificationImage ? (
                      <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                            📷
                          </span>
                          <div className="text-sm text-gray-600">
                            <div className="font-semibold">انتخاب عکس</div>
                            <div className="text-xs text-gray-500">حداکثر حجم پیشنهادی 5MB</div>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'identificationImage', setSelectedIdentificationImage, setIdentificationImagePreview)}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="border-2 border-[var(--main-color)]/20 rounded-xl p-3 bg-[var(--main-color)]/5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                              📷
                            </span>
                            <div className="text-sm">
                              <div className="font-semibold text-gray-900">{selectedIdentificationImage.name}</div>
                              <div className="text-xs text-gray-500">{formatFileSize(selectedIdentificationImage.size)}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileSelect(null, 'identificationImage', setSelectedIdentificationImage, setIdentificationImagePreview)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        {identificationImagePreview && (
                          <div className="mt-3">
                            <img
                              src={identificationImagePreview}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg border shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام پت *</label>
                    <input
                      type="text"
                      value={formData.namePet || ""}
                      onChange={(e) => handleInputChange("namePet", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      required
                      placeholder="نام پت را وارد کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع پت <span className="text-red-500">*</span></label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام نژاد </label>
                    <input
                      type="text"
                      value={formData.blood || ""}
                      onChange={(e) => handleInputChange("blood", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      required
                      placeholder="نام نژاد را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">جنسیت پت *</label>
                    <select
                      value={formData.sex || "MEN"}
                      onChange={(e) => handleInputChange("sex", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    >
                      <option value="MEN">نر</option>
                      <option value="WOMEN">ماده</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ تولد پت</label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={
                        formData.birthDate
                          ? new DateObject({
                            date: formData.birthDate,
                            calendar: gregorian,
                            format: "YYYY-MM-DD",
                          }).convert(persian)
                          : undefined
                      }
                      onChange={(value: any) => {
                        const dateValue = Array.isArray(value) ? value[0] : value;
                        if (!dateValue) {
                          handleInputChange("birthDate", "");
                          return;
                        }
                        const gregorianDate = (dateValue as DateObject)
                          .convert(gregorian)
                          .format("YYYY-MM-DD");
                        handleInputChange("birthDate", toEnglishDigits(gregorianDate));
                      }}
                      calendarPosition="bottom-right"
                      inputClass="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="تاریخ تولد را انتخاب کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">شماره شناسنامه پت</label>
                    <input
                      type="text"
                      value={formData.birthCertificateNumberPet || ""}
                      onChange={(e) => handleInputChange("birthCertificateNumberPet", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">کد میکروچیپ پت</label>
                    <input
                      type="text"
                      value={formData.microChipCode || ""}
                      onChange={(e) => handleInputChange("microChipCode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رنگ پت</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">ویژگی بارز ظاهری</label>
                    <textarea
                      value={formData.distinctiveFeature || ""}
                      onChange={(e) => handleInputChange("distinctiveFeature", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">وزن پت</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">قد پت</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام دامپزشک صادر کننده شناسنامه</label>
                    <input
                      type="text"
                      value={formData.issuingVeterinarian || ""}
                      onChange={(e) => handleInputChange("issuingVeterinarian", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نظام دامپزشکی صادر کننده شناسنامه</label>
                    <input
                      type="text"
                      value={formData.issuingMedicalSystem || ""}
                      onChange={(e) => handleInputChange("issuingMedicalSystem", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تلفن و آدرس دامپزشک <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={formData.phoneNumberVeterinarian || ""}
                      onChange={(e) => handlePhoneNumberChange("phoneNumberVeterinarian", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      required
                      placeholder="مثال: 9152944444 (اجباری)"
                    />
                    <input
                      type="text"
                      value={formData.addressVeterinarian || ""}
                      onChange={(e) => handleInputChange("addressVeterinarian", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="آدرس دامپزشک"
                    />
                  </div>
                </div>
              </div>


              {/* Owner Information */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">مشخصات سرپرست پت</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">موبایل(شماره ضروری اول) <span className="text-red-500">*</span></label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">موبایل( شماره ضروری دوم)</label>
                    <input
                      type="tel"
                      value={formData.mobile2Head || ""}
                      onChange={(e) => handlePhoneNumberChange("mobile2Head", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: 9987654321"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تلفن ثابت(شماره ضروری سوم)</label>
                    <input
                      type="tel"
                      value={formData.telHead || ""}
                      onChange={(e) => handlePhoneNumberChange("telHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: 2112345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">استان محل سکونت</label>
                    <input
                      type="text"
                      value={formData.stateHead || ""}
                      onChange={(e) => handleInputChange("stateHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">شهر محل سکونت</label>
                    <input
                      type="text"
                      value={formData.cityHead || ""}
                      onChange={(e) => handleInputChange("cityHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">آدرس پستی محل سکونت</label>
                    <input
                      type="text"
                      value={formData.addressHead || ""}
                      onChange={(e) => handleInputChange("addressHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">کد پستی محل سکونت</label>
                    <input
                      type="text"
                      value={formData.postalCodeHead || ""}
                      onChange={(e) => handleInputChange("postalCodeHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">آدرس ایمیل</label>
                    <input
                      type="email"
                      value={formData.emailHead || ""}
                      onChange={(e) => handleInputChange("emailHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اکانت تلگرام</label>
                    <input
                      type="text"
                      value={formData.telegramHead || ""}
                      onChange={(e) => handleInputChange("telegramHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: @username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اکانت واتساپ</label>
                    <input
                      type="tel"
                      value={formData.whatsAppHead || ""}
                      onChange={(e) => handlePhoneNumberChange("whatsAppHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: 9123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اکانت اینستگرام</label>
                    <input
                      type="text"
                      value={formData.instagramHead || ""}
                      onChange={(e) => handleInputChange("instagramHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: @username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اکانت یوتیوب</label>
                    <input
                      type="text"
                      value={formData.youtubeHead || ""}
                      onChange={(e) => handleInputChange("youtubeHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اکانت لینکدین</label>
                    <input
                      type="text"
                      value={formData.linkedinHead || ""}
                      onChange={(e) => handleInputChange("linkedinHead", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">ویژگی و اطلاعات سلامتی</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام دامپزشک عمومی</label>
                  <input
                    type="text"
                    value={formData.generalVeterinarian || ""}
                    onChange={(e) => handleInputChange("generalVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">آدرس و شماره تلفن دامپزشک عمومی</label>
                  <input
                    type="text"
                    value={formData.addressGeneralVeterinarian || ""}
                    onChange={(e) => handleInputChange("addressGeneralVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                  <input
                    type="tel"
                    value={formData.phoneNumberGeneralVeterinarian || ""}
                    onChange={(e) => handlePhoneNumberChange("phoneNumberGeneralVeterinarian", e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    required
                    placeholder="مثال: 2112345678 (اجباری)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام دامپزشک متخصص</label>
                  <input
                    type="text"
                    value={formData.specialistVeterinarian || ""}
                    onChange={(e) => handleInputChange("specialistVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">آدرس و شماره تلفن دامپزشک متخصص</label>
                  <input
                    type="text"
                    value={formData.addressSpecialistVeterinarian || ""}
                    onChange={(e) => handleInputChange("addressSpecialistVeterinarian", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                  <input
                    type="tel"
                    value={formData.phoneNumberSpecialistVeterinarian || ""}
                    onChange={(e) => handlePhoneNumberChange("phoneNumberSpecialistVeterinarian", e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    required
                    placeholder="مثال: 2112345678 (اجباری)"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">تعداد وعده های غذایی روزانه</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.numberMeal || ""}
                    onChange={(e) => handleInputChange("numberMeal", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">مواردممنوع تغذیه</label>
                  <textarea
                    value={formData.prohibitedFoodItems || ""}
                    onChange={(e) => handleInputChange("prohibitedFoodItems", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">داروهای مصرفی دائم</label>
                  <textarea
                    value={formData.regularlyUsedMedications || ""}
                    onChange={(e) => handleInputChange("regularlyUsedMedications", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">داروهای ممنوعه</label>
                  <textarea
                    value={formData.prohibitedDrugs || ""}
                    onChange={(e) => handleInputChange("prohibitedDrugs", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تشویقی مورد عالقه</label>
                  <textarea
                    value={formData.favoriteEncouragement || ""}
                    onChange={(e) => handleInputChange("favoriteEncouragement", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isSterile || false}
                    onChange={(e) => handleInputChange("isSterile", e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">پت عقیم است / نیست</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.vaccineRabiel || false}
                    onChange={(e) => handleInputChange("vaccineRabiel", e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">وضعیتواکسنRabiel</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.vaccineLDHPPi || false}
                    onChange={(e) => handleInputChange("vaccineLDHPPi", e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">وضعیت واکسنLDHPPi</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.vaccineRCP || false}
                    onChange={(e) => handleInputChange("vaccineRCP", e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">وضعیت واکسنR.C.P</span>
                </label>
              </div>
            </div>
            {/* Behavioral Information */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">اطلاعات و ویژگی های رفتاری شخصیتی</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عادت های رفتاری</label>
                  <textarea
                    value={formData.behavioralHabits || ""}
                    onChange={(e) => handleInputChange("behavioralHabits", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مهارت ها واستعدادها</label>
                  <textarea
                    value={formData.susceptibility || ""}
                    onChange={(e) => handleInputChange("susceptibility", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حساسیت ها</label>
                  <textarea
                    value={formData.sensitivities || ""}
                    onChange={(e) => handleInputChange("sensitivities", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.connectOtherPets || false}
                    onChange={(e) => handleInputChange("connectOtherPets", e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">با پت دیگری اقامت داره؟</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.connectWithBaby || false}
                    onChange={(e) => handleInputChange("connectWithBaby", e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">پت شما با کودکان ارتباط دارد؟</span>
                </label>
              </div>
            </div>

            {/* Digital Links and Documents */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">لینک و اسناد دیجیتال</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">فایل PDF شناسنامه</label>
                  
                  {!selectedCertificatePDF ? (
                    <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                          📄
                        </span>
                        <div className="text-sm text-gray-600">
                          <div className="font-semibold">انتخاب فایل PDF</div>
                          <div className="text-xs text-gray-500">فقط PDF - حداکثر 10MB</div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'pdf', setSelectedCertificatePDF)}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="border-2 border-[var(--main-color)]/20 rounded-xl p-3 bg-[var(--main-color)]/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                            📄
                          </span>
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900">{selectedCertificatePDF.name}</div>
                            <div className="text-xs text-gray-500">{formatFileSize(selectedCertificatePDF.size)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileSelect(null, 'pdf', setSelectedCertificatePDF)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                          <span className="text-lg">📄</span>
                          <span className="text-sm text-gray-600">فایل PDF شناسنامه انتخاب شده</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">فایل PDF بیمه نامه</label>
                  
                  {!selectedInsurancePDF ? (
                    <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                          📄
                        </span>
                        <div className="text-sm text-gray-600">
                          <div className="font-semibold">انتخاب فایل PDF</div>
                          <div className="text-xs text-gray-500">فقط PDF - حداکثر 10MB</div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'pdf', setSelectedInsurancePDF)}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="border-2 border-[var(--main-color)]/20 rounded-xl p-3 bg-[var(--main-color)]/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                            📄
                          </span>
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900">{selectedInsurancePDF.name}</div>
                            <div className="text-xs text-gray-500">{formatFileSize(selectedInsurancePDF.size)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileSelect(null, 'pdf', setSelectedInsurancePDF)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                          <span className="text-lg">📄</span>
                          <span className="text-sm text-gray-600">فایل PDF بیمه نامه انتخاب شده</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pet Images Gallery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عکس های پت</label>
                  
                  {/* Upload Button */}
                  <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                        📷
                      </span>
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold">انتخاب عکس‌ها</div>
                        <div className="text-xs text-gray-500">می‌توانید چندین عکس انتخاب کنید - حداکثر حجم هر عکس 5MB</div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleGalleryFileSelect(e.target.files, 'petImage')}
                      className="hidden"
                    />
                  </label>

                  {/* Gallery Display */}
                  {selectedPetImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedPetImages.map((file, index) => (
                        <div key={index} className="relative border-2 border-[var(--main-color)]/20 rounded-xl p-3 bg-[var(--main-color)]/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-600 truncate flex-1">
                              {file.name}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFileFromGallery(index, 'petImage')}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 ml-2"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          
                          {petImagePreviews[index] && (
                            <div className="aspect-square">
                              <img
                                src={petImagePreviews[index]}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border shadow-sm"
                              />
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500 mt-2">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Videos Gallery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ویدئو (ها) پت</label>
                  
                  {/* Upload Button */}
                  <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                        🎬
                      </span>
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold">انتخاب ویدیوها</div>
                        <div className="text-xs text-gray-500">می‌توانید چندین ویدیو انتخاب کنید - حداکثر حجم هر ویدیو 20MB</div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleGalleryFileSelect(e.target.files, 'video')}
                      className="hidden"
                    />
                  </label>

                  {/* Gallery Display */}
                  {selectedVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedVideos.map((file, index) => (
                        <div key={index} className="relative border-2 border-[var(--main-color)]/20 rounded-xl p-3 bg-[var(--main-color)]/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-600 truncate flex-1">
                              {file.name}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFileFromGallery(index, 'video')}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 ml-2"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          
                          {videoPreviews[index] && (
                            <div className="aspect-video">
                              <video
                                src={videoPreviews[index]}
                                className="w-full h-full object-cover rounded-lg border shadow-sm"
                                controls
                              />
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500 mt-2">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Consultations */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">مشاوره ها</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مشاوره متخصص تغذیه</label>
                  <textarea
                    value={formData.nutritionalCounseling || ""}
                    onChange={(e) => handleInputChange("nutritionalCounseling", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مشاوره دامپزشک متخصص</label>
                  <textarea
                    value={formData.expertVeterinaryCounseling || ""}
                    onChange={(e) => handleInputChange("expertVeterinaryCounseling", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مشاوره تربیت پت</label>
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
            <div className="w-full flex justify-between gap-3 pt-6 border-t">
              {/* <button
                type="button"
                onClick={() => {
                  setFormData({
                    namePet: "سگ تست",
                    typePet: "DOG",
                    breedName: "نژاد تست",
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
              </button> */}
              <div className="flex justify-end gap-3 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white rounded-lg transition-colors disabled:opacity-50"
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