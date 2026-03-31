import { postFetcher } from "@/utils/utils";
import {
  IAuthResponse,
  ICreateUserRequest,
  ICredentials,
} from "../types/auth.types";
import { LoginURL, SignUp } from "@/src/shared/constants/urls";

export function loginService(
  credentials: ICredentials,
): Promise<IAuthResponse> {
  const url = LoginURL.toString();
  const response = postFetcher<IAuthResponse>(url, {
    email: credentials.email,
    password: credentials.password,
  });
  return response;
}

export function SignUpService(
  credentials: ICreateUserRequest,
): Promise<IAuthResponse> {
  const url = SignUp.toString();
  const response = postFetcher<IAuthResponse>(url, {
    email: credentials.email,
    password: credentials.password,
    username: credentials.username,
    name: credentials.name,
  });
  return response;
}
