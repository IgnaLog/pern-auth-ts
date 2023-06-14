import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import useRefreshToken from "../../hooks/useRefreshToken";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const effectRan = useRef(false);
  const refresh = useRefreshToken();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (effectRan.current === true || import.meta.env.PROD) {
      const verifyRefreshToken = async () => {
        try {
          await refresh();
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      // Avoids unwanted call to verifyRefreshToken
      !accessToken ? verifyRefreshToken() : setIsLoading(false);
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
