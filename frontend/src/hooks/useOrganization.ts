import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrganizationApi,
  getOrganizationUsersApi,
  updateOrganizationApi,
} from "../api/organizationApi";

// get currentworkspace organization
export const useGetOrganization = () => {
  return useQuery({
    queryKey: ["organization"],
    queryFn: getOrganizationApi,
    select: (res: any) => res.data,
  });
};

// get team members
export const useGetOrganizationUsers = () => {
  return useQuery({
    queryKey: ["organization", "users"],
    queryFn: getOrganizationUsersApi,
    select: (res: any) => res.data,
  });
};

// update organization
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateOrganizationApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
};
