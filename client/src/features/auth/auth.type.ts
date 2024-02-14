type UserRole = "guest" | "admin" | "support";

export interface IUser {
  _id: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface ITokens {
  refresh_token: string;
  access_token: string;
}

export interface ISignUpReq {
  username: string;
  password: string;
  role?: UserRole;
}

export interface ISignUpRes {
  _id: string;
  username: string;
  role: UserRole;
}

export interface ISignInReq {
  username: string;
  password: string;
}

export interface ISignInRes {
  user: Pick<IUser, "_id" | "username" | "role">;
  tokens: ITokens;
}

export interface IRefreshTokensRes {
  user: Pick<IUser, "_id" | "username" | "role">;
  tokens: ITokens;
}

export interface IError {
  error: string;
}

export interface IAuthState {
  user: Pick<IUser, "_id" | "username" | "role">;
  tokens: ITokens;
  errors: IError;
  is_auth: boolean;
  loading: boolean;
}
