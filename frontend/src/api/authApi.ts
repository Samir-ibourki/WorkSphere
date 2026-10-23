import api from "./axios";

export const registerApi = (data: any) => api.post("/auth/register", data);

export const loginApi = (data: any) => api.post("/auth/login", data);

export const profileApi = () => api.get("/auth/me");
