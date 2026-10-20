import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTaskApi, deleteTaskApi, getTaskByIdApi, getTasksApi, updateTaskApi } from "../api/tasksApi"


// create task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// get tasks by project
export const useGetTasks = (projectId?: string) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksApi(projectId),
    enabled: !!projectId,
    select: (res: any) => res.data,
  });
};

// get task by id
export const useGetTaskById = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTaskByIdApi(id),
    enabled: !!id,
    select: (res: any) => res.data,
  });
};

// update task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTaskApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
