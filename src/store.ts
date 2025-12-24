import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "./types";


interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    logoutFromStore: () => void;
}

export const useAuthStore = create<AuthState>()(devtools((set) => ({
    user: null,
    setUser: (user: User) => set((state) => ({ ...state, user })),
    logoutFromStore: () => set((state) => ({ ...state, user: null })),
})))