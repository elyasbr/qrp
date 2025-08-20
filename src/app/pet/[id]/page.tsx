"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import QRPublicPage from "@/components/pet/QRPublicPage";
import { usePetPublic } from "@/hooks/usePetPublic";

export default function PetPublicPage() {
  const params = useParams();
  const petId = params?.id as string;
  
  // Debug logging
  useEffect(() => {
    console.log("PetPublicPage mounted with params:", params);
    console.log("Extracted petId:", petId);
  }, [params, petId]);
  
  const { pet, isLoading, error } = usePetPublic(petId);

  // Debug logging for hook results
  useEffect(() => {
    console.log("Hook results:", { pet, isLoading, error });
  }, [pet, isLoading, error]);

  return (
    <QRPublicPage 
      pet={pet} 
      isLoading={isLoading} 
      error={error || undefined} 
    />
  );
}


