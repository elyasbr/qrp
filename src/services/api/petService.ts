import { AxiosError } from 'axios';
import api from './api';

// Pet interface based on the API schema
export interface Pet {
  petId?: string;
  namePet: string;
  typePet: string;
  blood: string;
  sex: "MEN" | "WOMEN" | "UNKNOWN";
  birthDate: string;
  birthCertificateNumberPet: string;
  microChipCode: string;
  colorPet: "RED" | "BLUE" | "GREEN" | "YELLOW" | "BLACK" | "WHITE" | "ORANGE" | "PURPLE" | "PINK" | "BROWN" | "GRAY" | "CYAN" | "MAGENTA" | "UNKNOWN";
  distinctiveFeature: string;
  weightPet: number;
  heightPet: number;
  issuingVeterinarian: string;
  addressVeterinarian: string;
  phoneNumberVeterinarian: string;
  issuingMedicalSystem: string;
  nameHead: string;
  nationalCodeHead: string;
  mobile1Head: string;
  mobile2Head: string;
  telHead: string;
  iso3Head: string;
  stateHead: string;
  cityHead: string;
  addressHead: string;
  postalCodeHead: string;
  emailHead: string;
  telegramHead: string;
  youtubeHead: string;
  instagramHead: string;
  whatsAppHead: string;
  linkedinHead: string;
  generalVeterinarian: string;
  addressGeneralVeterinarian: string;
  phoneNumberGeneralVeterinarian: string;
  specialistVeterinarian: string;
  addressSpecialistVeterinarian: string;
  phoneNumberSpecialistVeterinarian: string;
  isSterile: boolean;
  vaccineRabiel: boolean;
  vaccineLDHPPi: boolean;
  vaccineRCP: boolean;
  typeFeeding: string;
  numberMeal: number;
  diet: string;
  prohibitedFoodItems: string;
  regularlyUsedMedications: string;
  prohibitedDrugs: string;
  favoriteEncouragement: string;
  behavioralHabits: string;
  susceptibility: string;
  sensitivities: string;
  connectOtherPets: boolean;
  connectWithBaby: boolean;
  certificatePDF: string;
  insurancePDF: string;
  nutritionalCounseling: string;
  expertVeterinaryCounseling: string;
  trainingAdvice: string;
}

// Pagination request interface
export interface PetPaginationRequest {
  page: number;
  limit: number;
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
}

// Pagination response interface
export interface PetPaginationResponse {
  statusCode: number;
  result: {
    data: Pet[];
    metadata: {
      page: number;
      limit: number;
      itemCount: number;
      pageCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
  timestamp: string;
}

// Create Pet
export const createPet = async (petData: Pet): Promise<{ message: string }> => {
  try {
    const response = await api.post<{ message: string }>('/pet', petData);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to create pet');
  }
};

// Get Pet by ID
export const getPetById = async (dataPetId: string): Promise<Pet> => {
  try {
    const response = await api.get<{ statusCode: number; result: Pet }>(`/pet/${dataPetId}`);
    return response.data.result;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch pet');
  }
};

// Update Pet
export const updatePet = async (dataPetId: string, petData: Pet): Promise<Pet> => {
  try {
    const response = await api.put<{ statusCode: number; result: Pet }>(`/pet/${dataPetId}`, petData);
    return response.data.result;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to update pet');
  }
};

// Delete Pet
export const deletePet = async (dataPetId: string): Promise<{ statusCode: number; timestamp: string }> => {
  try {
    const response = await api.delete<{ statusCode: number; timestamp: string }>(`/pet/${dataPetId}`);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to delete pet');
  }
};

// Get Paginated Pets
export const getPetsPaginated = async (paginationData: PetPaginationRequest): Promise<PetPaginationResponse> => {
  try {
    const response = await api.post<PetPaginationResponse>('/pet/pagination', paginationData);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch pets');
  }
};

// Get all pets (simplified version)
export const getAllPets = async (): Promise<Pet[]> => {
  try {
    const response = await getPetsPaginated({
      page: 1,
      limit: 1000, // Large limit to get all pets
      filter: {},
      sort: { createdAt: -1 }
    });
    return response.result.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch all pets');
  }
};
