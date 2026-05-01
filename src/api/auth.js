import api from "./axios";

const unwrap = (response) => response?.data?.data ?? response?.data ?? {};

export const login = async (credentials) => {
  const payload = unwrap(await api.post("/auth/login", credentials));
  if (payload.token) localStorage.setItem("token", payload.token);
  if (payload.refreshToken) localStorage.setItem("refreshToken", payload.refreshToken);
  return {
    token: payload.token ?? null,
    refreshToken: payload.refreshToken ?? null,
    user: payload.user ?? null,
  };
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }
  return { success: true };
};

export const refreshToken = async () => {
  const currentRefreshToken = localStorage.getItem("refreshToken");
  const payload = unwrap(await api.post("/auth/refresh-token", { refreshToken: currentRefreshToken }));
  if (payload.token) localStorage.setItem("token", payload.token);
  if (payload.refreshToken) localStorage.setItem("refreshToken", payload.refreshToken);
  return {
    token: payload.token ?? null,
    refreshToken: payload.refreshToken ?? null,
  };
};

export const forgotPassword = async (email) => {
  const payload = unwrap(await api.post("/auth/forgot-password", { email }));
  return { message: payload.message ?? "Password reset email sent." };
};

export const resetPassword = async (token, password) => {
  const payload = unwrap(await api.post("/auth/reset-password", { token, password }));
  return { message: payload.message ?? "Password reset successfully." };
};

export const getCurrentUser = async () => {
  const payload = unwrap(await api.get("/auth/me"));
  return payload.user ?? payload;
};

