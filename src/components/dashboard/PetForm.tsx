"use client";
import { useState, useEffect } from "react";
import {
  X,
  Save,
  Loader2,
  Camera,
  Video,
  FileText,
  Play,
  Download,
  Eye,
} from "lucide-react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import {
  Pet,
  createPet,
  updatePet,
  getPetById,
} from "@/services/api/petService";
import { uploadFile } from "@/services/api/uploadService";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useAuth } from "@/hooks/useAuth";
import { Controller, useForm } from "react-hook-form";

interface PetFormProps {
  pet?: Pet | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PetForm({ pet, onClose, onSuccess }: PetFormProps) {
  const { userPayload } = useAuth();

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
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Partial<Pet>>({
    defaultValues: {
      namePet: formData.namePet,
      typePet: formData.typePet ?? "DOG",
      breedName: formData.breedName ?? "",
      blood: formData.blood ?? "",
      sex: formData.sex ?? "MEN",
      birthDate: formData.birthDate ?? "",
      birthCertificateNumberPet: formData.birthCertificateNumberPet ?? "",
      microChipCode: formData.microChipCode ?? "",
      insuranceNumber: formData.insuranceNumber ?? "",
      colorPet: formData.colorPet ?? "UNKNOWN",
      distinctiveFeature: formData.distinctiveFeature ?? "",
      weightPet: formData.weightPet ?? 0,
      heightPet: formData.heightPet ?? 0,
      issuingVeterinarian: formData.issuingVeterinarian ?? "",
      addressVeterinarian: formData.addressVeterinarian ?? "",
      phoneNumberVeterinarian: formData.phoneNumberVeterinarian ?? "",
      issuingMedicalSystem: formData.issuingMedicalSystem ?? "",
      nameHead: formData.nameHead ?? "",
      nationalCodeHead: formData.nationalCodeHead ?? "",
      mobile1Head: formData.mobile1Head ?? "",
      telHead: formData.telHead ?? "",
      iso3Head: formData.iso3Head ?? "",
      stateHead: formData.stateHead ?? "",
      cityHead: formData.cityHead ?? "",
      addressHead: formData.addressHead ?? "",
      postalCodeHead: formData.postalCodeHead ?? "",
      emailHead: formData.emailHead ?? "",
      telegramHead: formData.telegramHead ?? "",
      youtubeHead: formData.youtubeHead ?? "",
      instagramHead: formData.instagramHead ?? "",
      whatsAppHead: formData.whatsAppHead ?? "",
      linkedinHead: formData.linkedinHead ?? "",
      generalVeterinarian: formData.generalVeterinarian ?? "",
      addressGeneralVeterinarian: formData.addressGeneralVeterinarian ?? "",
      phoneNumberGeneralVeterinarian:
        formData.phoneNumberGeneralVeterinarian ?? "",
      isSterile: formData.isSterile ?? false,
      vaccineRabiel: formData.vaccineRabiel ?? false,
      vaccineLDHPPi: formData.vaccineLDHPPi ?? false,
      vaccineRCP: formData.vaccineRCP ?? false,
      typeFeeding: formData.typeFeeding ?? "",
      numberMeal: formData.numberMeal ?? 0,
      diet: formData.diet ?? "",
      prohibitedFoodItems: formData.prohibitedFoodItems ?? "",
      regularlyUsedMedications: formData.regularlyUsedMedications ?? "",
      prohibitedDrugs: formData.prohibitedDrugs ?? "",
      favoriteEncouragement: formData.favoriteEncouragement ?? "",
      behavioralHabits: formData.behavioralHabits ?? "",
      susceptibility: formData.susceptibility ?? "",
      sensitivities: formData.sensitivities ?? "",
      connectOtherPets: formData.connectOtherPets ?? false,
      connectWithBaby: formData.connectWithBaby ?? false,
      nutritionalCounseling: formData.nutritionalCounseling ?? "",
      expertVeterinaryCounseling: formData.expertVeterinaryCounseling ?? "",
      trainingAdvice: formData.trainingAdvice ?? "",
    },
  });

  // Initialize form with pet data if editing
  useEffect(() => {
    if (pet && pet.petId) {
      getPetById(pet.petId).then((data) => {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
        // Load existing pet media
        if (data.photoPet) {
          setExistingPetPhoto(data.photoPet);
        }
        if (data.galleriesPhoto && data.galleriesPhoto.length > 0) {
          setExistingPetImages(data.galleriesPhoto);
        }
        if (data.galleriesVideo && data.galleriesVideo.length > 0) {
          setExistingPetVideos(data.galleriesVideo);
        }
        if (data.certificatePdfPet) {
          setExistingCertificatePDF(data.certificatePdfPet);
        }
        if (data.insurancePdfPet) {
          setExistingInsurancePDF(data.insurancePdfPet);
        }
        // This is the key fix: reset the form with the fetched data
        reset(data); // 🎯 Pass the fetched data directly to reset()
      });
    } else {
      // If no pet is being edited, reset to default empty values
      reset({});
    }
  }, [pet, reset]);

  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useSnackbar();
  const [formSearch, setFormSearch] = useState("");
  const [selectedIdentificationImage, setSelectedIdentificationImage] =
    useState<File | null>(null);
  const [selectedPetImages, setSelectedPetImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [selectedCertificatePDF, setSelectedCertificatePDF] =
    useState<File | null>(null);
  const [selectedInsurancePDF, setSelectedInsurancePDF] = useState<File | null>(
    null
  );

  // File preview URLs
  const [identificationImagePreview, setIdentificationImagePreview] = useState<
    string | null
  >(null);
  const [petImagePreviews, setPetImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  // Existing pet media from database
  const [existingPetPhoto, setExistingPetPhoto] = useState<string | null>(null);
  const [existingPetImages, setExistingPetImages] = useState<string[]>([]);
  const [existingPetVideos, setExistingPetVideos] = useState<string[]>([]);
  const [existingCertificatePDF, setExistingCertificatePDF] = useState<
    string | null
  >(null);
  const [existingInsurancePDF, setExistingInsurancePDF] = useState<
    string | null
  >(null);

  const uploadMultipleFiles = async (
    files: File[],
    isPrivate: boolean = false,
    fileType: string
  ): Promise<string[]> => {
    const fileIds: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadResult = await uploadFile(file, isPrivate);
        fileIds.push(uploadResult.fileId);
      } catch (error) {
        console.error(`❌ Failed to upload ${fileType} ${i + 1}:`, error);
        throw error; // Re-throw to stop the process
      }
    }

    return fileIds;
  };

  // Format file size utility function
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle file selection with preview
  const handleFileSelect = (
    file: File | null,
    type: "identificationImage" | "petImage" | "video" | "pdf",
    setter: (file: File | null) => void,
    previewSetter?: (preview: string | null) => void
  ) => {
    if (file) {
      // File size validation
      const maxSizes = {
        identificationImage: 5 * 1024 * 1024, // 5MB
        petImage: 5 * 1024 * 1024, // 5MB
        video: 20 * 1024 * 1024, // 20MB
        pdf: 10 * 1024 * 1024, // 10MB
      };

      if (file.size > maxSizes[type]) {
        const maxSizeMB = maxSizes[type] / (1024 * 1024);
        showError(`حجم فایل بیش از ${maxSizeMB}MB است`);
        return;
      }

      // File type validation
      const validTypes = {
        identificationImage: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ],
        petImage: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ],
        video: [
          "video/mp4",
          "video/avi",
          "video/mov",
          "video/wmv",
          "video/flv",
        ],
        pdf: ["application/pdf"],
      };

      if (!validTypes[type].includes(file.type)) {
        showError(
          `نوع فایل نامعتبر است. لطفاً فایل ${
            type === "identificationImage" || type === "petImage"
              ? "تصویر"
              : type === "video"
              ? "ویدیو"
              : "PDF"
          } انتخاب کنید`
        );
        return;
      }
    }

