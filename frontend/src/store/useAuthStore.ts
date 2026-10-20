import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  workspaceLogo: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setWorkspaceLogo: (logo: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      workspaceLogo: null,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          workspaceLogo: null,
          isAuthenticated: false,
        });
      },
      setWorkspaceLogo: (logo: string | null) => {
        set({ workspaceLogo: logo });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
