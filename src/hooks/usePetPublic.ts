"use client";
import { useState, useEffect } from 'react';
import { getPetByIdPublic } from '@/services/api/petService';
import { getFilePreview } from '@/services/api/uploadService';

import { Pet } from '@/services/api/petService';

export const usePetPublic = (petId: string) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<{
    photoPet?: { url: string; fileId: string };
    galleryPhoto?: Array<{ url: string; fileId: string }>;
    galleryVideo?: Array<{ url: string; fileId: string }>;
    certificatePdf?: { url: string; fileId: string };
    insurancePdf?: { url: string; fileId: string };
  }>({});

  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const petData = await getPetByIdPublic(petId);
        setPet(petData);
        
        // Fetch media files if they exist
        await fetchMediaFiles(petData);
      } catch (err: any) {
        setError(err.message || 'خطا در بارگذاری اطلاعات پت');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const fetchMediaFiles = async (petData: any) => {
    const mediaData: any = {};

    try {
      // Fetch main pet photo
      if (petData.photoPet) {
        try {
          const photoPreview = await getFilePreview(petData.photoPet);
          mediaData.photoPet = {
            url: photoPreview.url,
            fileId: petData.photoPet
          };
        } catch (error) {
          console.error('Failed to fetch pet photo:', error);
        }
      }

      // Fetch gallery photos
      if (petData.galleryPhoto && petData.galleryPhoto.length > 0) {
        const photoPromises = petData.galleryPhoto.map(async (fileId: string) => {
          try {
            const preview = await getFilePreview(fileId);
            return {
              url: preview.url,
              fileId: fileId
            };
          } catch (error) {
            console.error(`Failed to fetch gallery photo ${fileId}:`, error);
            return null;
          }
        });

        const photoResults = await Promise.all(photoPromises);
        mediaData.galleryPhoto = photoResults.filter(result => result !== null);
      }

      // Fetch gallery videos
      if (petData.galleryVideo && petData.galleryVideo.length > 0) {
        const videoPromises = petData.galleryVideo.map(async (fileId: string) => {
          try {
            const preview = await getFilePreview(fileId);
            return {
              url: preview.url,
              fileId: fileId
            };
          } catch (error) {
            console.error(`Failed to fetch gallery video ${fileId}:`, error);
            return null;
          }
        });

        const videoResults = await Promise.all(videoPromises);
        mediaData.galleryVideo = videoResults.filter(result => result !== null);
      }

      // Fetch certificate PDF
      if (petData.certificatePdf) {
        try {
          const certPreview = await getFilePreview(petData.certificatePdf);
          mediaData.certificatePdf = {
            url: certPreview.url,
            fileId: petData.certificatePdf
          };
        } catch (error) {
          console.error('Failed to fetch certificate PDF:', error);
        }
      }

      // Fetch insurance PDF
      if (petData.insurancePdf) {
        try {
          const insPreview = await getFilePreview(petData.insurancePdf);
          mediaData.insurancePdf = {
            url: insPreview.url,
            fileId: petData.insurancePdf
          };
        } catch (error) {
          console.error('Failed to fetch insurance PDF:', error);
        }
      }

      setMediaFiles(mediaData);
    } catch (error) {
      console.error('Error fetching media files:', error);
    }
  };

  return { pet, isLoading, error, mediaFiles };
};
