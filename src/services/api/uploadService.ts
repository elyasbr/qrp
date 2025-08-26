/**
 * File Upload Service
 * 
 * This service handles file uploads to the API with proper authentication.
 * 
 * API Endpoints:
 * - POST /api/v1/file-manager/first-upload - Upload a file
 * - GET /api/v1/file-manager/preview/{fileId} - Get file preview
 * 
 * Authentication:
 * - All requests include Bearer token from localStorage
 * - Token is automatically added via axios interceptor
 * 
 * Usage:
 * - Images/Videos: Use isPrivate=false for public access
 * - PDFs: Use isPrivate=true for secure access
 */

import api from './api';

export interface UploadResponse {
  url: string;
  fileId: string;
  message?: string;
}

export interface FilePreviewResponse {
  url: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export const uploadFile = async (file: File, isPrivate: boolean = false): Promise<UploadResponse> => {
  // Validate file
  if (!file) {
    throw new Error('File is required');
  }

  // Check file size (optional: 10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('isPrivate', isPrivate.toString());

  try {
    const response = await api.post<UploadResponse>('/file-manager/first-upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('File upload error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to upload file');
  }
};

export const getFilePreview = async (fileId: string): Promise<FilePreviewResponse> => {
  if (!fileId) {
    throw new Error('File ID is required');
  }

  try {
    const response = await api.get<FilePreviewResponse>(`/file-manager/preview/${fileId}`);
    return response.data;
  } catch (error: any) {
    console.error('File preview error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to get file preview');
  }
};

// Utility function to resolve file URLs
// This handles both direct URLs and file IDs that need to be resolved
export const resolveFileUrl = async (fileUrlOrId: string): Promise<string> => {
  if (!fileUrlOrId) {
    throw new Error('File URL or ID is required');
  }

  // If it's already a full URL, return it directly
  if (fileUrlOrId.startsWith('http://') || fileUrlOrId.startsWith('https://')) {
    return fileUrlOrId;
  }
  
  // If it looks like a file ID (not a URL), resolve it through the preview endpoint
  try {
    const preview = await getFilePreview(fileUrlOrId);
    return preview.url;
  } catch (error) {
    console.error('Failed to resolve file URL:', error);
    // Return the original value as fallback
    return fileUrlOrId;
  }
};


