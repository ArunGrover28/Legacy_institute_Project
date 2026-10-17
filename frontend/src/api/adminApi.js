import api from "./api";

export const adminLoginApi = async (username, password) => {
  const response = await api.post("/admin/login", {
    username,
    password,
  });

  return response.data;
};

export const getDashboardStatsApi = async (token) => {
  const response = await api.get("/admin/dashboard/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};