import { QueryClient } from "@tanstack/react-query";
import { showError } from "../components/Toast";

const isProduction = import.meta.env.PROD;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: isProduction,
      refetchOnReconnect: true,
      throwOnError: false,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        const message = error?.response?.data?.message || error?.message || "Unable to complete request";
        showError(message);
      },
    },
  },
});

