import Image from "next/image";
import Logo from "../../../../public/skemap_logo_v2.png";

export default function InfoSection() {
  return (
    <div className="relative hidden md:flex h-full w-[42%] shrink-0 flex-col justify-between overflow-hidden border-r border-[#21262d] bg-[linear-gradient(145deg,#0f1923_0%,#0a1628_50%,#0d1117_100%)] p-12 after:absolute after:-right-20 after:-top-20 aafter:w-60 after:h-60 after:rounded-full after:bg-[radial-gradient(circle,#4a9eff1a_0%,transparent_65%)] after:content-['']">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff04 1px, transparent 1px), linear-gradient(90deg, #ffffff04 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        <Image src={Logo} alt="Logo Skemap" width={240} priority />
      </div>

      <div className="relative z-10 space-y-4">
        <h2 className="text-3xl font-bold text-white leading-tight">
          You always know what the next step is.
        </h2>
        <p className="text-lg text-slate-400">
          Structure your ideas into projects, epics, and tasks. Simple, fast,
          yours.
        </p>
      </div>

      <div className="relative z-10">
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Projects with epics and tasks
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Real-time visual progress
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Priorities, statuses, and dates
          </li>
        </ul>
      </div>
    </div>
  );
}
