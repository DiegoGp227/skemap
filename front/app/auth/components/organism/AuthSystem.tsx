"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SelectAuthSystem from "../molecules/SelectSystem";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const variants = {
  enter: (toLogin: boolean) => ({
    x: toLogin ? -40 : 40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (toLogin: boolean) => ({
    x: toLogin ? 40 : -40,
    opacity: 0,
  }),
};

export default function AuthSystem() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="bg-base flex-1 p-5 flex flex-col justify-evenly">
      <div className="gap-20 flex w-full justify-center">
        <SelectAuthSystem isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
      <div className="text-shadow-priority-medium p-5 flex flex-col gap-7 overflow-hidden">
        <AnimatePresence mode="wait" custom={isLogin}>
          <motion.div
            key={isLogin ? "login" : "signup"}
            custom={isLogin}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-7"
          >
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
