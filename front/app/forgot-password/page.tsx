"use client";

import { forgotPasswordService } from "@/src/auth/services/auth.services";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  async function onSubmit(data: ForgotPasswordForm) {
    setLoading(true);
    try {
      await forgotPasswordService(data.email);
    } catch {
      // Silent: always show the same confirmation regardless of outcome
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="flex justify-center items-center w-full flex-1">
      <div className="w-full max-w-sm border-2 border-border rounded-md p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold">Forgot your password?</h1>
          <p className="text-fg-muted text-sm mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-green-500">
              If that email is registered, you&apos;ll receive a reset link shortly.
            </p>
            <Link
              href="/auth"
              className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-fg-muted text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", { required: "Email is required" })}
                className="border-2 border-border px-2 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="border-2 border-border px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-500 text-white rounded"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <Link
              href="/auth"
              className="text-sm text-fg-muted hover:text-blue-500 transition-colors text-center"
            >
              Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
