import { postFetcher } from "@/utils/utils";
import { IAuthResponse, ICredentials } from "../types/auth.types";
import { LoginURL } from "@/src/shared/constants/urls";

export function login(credentials: ICredentials): Promise<IAuthResponse> {
  const url = LoginURL.toString();
  const response = postFetcher<IAuthResponse>(
    url,
    { email: credentials.email, password: credentials.password },
  );
  return response;
}
