import { useForm } from "react-hook-form";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form action="" className="flex justify-center flex-col w-full gap-5">
      <div className="flex w-full gap-5">
        <div className="flex flex-col flex-1 min-w-0">
          <label htmlFor="name" className="text-fg-muted">Name</label>
          <input
            id="name"
            type="text"
            className="w-full border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
            {...register("name")}
          />
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
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="text-fg-muted">
          Email
        </label>
        <input
          type="email"
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          {...register("email")}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-fg-muted">Password</label>
        <input
          type="password"
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          {...register("password")}
        />
      </div>
      <button
        type="submit"
        className="border-2 border-border px-1 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-500"
      >
        Send
      </button>
    </form>
  );
}
