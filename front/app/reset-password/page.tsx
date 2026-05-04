"use client";

import { resetPasswordService } from "@/src/auth/services/auth.services";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  async function onSubmit(data: ResetPasswordForm) {
    if (!token) {
      setError("Missing reset token. Please request a new link.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetPasswordService(token, data.password);
      router.push("/auth");
    } catch {
      setError("Invalid or expired reset link. Please request a new one.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-red-500 text-sm">Invalid reset link.</p>
        <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-fg-muted text-sm">
          New password
        </label>
        <input
          type="password"
          id="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          })}
          className="border-2 border-border px-2 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          disabled={loading}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-fg-muted text-sm">
          Confirm password
        </label>
        <input
          type="password"
          id="confirmPassword"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (val) => val === watch("password") || "Passwords do not match",
          })}
          className="border-2 border-border px-2 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="border-2 border-border px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-500 text-white rounded"
      >
        {loading ? "Updating..." : "Set new password"}
      </button>

      <Link
        href="/auth"
        className="text-sm text-fg-muted hover:text-blue-500 transition-colors text-center"
      >
        Back to login
      </Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center items-center w-full flex-1">
      <div className="w-full max-w-sm border-2 border-border rounded-md p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold">Set a new password</h1>
          <p className="text-fg-muted text-sm mt-1">
            Enter your new password below.
          </p>
        </div>
        <Suspense fallback={<p className="text-fg-muted text-sm">Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
