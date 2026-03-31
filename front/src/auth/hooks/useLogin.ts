import { useState, useCallback } from "react";
import { ICredentials, LoginState } from "../types/auth.types";
import { loginService } from "../services/auth.services";
import { AxiosError } from "axios";

export function useLogin() {
  const [state, setState] = useState<LoginState>({
    user: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (payload: ICredentials): Promise<boolean> => {
    setState({ user: null, loading: true, error: null });
    try {
      const user = await loginService(payload);
      localStorage.setItem("token", user.token);
      setState({ user: user.userInfo, loading: false, error: null });
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ code: string }>;
      setState({
        user: null,
        loading: false,
        error: axiosError.response?.data?.code ?? "UNKNOWN_ERROR",
      });
      return false;
    }
  }, []);

  return { ...state, login };
}
