import { createContext, useContext, ReactNode } from "react";
import { useGetMe, useLogin, useRegister, useLogout } from "@workspace/api-client-react";
import type { LoginRequest, RegisterRequest, User } from "@workspace/api-client-react/src/generated/api.schemas";
import { useQueryClient } from "@tanstack/react-query";

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

  const { data: user, isLoading, error } = useGetMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (data: LoginRequest) => {
    await loginMutation.mutateAsync({ data });
    await queryClient.invalidateQueries({ queryKey: [`/api/auth/me`] });
  };

  const register = async (data: RegisterRequest) => {
    await registerMutation.mutateAsync({ data });
    await queryClient.invalidateQueries({ queryKey: [`/api/auth/me`] });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.setQueryData([`/api/auth/me`], null);
  };

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
