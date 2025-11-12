import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { APP_LINKS } from "../constants";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !token) {
    return <Navigate to={APP_LINKS.LOGIN} state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to={APP_LINKS.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;
