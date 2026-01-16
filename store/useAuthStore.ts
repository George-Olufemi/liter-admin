import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  wallet: number;
  address: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  customerCode: string;
  city: string;
  state: string;
  isVerified: boolean;
  isBlocked: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
