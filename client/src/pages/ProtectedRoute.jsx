import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { axiosPrivate } from "../api/api";
import { API_ENDPOINTS, APP_LINKS, ROLES } from "../constants";
import LoadingSpinner from "../components/Forms/LoadingSpinner";
import { logout } from "../features/authSlice";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosPrivate.get(API_ENDPOINTS.CURRENT_USER);
        setUser(res.data); // includes role.name
      } catch (err) {
        dispatch(logout()); // Token invalid or expired
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token, dispatch]);

  if (loading) {
    return <LoadingSpinner style={{ width: "2rem", height: "2rem" }} />;
  }

  // Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to={APP_LINKS.LOGIN} state={{ from: location }} replace />;
  }

  // User does not have the required role → redirect to default page
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role?.name)) {
    // If a normal user tries to access dashboard
    if (user.role?.name === ROLES.USER) {
      return <Navigate to="/" replace />; // redirect to e-commerce site
    }
    // If someone unauthorized
    return <Navigate to={APP_LINKS.LOGIN} />;
  }

  return children;
};

export default ProtectedRoute;
