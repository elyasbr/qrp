// Utility functions for handling API responses and tokens

export interface ApiResponse<T = any> {
  statusCode?: number;
  result?: T;
  data?: T;
  token?: string;
  message?: string;
  success?: boolean;
  timestamp?: string;
}

export function extractToken(response: any): string | null {
  if (!response) return null;
  
  // Handle different response formats
  const token = 
    response?.result?.token || 
    response?.token || 
    response?.data?.token || 
    response?.accessToken ||
    response?.authToken ||
    null;
    
  return token;
}

export function extractData<T>(response: any): T | null {
  if (!response) return null;
  
  // Handle different response formats
  const data = 
    response?.result || 
    response?.data || 
    response;
    
  return data;
}

export function isSuccessfulResponse(response: any): boolean {
  if (!response) return false;
  
  // Check different success indicators
  return (
    response?.statusCode === 200 ||
    response?.statusCode === 201 ||
    response?.success === true ||
    response?.status === 'success'
  );
} 