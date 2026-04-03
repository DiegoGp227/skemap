import { useState, useCallback } from "react";
import { ICredentials, LoginState } from "../types/auth.types";
import { loginService } from "../services/auth.services";
import { useAppStoreActions } from "@/store/hooks";
import { AxiosError } from "axios";

export function useLogin() {
  const [state, setState] = useState<LoginState>({
    user: null,
    loading: false,
    error: null,
  });

  // Acción del store global para persistir la sesión en localStorage via easy-peasy
  const setAuth = useAppStoreActions((actions) => actions.auth.setAuth);

  const login = useCallback(async (payload: ICredentials) => {
    setState({ user: null, loading: true, error: null });
    try {
      const response = await loginService(payload);

      // Guardamos la respuesta completa en el store global (token + userInfo).
      // El persist de easy-peasy sincroniza esto con localStorage automáticamente.
      setAuth(response);

      // Guardamos el token por separado bajo la key "token" para que
      // el interceptor de apiClient pueda leerlo directamente.
      localStorage.setItem("token", response.token);

      setState({ user: response.userInfo, loading: false, error: null });
    } catch (err) {
      const axiosError = err as AxiosError<{ code: string }>;
      setState({
        user: null,
        loading: false,
        error: axiosError.response?.data?.code ?? "UNKNOWN_ERROR",
      });
    }
  }, [setAuth]);

  return { ...state, login };
}
