import { postFetcher } from "@/utils/utils";
import {
  IAuthResponse,
  ICreateUserRequest,
  ICredentials,
} from "../types/auth.types";
import { LoginURL, SignUpURL, ForgotPasswordURL, ResetPasswordURL } from "@/src/shared/constants/urls";

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
  const url = SignUpURL.toString();
  const response = postFetcher<IAuthResponse>(url, {
    email: credentials.email,
    password: credentials.password,
    username: credentials.username,
    name: credentials.name,
  });
  return response;
}

export function forgotPasswordService(email: string): Promise<{ message: string }> {
  return postFetcher<{ message: string }>(ForgotPasswordURL.toString(), { email });
}

export function resetPasswordService(token: string, password: string): Promise<{ message: string }> {
  return postFetcher<{ message: string }>(ResetPasswordURL.toString(), { token, password });
}
