import axios from "axios";

const api = axios.create({
  baseURL: "https://be-task-3299.onrender.com/api/auth",
});

export const register = (data) => api.post("/register", data);
export const login = (data) => api.post("/login", data);
export const getProfile = (userId, token) =>
  api.get(`/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateProfile = (userId, data, token) =>
  api.put(`/profile/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const logout = (token) =>
  api.post(
    "/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
