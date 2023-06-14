import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import jwt_decode from "jwt-decode";

type Props = {
  allowedRoles: Number[];
};

const RequireAuth = ({ allowedRoles }: Props) => {
  const { accessToken, user } = useAuthStore();
  const location = useLocation();

  const decoded: any = accessToken ? jwt_decode(accessToken) : undefined;
  const roles: Number[] = decoded?.userInfo?.roles || [];

  return roles.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
