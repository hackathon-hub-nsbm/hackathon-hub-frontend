import { create } from "zustand";

export interface User {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  position?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  authLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  authLoading: true,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
}));

export default useAuthStore;
