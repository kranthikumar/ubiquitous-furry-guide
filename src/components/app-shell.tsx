"use client";

import { useState } from "react";
import { BottomNav } from "./bottom-nav";
import { Drawer } from "./drawer";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
