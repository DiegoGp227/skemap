import { useState, useCallback } from "react";
import { ICreateUserRequest, LoginState } from "../types/auth.types";
import { SignUpService } from "../services/auth.services";

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
      return true;
    } catch (err: any) {
      setState({
        user: null,
        loading: false,
        error: err.response?.data?.code || "UNKNOWN_ERROR",
      });
      return false;
    }
  }, []);

  return { ...state, signup };
}
