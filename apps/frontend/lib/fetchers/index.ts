import { useAuthStore } from '@/state/auth.state';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { IUser } from '../types/user';

const API = process.env.NEXT_PUBLIC_API_URL;
const isDev = process.env.NODE_ENV === 'development';

if (!API) {
  throw new Error('Api Url is not defined');
}

// Common

const postMutate = (url: string, data: any, config?: AxiosRequestConfig) => {
  if (isDev)
    return axios.post(API + url, data, {
      ...config,
      headers: { aid: useAuthStore.getState().authToken },
    });

  return axios.post(API + url, data, {
    ...config,
    withCredentials: true,
  });
};

const query = (url: string, config?: AxiosRequestConfig) => {
  if (isDev)
    return axios.get(API + url, {
      ...config,
      headers: { aid: useAuthStore.getState().authToken },
    });

  return axios.get(API + url, {
    ...config,
    withCredentials: true,
  });
};

const putMutation = (url: string, data: any, config?: AxiosRequestConfig) => {
  if (isDev)
    return axios.put(API + url, data, {
      ...config,
      headers: { aid: useAuthStore.getState().authToken },
    });

  return axios.put(API + url, data, {
    ...config,
    withCredentials: true,
  });
};
// Auth

export const assignUser = (user: any) => {
  return axios.post(API + 'users/assign', user);
};

export const login = async (data: any) => {
  return axios.post(API + 'auth/login', data, { withCredentials: true });
};

export const logout = () => {
  return postMutate('auth/logout', {});
};

export const forgotPassRequest = (email: string) => {
  return axios.post(API + 'auth/request-pass-change', { email });
};

export const changePassword = (data: any) => {
  return axios.post(API + 'auth/change-pass', data);
};

export const getMe = async () => {
  try {
    const res = await query('users/me');
    return res.data;
  } catch (error: any) {
    errorParser(error);
  }
};

// Dashboard

export const getRecentLeaves = () => {
  return query('leaves/recent');
};

export const addLeave = (data: any) => {
  return postMutate('leaves', data);
};

// Year

export const getUsers = async (): Promise<IUser[]> => {
  const { data } = await query('users');
  return data as IUser[];
};

// Admin
export const getAllUsers = async (): Promise<IUser[]> => {
  const { data } = await query('users/all');
  return data as IUser[];
};

export const getUserLeaves = (userId: string) => {
  return query('leaves/user?userId=' + userId);
};

export const createUser = (data: any) => {
  return postMutate('users', data);
};

export const updateUser = (data: any) => {
  return putMutation('users', data);
};

export const adminUpdateUser = (data: any) => {
  return putMutation('users/admin', data);
};

// Reports
export const getLeaves = (code: string) => {
  return query('leaves?code=' + code);
};

export const errorParser = (error: AxiosError) => {
  if (error.response) {
    const { data } = error.response as any;
    if (data?.message) {
      if (typeof data?.message === 'string') {
        // Authentication error
        if (data.message === 'Authentication failed') {
          location.href = '/landing';
        }

        return toast({
          variant: 'destructive',
          title: data.error,
          description: data.message,
        });
      }
      for (const message in data.message) {
        toast({
          variant: 'destructive',
          title: data.error,
          description: data.message[message],
        });
      }
    }
  } else {
    toast({
      variant: 'destructive',
      title: 'An Error Occured',
      description: error.message,
    });
  }
};
