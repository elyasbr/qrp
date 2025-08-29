/**
 * File Upload Service
 * 
 * This service handles file uploads to the external provider with proper authentication.
 * 
 * API Endpoints:
 * - POST ${NEXT_PUBLIC_UPLOAD_BASE_URL}/first-upload - Upload a file
 * - GET ${NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/{fileId} - Get file preview
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_UPLOAD_BASE_URL: Base URL for file upload service
 * 
 * Authentication:
 * - All requests include Bearer token from localStorage
 * - Token is automatically added via axios interceptor
 * 
 * Usage:
 * - Images/Videos: Use isPrivate=false for public access
 * - PDFs: Use isPrivate=true for secure access
 */

import axios from 'axios';
import { getToken } from './auth';


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

export const uploadFile = async (file: File, isPrivate: boolean = false, retryCount: number = 0): Promise<UploadResponse> => {
  const maxRetries = 2;
  
  // Validate file
  if (!file) {
    throw new Error('File is required');
  }

  // Check file size (optional: 10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Get authentication token
  const token = getToken();
  if (!token) {
    throw new Error('Authentication token not found. Please login again.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('isPrivate', isPrivate.toString());

  // Log detailed request information
  console.log(`🚀 Starting file upload (attempt ${retryCount + 1}/${maxRetries + 1}) with details:`, {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    isPrivate,
    hasToken: !!token,
    tokenLength: token.length,
    tokenPreview: token.substring(0, 20) + '...',
    uploadUrl: `${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/first-upload`,
    timestamp: new Date().toISOString()
  });

  try {
    // Create a temporary axios instance for upload service with the upload base URL
    const uploadApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_UPLOAD_BASE_URL,
      timeout: 60000, // 60 seconds timeout for file uploads
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    const response = await uploadApi.post<{
      statusCode: number;
      result: {
        uploadId: string;
        fileId: string;
        createdAt: string;
      };
      timestamp: string;
    }>('/file-manager/first-upload', formData, {
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Upload progress: ${percentCompleted}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
        }
      },
    });

    // Return the fileId from the server response
    return {
      url: `${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/file-manager/preview/${response.data.result.fileId}`,
      fileId: response.data.result.fileId,
      message: 'Upload successful'
    };
  } catch (error: any) {
    
    // Handle different types of errors
    if (error.code === 'ERR_CANCELED' || error.message?.includes('canceled')) {
      throw new Error('Upload was canceled');
    }
    
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      if (retryCount < maxRetries) {
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return uploadFile(file, isPrivate, retryCount + 1);
      }
      throw new Error('Upload timed out after multiple attempts. Please try again.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (error.response?.status === 413) {
      throw new Error('File is too large. Please choose a smaller file.');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    // Network errors - retry if possible
    if ((error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) && retryCount < maxRetries) {
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return uploadFile(file, isPrivate, retryCount + 1);
    }
    
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw new Error('Failed to upload file. Please try again.');
  }
};

export const getFilePreview = async (fileId: string): Promise<FilePreviewResponse> => {
  if (!fileId) {
    throw new Error('File ID is required');
  }

  // Get authentication token
  const token = getToken();
  if (!token) {
    throw new Error('Authentication token not found. Please login again.');
  }

  try {
    // Create a temporary axios instance for upload service with the upload base URL
    const uploadApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_UPLOAD_BASE_URL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const response = await uploadApi.get<FilePreviewResponse>(`/file-manager/preview/${fileId}`);
    return response.data;
  } catch (error: any) {
    console.error('File preview error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
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


