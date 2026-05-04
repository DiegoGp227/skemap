import { useLogin } from "@/src/auth/hooks/useLogin";
import { ICredentials } from "@/src/auth/types/auth.types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const DEMO_CREDENTIALS: ICredentials = {
  email: "demo@skemap.dev",
  password: "demo1234",
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentials>();
  const { user, error, loading, login } = useLogin();

  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  return (
    <form
      onSubmit={handleSubmit(login)}
      className="flex justify-center flex-col gap-6"
    >
      <div className="flex flex-col">
        <label htmlFor="email" className="text-fg-muted">
          Email
        </label>
        <input
          type="text"
          id="email"
          {...register("email")}
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          disabled={loading}
        />
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-fg-muted">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          disabled={loading}
        />
        <Link href="/forgot-password" className="text-xs text-fg-muted hover:text-blue-500 transition-colors self-end mt-1">
          Forgot password?
        </Link>
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="button"
        onClick={() => login(DEMO_CREDENTIALS)}
        disabled={loading}
        className="flex items-center justify-center gap-2 border-2 border-blue-600 px-1 py-2 bg-base hover:bg-gray-900 transition-all duration-500 rounded font-semibold text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z"
            clipRule="evenodd"
          />
        </svg>
        Start Demo
      </button>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 border-2 border-border px-1 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-500 text-white"
        disabled={loading}
      >
        {loading ? "Loading..." : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
            </svg>
            Send
          </>
        )}
      </button>
    </form>
  );
}
