import { useMutation, useQuery } from "@tanstack/react-query";
import { loginApi, registerApi, profileApi } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";

//  hook of register
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => registerApi(data),
    onSuccess: (response: any) => {
      console.log("Registered successfully:", response);
    },
    onError: (error: any) => {
      console.error("Register failed:", error.response?.data?.message || error.message);
    },
  });
};

// hook of login
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: any) => loginApi(data),
    onSuccess: (response: any) => {
      const { user, token } = response.data || response;
      if (token && user) {
        login(user, token);
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data?.message || error.message);
    },
  });
};

// hook of profile
export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi,
    enabled: isAuthenticated,
  });
};
