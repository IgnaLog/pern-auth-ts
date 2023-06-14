import { useAuthStore } from "../store/authStore";
import { logoutRequest } from "../api/authService";

const useLogout = () => {
  const { clearAuth } = useAuthStore();

  const logout = async () => {
    clearAuth();
    try {
      await logoutRequest();
    } catch (err) {
      console.error(err);
    }
  };
  return logout;
};

export default useLogout;
