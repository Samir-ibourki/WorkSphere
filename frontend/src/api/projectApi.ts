import api from "./axios";

// create 
export const createProjectApi = (data: any) => api.post("/projects", data);

// get all
export const getProjectsApi = () => api.get("/projects");

// get by ID
export const getProjectByIdApi = (id: string) => api.get(`/projects/${id}`);

// update (id howa l-ouwel)
export const updateProjectApi = (id: string, data: any) => api.patch(`/projects/${id}`, data);

// delete
export const deleteProjectApi = (id: string) => api.delete(`/projects/${id}`);
