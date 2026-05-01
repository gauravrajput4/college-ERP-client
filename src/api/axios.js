import axios from "axios";

const resolveBaseUrl = () => {
  const configured = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  if (!configured) return "/api";
  return configured.endsWith("/api") ? configured : `${configured}/api`;
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

const clearAuthState = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("Session expired. Please login again.");
  }
  const response = await axios.post(
    `${resolveBaseUrl()}/auth/refresh-token`,
    { refreshToken },
    { timeout: 10000, withCredentials: true },
  );
  const nextToken = response?.data?.data?.token || response?.data?.token;
  const nextRefreshToken = response?.data?.data?.refreshToken || response?.data?.refreshToken;
  if (!nextToken) throw new Error("Unable to refresh session.");
  localStorage.setItem("token", nextToken);
  if (nextRefreshToken) localStorage.setItem("refreshToken", nextRefreshToken);
  return nextToken;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};

    if (!error.response) {
      return Promise.reject(new Error("Network error. Please check your connection and try again."));
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((queueError) => Promise.reject(queueError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        flushQueue(null, token);
        return api(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        clearAuthState();
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
