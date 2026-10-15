import api from "./axios";

// get current workspace organization
export const getOrganizationApi = () => api.get("/organizations/me");

// update workspace organization
export const updateOrganizationApi = (data: any) => api.patch("/organizations/me", data);

// get organization users
export const getOrganizationUsersApi = () => api.get("/organizations/me/users");
