export const BaseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/";

export const LoginURL = new URL("login", BaseURL);
