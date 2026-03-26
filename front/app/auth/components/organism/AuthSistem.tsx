"use client";

import { useState } from "react";
import SelectAuthSistem from "../molecules/SelectSistem";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function AuthSistem() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="bg-base flex-1 p-5 flex flex-col justify-evenly">
      <div className="gap-20 flex w-full justify-center">
        <SelectAuthSistem isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
      <div className="text-shadow-priority-medium p-5 flex flex-col gap-7">
        <div className="w-full flex flex-col items-center">
          {isLogin ? (
            <>
              <h2 className="font-bold text-3xl">Welcome back</h2>
              <p className="text-fg-muted">Continue where you left off.</p>
            </>
          ) : (
            <>
              <h2 className="font-bold text-3xl">Create an account</h2>
              <p>Get started today, for free.</p>
            </>
          )}
        </div>
        {isLogin ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
