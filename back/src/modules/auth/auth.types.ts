export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
