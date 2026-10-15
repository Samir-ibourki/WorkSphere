import api from "./axios";

// get dashboard stats
export const getDashboardStatsApi = () => api.get("/dashboard");
