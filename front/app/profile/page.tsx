"use client";

import { useAppStoreState } from "@/store/hooks";
import { AtSign, Mail, Calendar, Clock, User } from "lucide-react";

export default function ProfilePage() {
  const user = useAppStoreState((state) => state.auth.user?.userInfo ?? null);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updated = new Date(user.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-[280px_1fr] gap-16">
      {/* Left — identity */}
      <div className="flex flex-col gap-5">
        <div className="w-24 h-24 rounded-full bg-overlay border border-border flex items-center justify-center select-none">
          <User className="w-10 h-10 text-fg-muted" />
        </div>
        <div>
          <h1 className="text-fg font-bold text-xl leading-tight">
            {user.name}
          </h1>
          <p className="text-fg-muted text-sm mt-1">@{user.username}</p>
        </div>
      </div>

      {/* Right — details */}
      <div className="flex flex-col gap-8 pt-1">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-fg-muted font-medium mb-5">
            Account
          </p>
          <div className="flex flex-col divide-y divide-border border-t border-b border-border">
            <Row
              icon={<User className="w-3.5 h-3.5" />}
              label="Name"
              value={user.name}
            />
            <Row
              icon={<AtSign className="w-3.5 h-3.5" />}
              label="Username"
              value={`@${user.username}`}
            />
            <Row
              icon={<Mail className="w-3.5 h-3.5" />}
              label="Email"
              value={user.email}
            />
            <Row
              icon={<Calendar className="w-3.5 h-3.5" />}
              label="Member since"
              value={joined}
            />
            <Row
              icon={<Clock className="w-3.5 h-3.5" />}
              label="Last updated"
              value={updated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 gap-4">
      <div className="flex items-center gap-2.5 text-fg-muted">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span
        className={`text-sm text-fg-secondary font-medium ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
