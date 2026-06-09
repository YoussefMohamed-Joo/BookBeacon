import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  loyaltyPoints: number;
  token: string;
}

interface AppState {
  user: User | null;
  isDarkMode: boolean;
  setUser: (user: User | null) => void;
  toggleDarkMode: () => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isDarkMode: true,
      setUser: (user) => set({ user }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      logout: () => {
        localStorage.removeItem('user');
        set({ user: null });
      },
      updatePoints: (points) =>
        set((state) => ({
          user: state.user ? { ...state.user, loyaltyPoints: points } : null,
        })),
    }),
    {
      name: 'bookbeacon-storage',
      partialize: (state) => ({
        user: state.user,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
