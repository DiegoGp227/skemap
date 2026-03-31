import { useLogin } from "@/src/auth/hooks/useLogin";
import { ICredentials } from "@/src/auth/types/auth.types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentials>();
  const { error, loading, login } = useLogin();

  const router = useRouter();

  const onSubmit = async (data: ICredentials) => {
    const success = await login(data);

    if (success) {
      router.push("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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

      <div className="flex flex-col">
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
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="border-2 border-border px-1 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-500"
        disabled={loading}
      >
        {loading ? "loading..." : "send"}
      </button>
    </form>
  );
}
