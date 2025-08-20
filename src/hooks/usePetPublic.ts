"use client";
import { useState, useEffect } from "react";
import { getPetByIdPublic, Pet } from "@/services/api/petService";

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
    console.log("usePetPublic hook called with petId:", petId); // Debug log
    
    if (!petId) {
      console.log("No petId provided, setting error"); // Debug log
      setError("شناسه پت نامعتبر است");
      return;
    }

    console.log("Starting to fetch pet with ID:", petId); // Debug log
    setIsLoading(true);
    setError(null);

    try {
      console.log("Making API call for pet ID:", petId); // Debug log
      const petData = await getPetByIdPublic(petId);
      console.log("Pet data received successfully:", petData); // Debug log
      setPet(petData);
    } catch (err) {
      console.error("Error fetching pet:", err); // Debug log
      const errorMessage = err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات پت";
      setError(errorMessage);
      setPet(null);
    } finally {
      console.log("Setting loading to false"); // Debug log
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
