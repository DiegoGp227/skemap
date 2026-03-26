import { useForm } from "react-hook-form";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form action="" className="flex justify-center flex-col w-full">
      <div className="flex w-full gap-2">
        <div className="flex flex-col flex-1 min-w-0">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="w-full border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <label htmlFor="user">UserName</label>
          <input
            id="user"
            type="text"
            className="w-full border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
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
