import Image from "next/image";
import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ModalLogout from "./ModalLogout";

export default function Header() {
  const [modal, setModal] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setModal(false);
      }
    }
    if (modal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modal]);

  return (
    <header className="w-full h-16 flex justify-center bg-base/60 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="w-full max-w-7xl flex items-center justify-between px-4">
        <div className="items-center justify-center">
          <Image
            src="/skemap_logo_v2.png"
            alt="Skemap logo"
            width={300}
            height={120}
            className="object-contain"
          />
        </div>
        <div className="relative" ref={containerRef}>
          <button
            className="border-2 border-border p-2 rounded-full cursor-pointer"
            onClick={() => setModal((prev) => !prev)}
          >
            <User className="w-6 h-6" />
          </button>
          {modal && <ModalLogout />}
        </div>
      </div>
    </header>
  );
}
