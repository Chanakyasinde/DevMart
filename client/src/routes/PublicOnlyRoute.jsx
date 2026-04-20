import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/common/Loader";

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader text="Preparing your account..." />;
  }

  if (isAuthenticated) {
    const destination = location.state?.from || "/";
    return <Navigate to={destination} replace />;
  }

  return children;
}
