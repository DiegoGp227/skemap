import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "Reset your Skemap password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your Skemap password. Click the button below to set a new one.</p>
        <a
          href="${resetLink}"
          style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;"
        >
          Reset password
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:14px;">
          This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
