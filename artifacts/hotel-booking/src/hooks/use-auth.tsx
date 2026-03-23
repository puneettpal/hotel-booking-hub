import { createContext, useContext, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

type User = {
  id: number;
  email: string;
  role?: string; 
};

type LoginRequest = any;
type RegisterRequest = any;

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  error: Error | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

 const user = null;
const isLoading = false;
const error = null;

 
  const login = async () => {};
const register = async () => {};
const logout = async () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error: error as Error | null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
