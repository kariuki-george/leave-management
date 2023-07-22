import { IUser } from '@/lib/types/user';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface IState {
  user?: IUser;
  authToken: string;
  setUser: (user: IUser) => void;
  setAuthToken: (token: string) => void;
  clear: () => void;
}

export const useAuthStore = create<IState>()(
  devtools(
    persist(
      (set) => ({
        authToken: '',
        setAuthToken: (authToken) => set({ authToken }),
        setUser: (user) => set({ user }),
        clear: () => set({ user: undefined, authToken: '' }),
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
