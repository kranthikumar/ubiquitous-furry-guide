"use client";

import { useState } from "react";
import type { ChannelBadge } from "@/lib/types";
import { BottomNav } from "./bottom-nav";
import { Drawer } from "./drawer";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({
  children,
  followed,
  guest,
}: {
  children: React.ReactNode;
  followed: ChannelBadge[];
  guest: ChannelBadge;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onMenuClick={() => setMenuOpen(true)} guest={guest} />
      <div className="flex flex-1">
        <Sidebar followed={followed} />
        <main className="min-w-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        followed={followed}
      />
    </div>
  );
}