    setter(file);

    if (file) {
      if (type === "identificationImage" || type === "petImage") {
        const reader = new FileReader();
        reader.onload = (e) => previewSetter?.(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (type === "video") {
        const reader = new FileReader();
        reader.onload = (e) => setVideoPreviews([e.target?.result as string]);
        reader.readAsDataURL(file);
      }
    } else {
      if (type === "identificationImage" || type === "petImage") {
        previewSetter?.(null);
      } else if (type === "video") {
        setVideoPreviews([]);
      }
    }
  };

  // Handle multiple file selection for gallery
  const handleGalleryFileSelect = (
    files: FileList | null,
    type: "petImage" | "video"
  ) => {
    if (!files || files.length === 0) return;

    const maxSizes = {
      petImage: 5 * 1024 * 1024, // 5MB
      video: 20 * 1024 * 1024, // 20MB
    };

    const validTypes = {
      petImage: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      video: ["video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv"],
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

    if (type === "petImage") {
      setSelectedPetImages((prev) => [...prev, ...newFiles]);
      // Generate previews for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPetImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    } else if (type === "video") {
      setSelectedVideos((prev) => [...prev, ...newFiles]);
      // Generate previews for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setVideoPreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove file from gallery
  const removeFileFromGallery = (index: number, type: "petImage" | "video") => {
    if (type === "petImage") {
      setSelectedPetImages((prev) => prev.filter((_, i) => i !== index));
      setPetImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "video") {
      setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
      setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Remove existing media (for replacement)
  const removeExistingMedia = (
    type: "photo" | "images" | "videos" | "certificate" | "insurance"
  ) => {
    switch (type) {
      case "photo":
        setExistingPetPhoto(null);
        break;
      case "images":
        setExistingPetImages([]);
        break;
      case "videos":
        setExistingPetVideos([]);
        break;
      case "certificate":
        setExistingCertificatePDF(null);
        break;
      case "insurance":
        setExistingInsurancePDF(null);
        break;
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

  const handleInputChange = (field: keyof Pet, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle phone number input changes with formatting
  const handlePhoneNumberChange = (field: keyof Pet, value: string) => {
    const formattedNumber = formatPhoneNumber(value);
    setFormData((prev) => ({
      ...prev,
      [field]: formattedNumber,
    }));
  };

  const validateRequiredFields = (data: Partial<Pet>) => {
    const requiredStringFields = [
      "namePet",
      "typePet",
      "typeFeeding",
      "phoneNumberVeterinarian",
      "mobile1Head",
      "phoneNumberGeneralVeterinarian",
      // Removed microchip and other optional fields
    ];

    const missingFields = requiredStringFields.filter(
      (field) =>
        !data[field as keyof Pet] ||
        String(data[field as keyof Pet]).trim() === ""
    );

    return missingFields;
  };

  const updateField = (field: keyof Pet, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function cleanData<T extends Record<string, any>>(data: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([_, value]) => {
          if (typeof value === "string") {
            return value.trim() !== ""; // ❌ only remove empty strings
          }
          if (value === null || value === undefined) return false;
          return true; // keep everything else
        })
        .map(([key, value]) => {
          // if (typeof value === "string") {
          //   return [key, value.trim()]; // keep trimmed version
          // }
          return [key, value];
        })
    );
  }

  const onSubmit = async (data: Pet) => {
    console.log("STEP 1: handleSubmit triggered");

    console.log(data);

    setFormData(data);

    // console.log("form data", formData);

    if (loading) {
      // console.log("STEP 2: Already loading, exit");
      return;
    }

    setLoading(true);
    // console.log("STEP 3: Loading set true");

    try {
      // console.log("STEP 4: Preparing submitData");
      // Build raw object first
      const rawData: any = {
        namePet: String(formData.namePet),
        typePet: String(formData.typePet),
        breedName: String(formData.breedName),
        blood: String(formData.blood ?? ""),
        sex: String(formData.sex),
        birthDate: toEnglishDigits(String(formData.birthDate)),
        birthCertificateNumberPet: String(formData.birthCertificateNumberPet),
        microChipCode: String(formData.microChipCode),
        colorPet: String(formData.colorPet),
        distinctiveFeature: String(formData.distinctiveFeature),
        weightPet: Number(formData.weightPet),
        heightPet: Number(formData.heightPet),
        insuranceNumber: String(formData.insuranceNumber),
        issuingVeterinarian: String(formData.issuingVeterinarian),
        addressVeterinarian: String(formData.addressVeterinarian),
        phoneNumberVeterinarian: formatPhoneNumber(
          formData.phoneNumberVeterinarian ?? ""
        ),
        issuingMedicalSystem: String(formData.issuingMedicalSystem),
        nameHead: String(formData.nameHead),
        nationalCodeHead: String(formData.nationalCodeHead),
        mobile1Head: formatPhoneNumber(formData.mobile1Head ?? ""),
        telHead: formatPhoneNumber(formData.telHead ?? ""),
        iso3Head: String(formData.iso3Head || "IRN"),
        stateHead: String(formData.stateHead),
        cityHead: String(formData.cityHead),
        addressHead: String(formData.addressHead),
        postalCodeHead: String(formData.postalCodeHead),
        emailHead: String(formData.emailHead),
        telegramHead: String(formData.telegramHead),
        youtubeHead: String(formData.youtubeHead ?? ""),
        instagramHead: String(formData.instagramHead ?? ""),
        whatsAppHead: formatPhoneNumber(formData.whatsAppHead ?? ""),
        linkedinHead: String(formData.linkedinHead ?? ""),
        generalVeterinarian: String(formData.generalVeterinarian ?? ""),
        addressGeneralVeterinarian: String(
          formData.addressGeneralVeterinarian ?? ""
        ),
        phoneNumberGeneralVeterinarian: formatPhoneNumber(
          formData.phoneNumberGeneralVeterinarian ?? ""
        ),
        isSterile: Boolean(formData.isSterile),
        vaccineRabiel: Boolean(formData.vaccineRabiel),
        vaccineLDHPPi: Boolean(formData.vaccineLDHPPi),
        vaccineRCP: Boolean(formData.vaccineRCP),
        typeFeeding: String(formData.typeFeeding),
        numberMeal: Number(formData.numberMeal),
        diet: String(formData.diet),
        prohibitedFoodItems: String(formData.prohibitedFoodItems),
        regularlyUsedMedications: String(formData.regularlyUsedMedications),
        prohibitedDrugs: String(formData.prohibitedDrugs),
        favoriteEncouragement: String(formData.favoriteEncouragement),
        behavioralHabits: String(formData.behavioralHabits),
        susceptibility: String(formData.susceptibility),
        sensitivities: String(formData.sensitivities),
        connectOtherPets: Boolean(formData.connectOtherPets),
        connectWithBaby: Boolean(formData.connectWithBaby),
        nutritionalCounseling: String(formData.nutritionalCounseling),
        expertVeterinaryCounseling: String(formData.expertVeterinaryCounseling),
        trainingAdvice: String(formData.trainingAdvice),
      };

      // Filter out empty values
      const submitData = data;

      console.log("STEP 5: submitData prepared", submitData);

      if (selectedIdentificationImage) {
        console.log("STEP 6: Uploading identification image");
        try {
          const imgRes = await uploadFile(selectedIdentificationImage, false);
          submitData.photoPet = imgRes.fileId;
          // console.log("STEP 7: Identification image uploaded");
        } catch (err) {
          // console.log("STEP 8: Identification image upload failed");
          setLoading(false);
          return;
        }
      } else if (existingPetPhoto) {
        console.log("STEP 9: Using existingPetPhoto");
        console.log(existingPetPhoto);
        // submitData.photoPet = existingPetPhoto;
      } else if (pet && pet.photoPet) {
        // console.log("STEP 10: Using pet.photoPet");
        submitData.photoPet = pet.photoPet;
      }

      if (selectedPetImages.length > 0) {
        // console.log("STEP 11: Uploading multiple pet images");
        try {
          const imageFileIds = await uploadMultipleFiles(
            selectedPetImages,
            false,
            "pet image"
          );
          console.log(imageFileIds);
          submitData.galleryPhoto = imageFileIds;
          // console.log("STEP 12: Pet images uploaded");
        } catch (err) {
          // console.log("STEP 13: Pet images upload failed");
          setLoading(false);
          return;
        }
      } else if (existingPetImages.length > 0) {
        // console.log("STEP 14: Using existingPetImages");
        submitData.galleryPhoto = existingPetImages;
        //@ts-ignore
      } else if (pet && pet.galleriesPhoto?.length > 0) {
        // console.log("STEP 15: Using pet.galleriesPhoto");
        submitData.galleryPhoto = pet.galleriesPhoto;
      } else {
        // console.log("STEP 16: No pet images, empty array");
        submitData.galleryPhoto = [];
      }

      if (selectedVideos.length > 0) {
        // console.log("STEP 17: Uploading videos");
        try {
          const videoFileIds = await uploadMultipleFiles(
            selectedVideos,
            false,
            "video"
          );
          submitData.galleryVideo = videoFileIds;
          // console.log("STEP 18: Videos uploaded");
        } catch (err) {
          // console.log("STEP 19: Videos upload failed");
          setLoading(false);
          return;
        }
      } else if (existingPetVideos.length > 0) {
        // console.log("STEP 20: Using existingPetVideos");
        submitData.galleryVideo = existingPetVideos;
        // @ts-ignore
      } else if (pet && pet.galleriesVideo?.length > 0) {
        // console.log("STEP 21: Using pet.galleriesVideo");
        submitData.galleryVideo = pet.galleriesVideo;
      } else {
        // console.log("STEP 22: No videos, empty array");
        submitData.galleryVideo = [];
      }

      if (selectedCertificatePDF) {
        // console.log("STEP 23: Uploading certificate PDF");
        try {
          const certRes = await uploadFile(selectedCertificatePDF, true);
          submitData.certificatePdfPet = certRes.fileId;
          // console.log("STEP 24: Certificate PDF uploaded");
        } catch (err) {
          // console.log("STEP 25: Certificate PDF upload failed");
          setLoading(false);
          return;
        }
      } else if (existingCertificatePDF) {
        // console.log("STEP 26: Using existingCertificatePDF");
        submitData.certificatePdfPet = existingCertificatePDF;
      } else if (pet && pet.certificatePdfPet) {
        // console.log("STEP 27: Using pet.certificatePdfPet");
        submitData.certificatePdfPet = pet.certificatePdfPet;
      }

      if (selectedInsurancePDF) {
        // console.log("STEP 28: Uploading insurance PDF");
        try {
          const insRes = await uploadFile(selectedInsurancePDF, true);
          submitData.insurancePdfPet = insRes.fileId;
          // console.log("STEP 29: Insurance PDF uploaded");
        } catch (err) {
          // console.log("STEP 30: Insurance PDF upload failed");
          setLoading(false);
          return;
        }
      } else if (existingInsurancePDF) {
        // console.log("STEP 31: Using existingInsurancePDF");
        submitData.insurancePdfPet = existingInsurancePDF;
      } else if (pet && pet.insurancePdfPet) {
        // console.log("STEP 32: Using pet.insurancePdfPet");
        submitData.insurancePdfPet = pet.insurancePdfPet;
      }

      // console.log("STEP 33: Checking critical fields");
      const criticalFields = [
        "typePet",
        "phoneNumberVeterinarian",
        "mobile1Head",
        "phoneNumberGeneralVeterinarian",
      ];

      for (const field of criticalFields) {
        //@ts-expect-error
        const value = submitData[field as keyof typeof submitData];
        if (
          !value ||
          value === "" ||
          value === "undefined" ||
          value === "null"
        ) {
          // console.log("STEP 34: Missing critical field", field);
          setLoading(false);
          return;
        }
      }

      if (pet) {
        // console.log("STEP 35: Updating pet");
        const isAdmin = role === "admin";
        await updatePet(pet.petId || "", submitData as unknown as Pet, isAdmin);
      } else {
        // console.log("STEP 36: Creating pet");
        await createPet(submitData as unknown as Pet);
      }

      // console.log("STEP 37: onSuccess()");
      onSuccess();
    } catch (error: any) {
      // console.log("STEP 38: Caught error in try/catch");
      setLoading(false);
    } finally {
      // console.log("STEP 39: Finally block, setLoading(false)");
      setLoading(false);
    }
  };

  // const onSubmit = (data: FormData) => {
  //   console.log("Form Submitted ✅", data);
  // };

  const [role, setRole] = useState("");

  useEffect(() => {
    //@ts-ignore
    setRole(localStorage.getItem("role"));
  }, []);

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
          {/* @ts-expect-error */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Pet Profile Display Section */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4 flex items-center gap-2">
                <Camera size={20} />
                {pet ? "پروفایل فعلی پت" : "آپلود رسانه‌های پت"}
              </h3>
              {/* Pet Info Summary when editing */}
              {pet && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    📋 اطلاعات کلی پت
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">نام:</span>
                      <span className="font-medium text-gray-900 mr-2">
                        {pet.namePet || "نامشخص"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">نوع:</span>
                      <span className="font-medium text-gray-900 mr-2">
                        {pet.typePet === "DOG"
                          ? "سگ"
                          : pet.typePet === "CAT"
                          ? "گربه"
                          : pet.typePet}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">جنسیت:</span>
                      <span className="font-medium text-gray-900 mr-2">
                        {pet.sex === "MEN"
                          ? "نر"
                          : pet.sex === "WOMEN"
                          ? "ماده"
                          : "نامشخص"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">رنگ:</span>
                      <span className="font-medium text-gray-900 mr-2">
                        {pet.colorPet !== "UNKNOWN" ? pet.colorPet : "نامشخص"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {existingPetPhoto ||
              existingPetImages.length > 0 ||
              existingPetVideos.length > 0 ||
              existingCertificatePDF ||
              existingInsurancePDF ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Main Pet Photo */}
                  {existingPetPhoto && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Camera size={16} />
                        عکس اصلی پت
                      </h4>
                      <div className="relative group">
                        <img
                          src={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${existingPetPhoto}`}
                          alt="Pet Photo"
                          className="w-full h-32 object-cover rounded-lg border shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex gap-2">
                            <a
                              href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${existingPetPhoto}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                              title="مشاهده"
                            >
                              <Eye size={16} className="text-white" />
                            </a>
                            <a
                              href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${existingPetPhoto}`}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                              title="دانلود"
                            >
                              <Download size={16} className="text-white" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            removeExistingMedia("photo");
                            setValue("photoPet", "", { shouldValidate: true });
                          }}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <X size={14} />
                          حذف عکس
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        برای تغییر، عکس جدید انتخاب کنید
                      </p>
                    </div>
                  )}
                  {/* Pet Images Gallery */}
                  {existingPetImages.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Camera size={16} />
                        گالری عکس‌ها ({existingPetImages.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {existingPetImages.slice(0, 4).map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${photo}`}
                              alt={`Pet Photo ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <div className="flex gap-1">
                                <a
                                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${photo}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                                  title="مشاهده"
                                >
                                  <Eye size={12} className="text-white" />
                                </a>
                                <a
                                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${photo}`}
                                  className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                                  title="دانلود"
                                >
                                  <Download size={12} className="text-white" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                        {existingPetImages.length > 4 && (
                          <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                            <span className="text-xs text-gray-500">
                              +{existingPetImages.length - 4} عکس دیگر
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => removeExistingMedia("images")}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <X size={14} />
                          حذف همه عکس‌ها
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        برای تغییر، عکس‌های جدید انتخاب کنید
                      </p>
                    </div>
                  )}
                  {/* Pet Videos */}
                  {existingPetVideos.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Video size={16} />
                        ویدیوها ({existingPetVideos.length})
                      </h4>
                      <div className="space-y-2">
                        {existingPetVideos.slice(0, 2).map((video, index) => (
                          <div key={index} className="relative group">
                            <video
                              src={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${video}`}
                              className="w-full h-20 object-cover rounded-lg border shadow-sm"
                              controls
                            />
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <a
                                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${video}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                  title="مشاهده"
                                >
                                  <Eye size={12} />
                                </a>
                                <a
                                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${video}`}
                                  className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                  title="دانلود"
                                >
                                  <Download size={12} />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                        {existingPetVideos.length > 2 && (
                          <div className="text-center py-2 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                            <span className="text-xs text-gray-500">
                              +{existingPetVideos.length - 2} ویدیوی دیگر
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => removeExistingMedia("videos")}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <X size={14} />
                          حذف همه ویدیوها
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        برای تغییر، ویدیوهای جدید انتخاب کنید
                      </p>
                    </div>
                  )}
                  {/* Certificate PDF */}
                  {existingCertificatePDF && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FileText size={16} />
                        شناسنامه پت
                      </h4>
                      <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                        <FileText size={24} className="text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            فایل PDF شناسنامه
                          </p>
                          <p className="text-xs text-gray-500">
                            برای تغییر، فایل جدید انتخاب کنید
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${existingCertificatePDF}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Eye size={14} />
                          مشاهده
                        </a>
                        <a
                          href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${existingCertificatePDF}`}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Download size={14} />
                          دانلود
                        </a>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => removeExistingMedia("certificate")}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <X size={14} />
                          حذف فایل
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Insurance PDF */}
                  {existingInsurancePDF && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FileText size={16} />
                        بیمه نامه پت
                      </h4>
                      <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                        <FileText size={24} className="text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            فایل PDF بیمه نامه
                          </p>
                          <p className="text-xs text-gray-500">
                            برای تغییر، فایل جدید انتخاب کنید
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${existingInsurancePDF}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Eye size={14} />
                          مشاهده
                        </a>
                        <a
                          href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/download/${existingInsurancePDF}`}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Download size={14} />
                          دانلود
                        </a>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => removeExistingMedia("insurance")}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <X size={14} />
                          حذف فایل
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[var(--main-color)]/10 rounded-full flex items-center justify-center">
                      <Camera size={24} className="text-[var(--main-color)]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {pet ? "هنوز رسانه‌ای آپلود نشده" : "شروع کنید"}
                      </h4>
                      <p className="text-gray-500">
                        {pet
                          ? "برای شروع، عکس اصلی پت، گالری عکس‌ها، ویدیوها و اسناد را آپلود کنید"
                          : "برای شروع، عکس اصلی پت، گالری عکس‌ها، ویدیوها و اسناد را آپلود کنید"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Current Form Data Summary when editing */}
            {pet && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-md font-medium text-blue-700 mb-3 flex items-center gap-2">
                  📝 اطلاعات فرم فعلی
                </h4>
                <p className="text-sm text-blue-600">
                  در حال ویرایش اطلاعات پت "{pet.namePet || "نامشخص"}" هستید.
                  تغییرات خود را در فیلدهای زیر اعمال کنید.
                </p>
              </div>
            )}
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">
                  مشخصات حیوان خانگی
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    شماره بیمه
                  </label>
                  <input
                    type="text"
                    readOnly={role === "user"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    {...register("insuranceNumber")}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عکس شناسایی پت
                    </label>
                    {!selectedIdentificationImage ? (
                      <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                            📷
                          </span>
                          <div className="text-sm text-gray-600">
                            <div className="font-semibold">انتخاب عکس</div>
                            <div className="text-xs text-gray-500">
                              حداکثر حجم پیشنهادی 5MB
                            </div>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept=".jpg"
                          onChange={(e) =>
                            handleFileSelect(
                              e.target.files?.[0] || null,
                              "identificationImage",
                              setSelectedIdentificationImage,
                              setIdentificationImagePreview
                            )
                          }
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
                              <div className="font-semibold text-gray-900">
                                {selectedIdentificationImage.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatFileSize(
                                  selectedIdentificationImage.size
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleFileSelect(
                                null,
                                "identificationImage",
                                setSelectedIdentificationImage,
                                setIdentificationImagePreview
                              )
                            }
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام پت <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="نام پت را وارد کنید"
                      {...register("namePet", { required: true })}
                    />
                    {errors.namePet && (
                      <p className="mt-1 text-sm text-red-500">
                        نام پت اجباری است
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع پت <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("typePet", { required: true })}
                    >
                      <option value="DOG">سگ</option>
                      <option value="CAT">گربه</option>
                    </select>
                    {errors.typePet && (
                      <p className="mt-1 text-sm text-red-500">
                        نوع پت اجباری است
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام نژاد <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="نام نژاد را وارد کنید"
                      {...register("blood", { required: true })}
                    />
                    {errors.blood && (
                      <p className="mt-1 text-sm text-red-500">
                        نام نژاد اجباری است
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      جنسیت پت <span className="text-red-600">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("sex", { required: true })}
                    >
                      <option value="MEN">نر</option>
                      <option value="WOMEN">ماده</option>
                    </select>
                    {errors.sex && (
                      <p className="mt-1 text-sm text-red-500">
                        جنسیت پت اجباری است
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاریخ تولد پت <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="birthDate"
                      render={({ field }) => (
                        <DatePicker
                          required
                          calendar={persian}
                          locale={persian_fa}
                          value={
                            field.value
                              ? new DateObject({
                                  date: field.value,
                                  calendar: gregorian,
                                  format: "YYYY-MM-DD",
                                }).convert(persian)
                              : undefined
                          }
                          onChange={(value: any) => {
                            const dateValue = Array.isArray(value)
                              ? value[0]
                              : value;
                            if (!dateValue) {
                              field.onChange("");
                              return;
                            }
                            const gregorianDate = (dateValue as DateObject)
                              .convert(gregorian)
                              .format("YYYY-MM-DD");
                            field.onChange(toEnglishDigits(gregorianDate));
                          }}
                          calendarPosition="bottom-right"
                          inputClass="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="تاریخ تولد را انتخاب کنید"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شماره شناسنامه پت
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("birthCertificateNumberPet")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      کد میکروچیپ پت
                    </label>
                    <input
                      type="text"
                      placeholder="اختیاری"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("microChipCode")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رنگ پت
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("colorPet")}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ویژگی بارز ظاهری
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("distinctiveFeature")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وزن پت <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("weightPet", {
                        valueAsNumber: true,
                        required: "وزن پت اجباری است!",
                      })}
                    />
                    {errors.weightPet && (
                      <p className="mt-1 text-sm text-red-500">
                        {/* @ts-ignore */}
                        {errors.weightPet.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      قد پت <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("heightPet", {
                        valueAsNumber: true,
                        required: "قد پت اجباری است!",
                      })}
                    />
                    {errors.heightPet && (
                      <p className="mt-1 text-sm text-red-500">
                        {/* @ts-ignore */}
                        {errors.heightPet.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام دامپزشک صادر کننده شناسنامه
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("issuingVeterinarian")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نظام دامپزشکی صادر کننده شناسنامه
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("issuingMedicalSystem")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تلفن و آدرس دامپزشک{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      minLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: 9152944444 (اجباری)"
                      {...register("phoneNumberVeterinarian", {
                        required: true,
                        validate: (value) =>
                          //@ts-ignore
                          /^(\d{10,}|\+\d{10,})$/.test(value) ||
                          "شماره تلفن معتبر نیست",
                      })}
                      onChange={(e) =>
                        handlePhoneNumberChange(
                          "phoneNumberVeterinarian",
                          e.target.value
                        )
                      }
                    />
                    {errors.phoneNumberVeterinarian && (
                      <p className="mt-1 text-sm text-red-500">
                        {/* @ts-ignore */}
                        {errors.phoneNumberVeterinarian.message ||
                          "تلفن دامپزشک اجباری است"}
                      </p>
                    )}
                    <input
                      type="text"
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="آدرس دامپزشک"
                      {...register("addressVeterinarian")}
                    />
                  </div>
                </div>
              </div>
              {/* Owner Information */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">
                  مشخصات سرپرست پت
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("nameHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      کد ملی
                    </label>
                    <input
                      type="text"
                      minLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("nationalCodeHead", {
                        minLength: {
                          value: 10,
                          message: "کد ملی باید 10 رقمی باشد",
                        },
                        maxLength: {
                          value: 10,
                          message: "کد ملی باید 10 رقمی باشد",
                        },
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      موبایل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      minLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: 9123456789 (اجباری)"
                      {...register("mobile1Head", {
                        required: true,
                        validate: (value) =>
                          //@ts-ignore
                          /^(\d{10,}|\+\d{10,})$/.test(value) ||
                          "شماره موبایل معتبر نیست",
                      })}
                      onChange={(e) =>
                        handlePhoneNumberChange("mobile1Head", e.target.value)
                      }
                    />
                    {errors.mobile1Head && (
                      <p className="mt-1 text-sm text-red-500">
                        {/* @ts-ignore */}
                        {errors.mobile1Head.message || "موبایل اجباری است"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تلفن ثابت
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: 2112345678"
                      {...register("telHead")}
                      onChange={(e) =>
                        handlePhoneNumberChange("telHead", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      استان محل سکونت
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("stateHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شهر محل سکونت
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("cityHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آدرس پستی محل سکونت
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("addressHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      کد پستی محل سکونت
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("postalCodeHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آدرس ایمیل
                    </label>
                    <input
                      type="email"
                      placeholder="ایمیل اختیاری"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("emailHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اکانت تلگرام
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: @username (اختیاری)"
                      {...register("telegramHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اکانت واتساپ
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="مثال: 9123456789 (اختیاری)"
                      {...register("whatsAppHead")}
                      onChange={(e) =>
                        handlePhoneNumberChange("whatsAppHead", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اکانت اینستگرام
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      placeholder="اختیاری"
                      {...register("instagramHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اکانت یوتیوب
                    </label>
                    <input
                      placeholder="اختیاری"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("youtubeHead")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اکانت لینکدین
                    </label>
                    <input
                      placeholder="اختیاری"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("linkedinHead")}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Health Information */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">
                ویژگی و اطلاعات سلامتی
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام دامپزشک{" "}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("generalVeterinarian")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آدرس و شماره تلفن دامپزشک
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("addressGeneralVeterinarian")}
                  />
                  <input
                    type="tel"
                    minLength={10}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    placeholder="مثال: 2112345678 (اجباری)"
                    {...register("phoneNumberGeneralVeterinarian", {
                      required: true,
                    })}
                  />
                  {errors.phoneNumberGeneralVeterinarian && (
                    <p className="mt-1 text-sm text-red-500">
                      شماره تلفن دامپزشک اجباری است
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع تغذیه <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("typeFeeding", { required: true })}
                  />
                  {errors.typeFeeding && (
                    <p className="mt-1 text-sm text-red-500">
                      نوع تغذیه اجباری است
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تعداد وعده های غذایی روزانه{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("numberMeal", {
                      valueAsNumber: true,
                      required: "تعداد وعده های غذایی روزانه اجباری است!",
                    })}
                  />
                  {errors.numberMeal && (
                    <p className="mt-1 text-sm text-red-500">
                      {/* @ts-ignore */}
                      {errors.numberMeal.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رژیم غذایی
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("diet")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مواردممنوع تغذیه
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("prohibitedFoodItems")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    داروهای مصرفی دائم
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("regularlyUsedMedications")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    داروهای ممنوعه
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("prohibitedDrugs")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تشویقی مورد علاقه
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("favoriteEncouragement")}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...register("isSterile")}
                  />
                  <span className="text-sm text-gray-700">پت عقیم است</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...register("vaccineRabiel")}
                  />
                  <span className="text-sm text-gray-700">
                    وضعیت واکسن Rabiel{" "}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...register("vaccineLDHPPi")}
                  />
                  <span className="text-sm text-gray-700">
                    وضعیت واکسنLDHPPi
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...register("vaccineRCP")}
                  />
                  <span className="text-sm text-gray-700">
                    وضعیت واکسنR.C.P
                  </span>
                </label>
              </div>
            </div>
            {/* Behavioral Information */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">
                اطلاعات و ویژگی های رفتاری شخصیتی
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عادت های رفتاری
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("behavioralHabits")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مهارت ها واستعدادها
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("susceptibility")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    حساسیت ها
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                    {...register("sensitivities")}
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...register("connectOtherPets")}
                  />
                  <span className="text-sm text-gray-700">
                    با پت دیگری اقامت دارد
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...register("connectWithBaby")}
                  />
                  <span className="text-sm text-gray-700">
                    پت شما با کودکان ارتباط دارد
                  </span>
                </label>
              </div>
            </div>
            {/* Digital Links and Documents */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">
                لینک و اسناد دیجیتال
              </h3>
              {/* Media Upload Help */}
              {/*               <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  💡 <strong>نکته:</strong> برای تغییر رسانه‌های موجود، ابتدا
                  آنها را از بخش "پروفایل فعلی پت" حذف کنید، سپس فایل‌های جدید
                  را انتخاب کنید. فایل‌های جدید جایگزین فایل‌های قبلی خواهند شد.
                </p> 
              </div> */}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    فایل PDF شناسنامه
                  </label>
                  {!selectedCertificatePDF ? (
                    <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                          📄
                        </span>
                        <div className="text-sm text-gray-600">
                          <div className="font-semibold">انتخاب فایل PDF</div>
                          <div className="text-xs text-gray-500">
                            فقط PDF - حداکثر 10MB
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          handleFileSelect(
                            e.target.files?.[0] || null,
                            "pdf",
                            setSelectedCertificatePDF
                          )
                        }
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
                            <div className="font-semibold text-gray-900">
                              {selectedCertificatePDF.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(selectedCertificatePDF.size)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleFileSelect(
                              null,
                              "pdf",
                              setSelectedCertificatePDF
                            )
                          }
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                          <span className="text-lg">📄</span>
                          <span className="text-sm text-gray-600">
                            فایل PDF شناسنامه انتخاب شده
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    فایل PDF بیمه نامه
                  </label>
                  {!selectedInsurancePDF ? (
                    <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                          📄
                        </span>
                        <div className="text-sm text-gray-600">
                          <div className="font-semibold">انتخاب فایل PDF</div>
                          <div className="text-xs text-gray-500">
                            فقط PDF - حداکثر 10MB
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          handleFileSelect(
                            e.target.files?.[0] || null,
                            "pdf",
                            setSelectedInsurancePDF
                          )
                        }
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
                            <div className="font-semibold text-gray-900">
                              {selectedInsurancePDF.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(selectedInsurancePDF.size)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleFileSelect(
                              null,
                              "pdf",
                              setSelectedInsurancePDF
                            )
                          }
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                          <span className="text-lg">📄</span>
                          <span className="text-sm text-gray-600">
                            فایل PDF بیمه نامه انتخاب شده
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Pet Images Gallery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عکس های پت
                  </label>
                  {/* Upload Button */}
                  <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                        📷
                      </span>
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold">انتخاب عکس‌ها</div>
                        <div className="text-xs text-gray-500">
                          می‌توانید چندین عکس انتخاب کنید - حداکثر حجم هر عکس
                          5MB
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".jpg"
                      multiple
                      onChange={(e) =>
                        handleGalleryFileSelect(e.target.files, "petImage")
                      }
                      className="hidden"
                    />
                  </label>
                  {/* Gallery Display */}
                  {selectedPetImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedPetImages.map((file, index) => (
                        <div
                          key={index}
                          className="relative border-2 border-[var(--main-color)]/20 rounded-xl p-3 bg-[var(--main-color)]/5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-600 truncate flex-1">
                              {file.name}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeFileFromGallery(index, "petImage")
                              }
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ویدئو (ها) پت
                  </label>
                  {/* Upload Button */}
                  <label className="flex items-center justify-between gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[var(--main-color)] rounded-xl p-3 cursor-pointer transition-colors mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--main-color)]/10 text-[var(--main-color)] text-lg">
                        🎬
                      </span>
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold">انتخاب ویدیوها</div>
                        <div className="text-xs text-gray-500">
                          می‌توانید چندین ویدیو انتخاب کنید - حداکثر حجم هر
                          ویدیو 20MB
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) =>
                        handleGalleryFileSelect(e.target.files, "video")
                      }
                      className="hidden"
                    />
                  </label>
                  {/* Gallery Display */}
                  {selectedVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedVideos.map((file, index) => (
                        <div
                          key={index}
                          className="relative border-2 border-[var(--main-color)]/20 rounded-xl p-3 bg-[var(--main-color)]/5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-600 truncate flex-1">
                              {file.name}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeFileFromGallery(index, "video")
                              }
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
            {/* Consultations - Only visible to admin */}
            {userPayload?.role === "admin" && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--main-color)] mb-4">
                  مشاوره ها
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      مشاوره متخصص تغذیه
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("nutritionalCounseling")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      مشاوره دامپزشک متخصص
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("expertVeterinaryCounseling")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      مشاوره تربیت پت
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                      {...register("trainingAdvice")}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Form Actions */}
            <div className="w-full flex justify-between gap-3 pt-6 border-t">
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
                  {loading ? "در حال ذخیره..." : pet ? "ثبت" : "ذخیره"}
                </button>
                <button onClick={() => console.log()}>log</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
