import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <Loader text="Authorizing..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
