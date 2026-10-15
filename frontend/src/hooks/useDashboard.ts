import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsApi } from "../api/dashboardApi";

// get dashboard stats
export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStatsApi,
    select: (res: any) => res.data,
  });
};
