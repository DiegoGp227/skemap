import Image from "next/image";
import { User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full h-16 flex justify-center bg-base">
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

        <button className="border-2 border-border p-2 rounded-full">
          <User className="w-10 h-10" />
        </button>
      </div>
    </header>
  );
}
