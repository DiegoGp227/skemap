"use client"

import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    console.log("logout")
    localStorage.clear();
    router.push("/auth");
  };

  return logout;
}
