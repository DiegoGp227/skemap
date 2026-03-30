// hooks/useLogin.ts
import { useState, useCallback } from "react";
import { ICredentials, IUserInfo } from "../types/auth.types";
import { loginService } from "../services/auth.services";

interface LoginState {
  user: IUserInfo | null;
  loading: boolean;
  error: string | null;
}

export function useLogin() {
  const [state, setState] = useState<LoginState>({
    user: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (payload: ICredentials) => {
    setState({ user: null, loading: true, error: null });
    try {
      const user = await loginService(payload);
      localStorage.setItem("token", user.token);
      setState({ user: user.userInfo, loading: false, error: null });
    } catch (err) {
      setState({ user: null, loading: false, error: (err as Error).message });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({ user: null, loading: false, error: null });
  }, []);

  return { ...state, login, logout };
}
