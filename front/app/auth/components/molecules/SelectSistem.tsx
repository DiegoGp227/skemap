interface ISelectAuthSistemProps {
    setIsLogin : (state: boolean)=> void;
    isLogin: boolean
}

export default function SelectAuthSistem({setIsLogin, isLogin} : ISelectAuthSistemProps) {
  return (
    <div className="bg-surface  flex p-1 rounded gap-2">
      <button
        onClick={() => {
          setIsLogin(true);
        }}
        className={`${isLogin ? "bg-border" : ""} justify-center flex items-center p-1 rounded`}
      >
        Login
      </button>
      <button
        onClick={() => {
          setIsLogin(false);
        }}
        className={`${isLogin ? "" : "bg-border"} justify-center flex items-center p-1 rounded`}
      >
        Register
      </button>
    </div>
  );
}
