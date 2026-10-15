import api from "./axios";

// create task
export const createTaskApi = (data:any)=> api.post("/tasks", data)


// get all tasks
export const getTasksApi = () => api.get("/tasks");

// get by ID
export const getTaskByIdApi = (id: string) => api.get(`/tasks/${id}`);

// update task
export const updateTaskApi = (id: string, data: any) => api.patch(`/tasks/${id}`, data);

// delete task
export const deleteTaskApi = (id: string) => api.delete(`/tasks/${id}`);