import api from './api';

export interface UploadResponse {
  url: string;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data as unknown as UploadResponse;
};


