"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import QRPublicPage from "@/components/pet/QRPublic";
import { usePetPublic } from "@/hooks/usePetPublic";

export default function PetPublicPage() {
  const params = useParams();
  const petId = params?.id as string;
  const { pet, isLoading, error } = usePetPublic(petId);

  return (
    <QRPublicPage 
      pet={pet} 
      isLoading={isLoading} 
      error={error || undefined} 
    />
  );
}


