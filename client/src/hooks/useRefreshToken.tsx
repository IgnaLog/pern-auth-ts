import { refreshRequest } from "../api/authService";
import { useAuthStore } from "../store/authStore";

const useRefreshToken = () => {
  const { setAuth } = useAuthStore();

  const refresh = async () => {
    const response = await refreshRequest();
    setAuth({ accessToken: response.data.accessToken });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
