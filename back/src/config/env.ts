function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  JWT_SECRET:       requireEnv("JWT_SECRET"),
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION ?? "1h",
  RESEND_API_KEY:   requireEnv("RESEND_API_KEY"),
  FRONTEND_URL:     requireEnv("FRONTEND_URL"),
  EMAIL_FROM:       requireEnv("EMAIL_FROM"),
};
