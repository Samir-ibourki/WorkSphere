import api from "./axios";

// get current workspace organization
export const getOrganizationApi = () => api.get("/organizations/me");

// update workspace organization
export const updateOrganizationApi = (data: any) => api.patch("/organizations/me", data);

// get organization users
export const getOrganizationUsersApi = () => api.get("/organizations/me/users");

// invite / add member to organization
export const inviteMemberApi = (data: { email: string; name?: string }) =>
  api.post("/organizations/me/members", data);

// remove member from organization
export const removeMemberApi = (userId: string) =>
  api.delete(`/organizations/me/members/${userId}`);
