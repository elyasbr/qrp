import { AxiosError } from 'axios';
import api from './api';

export interface Role {
  id: number;
  name: string;
  description?: string;
  companyId?: number;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  companyId?: number;
}

export interface PaginationRequest {
  page: number;
  pageSize: number;
  search?: string;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const createRole = async (payload: RoleCreateRequest): Promise<Role> => {
  try {
    const response = await api.post<Role>('/role', payload);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to create role');
  }
};

export const updateRole = async (roleId: number, payload: Partial<RoleCreateRequest>): Promise<Role> => {
  try {
    const response = await api.put<Role>(`/role/${roleId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to update role');
  }
};

export const deleteRole = async (roleId: number): Promise<void> => {
  try {
    await api.delete<void>(`/role/${roleId}`);
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to delete role');
  }
};

export const getRole = async (roleId: number): Promise<Role> => {
  try {
    const response = await api.get<Role>(`/role/${roleId}`);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch role');
  }
};

export const getRoles = async (payload: PaginationRequest): Promise<PaginationResponse<Role>> => {
  try {
    const response = await api.post<PaginationResponse<Role>>('/role/pagination', payload);
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message || 'Failed to fetch roles');
  }
};
