import { useAuthStore } from '@/state/auth.state';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { IUser } from '../types/user';

const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  throw new Error('Api Url is not defined');
}

// Common

const postMutate = (url: string, data: any, config?: AxiosRequestConfig) => {
  return axios.post(url, data, {
    ...config,
    headers: { aid: useAuthStore.getState().authToken },
  });
};

const query = (url: string, config?: AxiosRequestConfig) => {
  return axios.get(url, {
    ...config,
    headers: { aid: useAuthStore.getState().authToken },
  });
};

const deleteMutation = (url: string, config?: AxiosRequestConfig) => {
  return axios.delete(url, {
    ...config,
    headers: { aid: useAuthStore.getState().authToken },
  });
};
// Auth

export const assignUser = (user: any) => {
  return axios.post(API + 'users/assign', user);
};

export const login = (data: any) => {
  return axios.post(API + 'auth/login', data);
};

export const logout = () => {
  return postMutate(API + 'auth/login', {});
};

// Dashboard

export const getRecentLeaves = () => {
  return query(API + 'leaves/recent');
};

export const addLeave = (data: any) => {
  return postMutate(API + 'leaves', data);
};

// Year

export const getUsers = async (): Promise<IUser[]> => {
  const { data } = await query(API + 'users');
  return data as IUser[];
};

export const getUserLeaves = (userId: string) => {
  return query(API + 'leaves/user?userId=' + userId);
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
