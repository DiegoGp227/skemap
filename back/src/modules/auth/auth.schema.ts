import { z } from "zod";

/* =========================
   Base schemas
========================= */

const emailSchema = z.string().email();

const passwordSchema = z.string().min(8);

const nameSchema = z.string().min(1);

const usernameSchema = z.string().min(3);

/* =========================
   Login
========================= */

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/* =========================
   Signup
========================= */

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  username: usernameSchema,
});

/* =========================
   Types
========================= */

/* =========================
   Forgot Password
========================= */

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/* =========================
   Reset Password
========================= */

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

/* =========================
   Types
========================= */

export type LoginDTO = z.infer<typeof loginSchema>;
export type SignupDTO = z.infer<typeof signupSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
