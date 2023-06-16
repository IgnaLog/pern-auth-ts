import { IUser } from "../models/User";
import { AxiosInstance } from "axios";

export const loadUsers = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
) => {
  return await axiosPrivate.get<IUser[]>("/users", {
    signal,
  });
};
