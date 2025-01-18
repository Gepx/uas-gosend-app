import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // If route requires admin access and user is not admin
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
