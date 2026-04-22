import api from "./axios";

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const updateProfilePhoto = async (formData) => {
  const response = await api.put("/auth/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put("/auth/change-password", data);
  return response.data;
};
