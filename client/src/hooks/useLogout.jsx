import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { axiosPrivate } from "../api/api";
import { API_ENDPOINTS, APP_LINKS } from "../constants";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: Call backend logout endpoint to invalidate token
      await axiosPrivate.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear Redux state and localStorage
      dispatch(logout());

      // Redirect to login page
      navigate(APP_LINKS.LOGIN, { replace: true });
    }
  };

  return handleLogout;
};
