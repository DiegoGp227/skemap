"use client";

import { useState } from "react";
import SelectAuthSistem from "../molecules/SelectSistem";
import LoginForm from "./LoginForm";

export default function AuthSistem() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="bg-base w-full p-5">
      <div className="gap-20 flex w-full justify-center">
        <SelectAuthSistem isLogin={isLogin} setIsLogin={setIsLogin}/>
      </div>
      <div className="text-shadow-priority-medium">
        {isLogin ? <LoginForm /> : <div>register</div>}
      </div>
    </div>
  );
}
