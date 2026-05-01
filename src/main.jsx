import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { queryClient } from "./lib/queryClient";
import SkeletonThemeProvider from "./components/skeleton/SkeletonThemeProvider";
import "./styles/index.css";

const ReactQueryDevtools =
  import.meta.env.DEV
    ? React.lazy(() =>
        import("@tanstack/react-query-devtools").then((module) => ({
          default: module.ReactQueryDevtools,
        })),
      )
    : null;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SkeletonThemeProvider>
          <AuthProvider>
            <App />
            <Toaster position="top-right" />
            {import.meta.env.DEV && ReactQueryDevtools ? (
              <React.Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} />
              </React.Suspense>
            ) : null}
          </AuthProvider>
        </SkeletonThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
