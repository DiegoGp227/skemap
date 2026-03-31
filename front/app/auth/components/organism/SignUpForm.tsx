import { useSignUp } from "@/src/auth/hooks/useSignUp";
import { ICreateUserRequest } from "@/src/auth/types/auth.types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateUserRequest>();

  const { error, loading, signup } = useSignUp();

  const router = useRouter();

  const onSubmit = async (data: ICreateUserRequest) => {
    const success = await signup(data);

    if (success) {
      router.push("/");
    }
  };

  return (
    <form
      action=""
      className="flex justify-center flex-col w-full gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full gap-5">
        <div className="flex flex-col flex-1 min-w-0">
          <label htmlFor="name" className="text-fg-muted">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
            {...register("name")}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <label htmlFor="userName" className="text-fg-muted">
            UserName
          </label>
          <input
            id="userName"
            type="text"
            className="w-full border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
            {...register("username")}
            disabled={loading}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="text-fg-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          {...register("email")}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-fg-muted">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          {...register("password")}
          disabled={loading}
        />
      </div>

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
