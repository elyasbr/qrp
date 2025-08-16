import { AxiosError } from 'axios';
import api from './api';

interface User {
  id: number;
  name: string;
  email: string;
  roleId?: number;
}

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  userId: number;
  message: string;
}

export const registerUser = async (userData: RegisterUserRequest): Promise<RegisterUserResponse> => {
  try {
    const response = await api.post<RegisterUserResponse>('/user/register', userData);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Registration failed');
  }
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await api.get<User>(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch user');
  }
};

// Get all roles (fallback)
export const getRoles = async (): Promise<{ roles: any[] }> => {
  try {
    const response = await api.post<{ roles: any[] }>(`/user/roles`, {});
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch roles');
  }
};

// -------------------------
// Mobile / OTP flows (match screenshots)
// -------------------------

// 1) Pre-register (create temp user mobile)
export const preRegisterMobile = async (mobile: string, iso3Country = 'IRN'): Promise<any> => {
  try {
    const response = await api.post(`/user/mobile/pre-register`, { iso3Country, mobile: String(mobile) });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to pre-register mobile');
  }
};

// 2) Accept register (verify code and create user)
export const acceptRegisterMobile = async (mobile: string, smsCode: string): Promise<any> => {
  try {
    // API expects { mobile, smsCode } for accept-register
    const response = await api.post(`/user/mobile/accept-register`, { mobile: String(mobile), smsCode });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to accept mobile registration');
  }
};

// 3) Pre sign-in (send OTP for sign in)
export const preSignInByMobile = async (mobile: string): Promise<any> => {
  try {
  // keep compatibility: accept international format (+98...) or local (0912...)
  const response = await api.post(`/user/mobile/pre-sign-in`, { mobile: String(mobile) });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to pre sign-in by mobile');
  }
};

// 4) Accept sign-in (verify OTP and return token/user)
export const acceptSignInByMobile = async (mobile: string, smsCode: string): Promise<any> => {
  try {
    // API expects { mobile, smsCode } for accept-sign-in
    const response = await api.post(`/user/mobile/accept-sign-in`, { mobile: String(mobile), smsCode });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to accept sign-in by mobile');
  }
};

// 5) Set role (set role via JWT or backend)
export const setRole = async (roleId: string | number): Promise<any> => {
  try {
    // API expects { roleId: "..." }
    const response = await api.post(`/user/set-role`, { roleId });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to set role');
  }
};

// 6) Pagination roles of user (POST /api/v1/user/pagination/roles/{userId})
export const paginationRolesOfUser = async (
  userId: number,
  page = 1,
  size = 10
): Promise<any> => {
  try {
    const response = await api.post(`/user/pagination/roles/${userId}`, { page, size });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch paginated roles');
  }
};

// Backwards-compatible mobile helpers (aliasing to v1 endpoints)
export const otpRegisterByMobile = preRegisterMobile;
export const otpLoginByMobile = preSignInByMobile;
export const acceptLoginByMobile = acceptSignInByMobile;

// Get current user's application roles
export const getCurrentUserRoles = async (userId: number): Promise<any> => {
  try {
    const response = await api.post(`/user/application/roles/current`, { userId });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch current user roles');
  }
};