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
