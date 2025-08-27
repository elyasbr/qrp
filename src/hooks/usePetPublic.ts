"use client";
import { useState, useEffect } from "react";
import { getPetByIdPublic, Pet } from "@/services/api/petService";
import { getFilePreview } from '@/services/api/uploadService';

interface UsePetPublicReturn {
  pet: Pet | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePetPublic(petId: string | undefined): UsePetPublicReturn {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPet = async () => {
    
    if (!petId) {
      setError("شناسه پت نامعتبر است");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const petData = await getPetByIdPublic(petId);
      setPet(petData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات پت";
      setError(errorMessage);
      setPet(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, [petId]);

  const refetch = () => {
    fetchPet();
  };

  return { pet, isLoading, error, refetch };
}

export interface FilePreview {
  url: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface PetFiles {
  photoPet?: FilePreview;
  insurancePdf?: FilePreview;
  certificatePdf?: FilePreview;
  galleryPhoto: FilePreview[];
  galleryVideo: FilePreview[];
}

export const usePetFiles = (pet: any) => {
  const [files, setFiles] = useState<PetFiles>({
    galleryPhoto: [],
    galleryVideo: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pet) {
      setFiles({ galleryPhoto: [], galleryVideo: [] });
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const newFiles: PetFiles = {
          galleryPhoto: [],
          galleryVideo: []
        };

        // Fetch main pet photo
        if (pet.photoPet) {
          try {
            console.log('Fetching main pet photo:', pet.photoPet);
            const photoPreview = await getFilePreview(pet.photoPet);
            newFiles.photoPet = photoPreview;
            console.log('Main pet photo loaded:', photoPreview);
          } catch (err) {
            console.error('Failed to fetch main pet photo:', err);
          }
        }

        // Fetch insurance PDF
        if (pet.insurancePdf) {
          try {
            console.log('Fetching insurance PDF:', pet.insurancePdf);
            const insurancePreview = await getFilePreview(pet.insurancePdf);
            newFiles.insurancePdf = insurancePreview;
            console.log('Insurance PDF loaded:', insurancePreview);
          } catch (err) {
            console.error('Failed to fetch insurance PDF:', err);
          }
        }

        // Fetch certificate PDF
        if (pet.certificatePdf) {
          try {
            console.log('Fetching certificate PDF:', pet.certificatePdf);
            const certificatePreview = await getFilePreview(pet.certificatePdf);
            newFiles.certificatePdf = certificatePreview;
            console.log('Certificate PDF loaded:', certificatePreview);
          } catch (err) {
            console.error('Failed to fetch certificate PDF:', err);
          }
        }

        // Fetch gallery photos
        if (pet.galleryPhoto && Array.isArray(pet.galleryPhoto) && pet.galleryPhoto.length > 0) {
          console.log('Fetching gallery photos:', pet.galleryPhoto);
          const photoPromises = pet.galleryPhoto.map(async (fileId: string) => {
            try {
              const preview = await getFilePreview(fileId);
              console.log('Gallery photo loaded:', preview);
              return preview;
            } catch (err) {
              console.error('Failed to fetch gallery photo:', fileId, err);
              return null;
            }
          });
          
          const photoResults = await Promise.all(photoPromises);
          newFiles.galleryPhoto = photoResults.filter(Boolean) as FilePreview[];
        }

        // Fetch gallery videos
        if (pet.galleryVideo && Array.isArray(pet.galleryVideo) && pet.galleryVideo.length > 0) {
          console.log('Fetching gallery videos:', pet.galleryVideo);
          const videoPromises = pet.galleryVideo.map(async (fileId: string) => {
            try {
              const preview = await getFilePreview(fileId);
              console.log('Gallery video loaded:', preview);
              return preview;
            } catch (err) {
              console.error('Failed to fetch gallery video:', fileId, err);
              return null;
            }
          });
          
          const videoResults = await Promise.all(videoPromises);
          newFiles.galleryVideo = videoResults.filter(Boolean) as FilePreview[];
        }

        setFiles(newFiles);
        console.log('All files loaded successfully:', newFiles);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('خطا در بارگذاری فایل‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [pet]);

  return { files, loading, error };
};
