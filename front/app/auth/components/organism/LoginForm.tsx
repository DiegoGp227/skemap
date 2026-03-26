import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, clearErrors, handleSubmit } = useForm();
  function test(data: any) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(test)}>
      <input
        type="text"
        {...register("one")}
        className="border-2 border-border"
      />
      <input
        type="text"
        {...register("two")}
        className="border-2 border-border"
      />
      <input
        type="text"
        {...register("three")}
        className="border-2 border-border"
      />
      <button type="submit" className="border-2 border-border w-5 h-5"></button>
    </form>
  );
}
