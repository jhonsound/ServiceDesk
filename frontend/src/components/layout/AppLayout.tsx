"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { getTitleForPath } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import { navLinks } from "@/constants";
import NavLink from "./NavLink";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getTitleForPath(pathname);
  const { user } = useAuth();

  const filteredNavLinks = navLinks.filter(
    (link) => user && link.allowedRoles.includes(user.role)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a]">
      <Header title={title} />
      <div className="flex flex-1">
        <aside className="w-64 bg-[#242424] text-white flex flex-col p-4">
          {/* Navegación Principal */}
          <nav className="flex flex-col space-y-2">
            {filteredNavLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                pathname={pathname}
                icon={link.icon}
                label={link.label}
                matchType={link.matchType as "exact" | "prefix"}
              />
            ))}
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 flex items-center justify-center overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
