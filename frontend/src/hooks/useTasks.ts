import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTaskApi, deleteTaskApi, getTaskByIdApi, getTasksApi, updateTaskApi } from "../api/tasksApi"


// create task
export const useCreateTasks = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createTaskApi,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["tasks"]})
        }
    })
}

// get all tasks
export const useGetAllTasks = ()=>{
    return useQuery({
        queryKey:["tasks"],
        queryFn:getTasksApi,
        select: (res:any)=>res.data
    })
}

// get tasks by id
export const useGetTasksByID = (id:string)=>{
    return useQuery({
        queryKey:["tasks", id],
        queryFn:()=>getTaskByIdApi(id),
        enabled:!!id,
        select: (res:any)=>res.data
    })
}

// update task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTaskApi(id, data),
    onSuccess: (_, {id}) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });
};


// delete tasks
export const useDeleteTask = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteTaskApi,
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    })
}
