import { createContext, useCallback, useEffect, useReducer } from "react";
import { getMe, login as loginApi } from "../api/auth.api";

export const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  isAuthenticated: Boolean(localStorage.getItem("token")),
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.user?.role || action.payload.role,
      };
    case "AUTH_LOGOUT":
      return {
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "AUTH_DONE":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const persistAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  const login = async (credentials) => {
    dispatch({ type: "AUTH_LOADING" });
    const response = await loginApi(credentials);
    const payload = response.data;
    persistAuth(payload.token, payload.user);
    dispatch({ type: "AUTH_SUCCESS", payload });
    return response;
  };

  const logout = useCallback(() => {
    clearAuth();
    dispatch({ type: "AUTH_LOGOUT" });
    window.location.href = "/login";
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({ type: "AUTH_DONE" });
      return;
    }
    dispatch({ type: "AUTH_LOADING" });
    try {
      const response = await getMe();
      const user = response.data;
      persistAuth(token, user);
      dispatch({ type: "AUTH_SUCCESS", payload: { token, user } });
    } catch (_error) {
      clearAuth();
      dispatch({ type: "AUTH_LOGOUT" });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
