import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProjectApi,
  deleteProjectApi,
  getProjectsApi,
  getProjectByIdApi,
  updateProjectApi,
} from "../api/projectApi";

// get all Projects
export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsApi,
    select: (res: any)=> res.data
  });
};

// get Project By ID
export const useGetProjectById = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectByIdApi(id),
    enabled: !!id, 
    select: (res: any)=> res.data
  });
};

// create Project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// update Project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProjectApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// delete Project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
