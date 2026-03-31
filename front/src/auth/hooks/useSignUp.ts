import { useState, useCallback } from "react";
import { ICreateUserRequest, LoginState } from "../types/auth.types";
import { SignUpService } from "../services/auth.services";
import { AxiosError } from "axios";

export function useSignUp() {
  const [state, setState] = useState<LoginState>({
    user: null,
    loading: false,
    error: null,
  });

  const signup = useCallback(async (payload: ICreateUserRequest) => {
    setState({ user: null, loading: true, error: null });
    try {
      const user = await SignUpService(payload);
      localStorage.setItem("token", user.token);
      setState({ user: user.userInfo, loading: false, error: null });
    } catch (err) {
      const axiosError = err as AxiosError<{ code: string }>;
      setState({
        user: null,
        loading: false,
        error: axiosError.response?.data?.code ?? "UNKNOWN_ERROR",
      });
    }
  }, []);

  return { ...state, signup };
}
