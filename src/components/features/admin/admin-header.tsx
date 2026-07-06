"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const router = useRouter();

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <header className="flex flex-col gap-4 border-b border-black/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Admin Dashboard
        </p>
        <h1 className="mt-1 font-serif text-3xl font-medium text-text">
          {weddingConfig.couple.displayNames}
        </h1>
        <p className="mt-1 text-sm text-text/60">RSVP responses and guest links</p>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={onLogout}>
        <LogOut />
        Sign out
      </Button>
    </header>
  );
}
