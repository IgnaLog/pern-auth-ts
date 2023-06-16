export interface IUser {
  username: string;
  roles: {
    USER: number;
    EDITOR: number;
    ADMIN: number;
  };
  password: string;
  refreshToken: string[];
}
