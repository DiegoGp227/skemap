import { useForm } from "react-hook-form";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  function test(data: any) {
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(test)}
      className="flex justify-center flex-col gap-6"
    >
      <div className="flex flex-col">
        <label htmlFor="email" className="text-fg-muted">Email</label>
        <input
          type="text"
          id="email"
          {...register("one")}
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-fg-muted">Password</label>
        <input
          type="password"
          id="password"
          {...register("two")}
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
        />
      </div>
      <button type="submit" className="border-2 border-border px-1 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-500">
        Send
      </button>
    </form>
  );
}
