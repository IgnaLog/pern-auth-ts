import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IUser } from "../models/User";

export const loadUsers = async (signal: AbortSignal) => {
  const axiosPrivate = useAxiosPrivate();

  return await axiosPrivate.get<IUser[]>("/users", {
    signal,
  });
};
