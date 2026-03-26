"use client";

import { useState } from "react";
import SelectAuthSistem from "../molecules/SelectSistem";
import LoginForm from "./LoginForm";

export default function AuthSistem() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="bg-base w-full p-5 flex flex-col justify-evenly">
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
              <h2 className="font-bold text-3xl">Register</h2>
              <p>Continue where you left off.</p>
            </>
          )}
        </div>
        {isLogin ? <LoginForm /> : <div>register</div>}
      </div>
    </div>
  );
}
