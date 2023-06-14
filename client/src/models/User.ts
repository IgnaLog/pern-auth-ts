export interface IUser {
  username: string;
  roles: {
    User: number;
    Editor: number;
    Admin: number;
  };
  password: string;
  refreshToken: string[];
}
