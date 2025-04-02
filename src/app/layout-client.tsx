/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

interface LayoutClientProps {
  children: ReactNode;
  user: any | null;
}

export default function LayoutClient({ children, user }: LayoutClientProps) {
  const pathname = usePathname();

  // Déterminer si nous sommes sur une route d'authentification
  const isAuthRoute =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/auth/confirm") ||
    pathname?.startsWith("/error");

  // Déterminer quelle mise en page utiliser
  const isAuthenticated = !!user;
  const showSidebar = isAuthenticated && !isAuthRoute;

  if (!showSidebar) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
