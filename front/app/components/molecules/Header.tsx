"use client";

import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLogout } from "@/src/auth/hooks/useLogout";
import { useRouter } from "next/navigation";

export default function Header() {
  const [modal, setModal] = useState(false);
  const [modalPos, setModalPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const logout = useLogout();

  const router = useRouter();

  useEffect(() => {
    if (!modal) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !modalRef.current?.contains(target)
      ) {
        setModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modal]);

  function handleToggle() {
    if (!modal && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setModal((prev) => !prev);
  }

  return (
    <header className="w-full h-16 flex justify-center bg-base/60 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="w-full max-w-7xl flex items-center justify-between px-4">
        <div
          className="items-center justify-center cursor-pointer w-fit"
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src="/skemap_logo_v2.png"
            alt="Skemap logo"
            width={623}
            height={155}
            style={{ height: "44px", width: "auto" }}
          />
        </div>
        <div ref={containerRef}>
          <button
            ref={buttonRef}
            className="border-2 border-border p-2 rounded-full cursor-pointer"
            onClick={handleToggle}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
      {modal &&
        createPortal(
          <div
            ref={modalRef}
            style={{
              position: "fixed",
              top: modalPos.top,
              right: modalPos.right,
              zIndex: 60,
              width: "11rem",
            }}
            className="bg-surface border border-border rounded-lg shadow-xl overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs text-fg-muted font-medium uppercase tracking-wider">
                My account
              </p>
            </div>
            <div className="p-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-fg rounded-md hover:bg-overlay cursor-pointer transition-colors"
                onClick={() => {
                  router.push("/profile");
                }}
              >
                <User className="w-4 h-4 text-fg-muted" />
                Profile
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent-red rounded-md hover:bg-overlay cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
