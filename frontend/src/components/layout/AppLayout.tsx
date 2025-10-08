"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { getTitleForPath } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import { navLinks } from "@/constants";
import NavLink from "./NavLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getTitleForPath(pathname);
  const { user, logout } = useAuth();

  const filteredNavLinks = navLinks.filter(
    (link) => user && link.allowedRoles.includes(user.role)
  );

  return (
    <div className="min-h-screen flex  flex-col bg-[#1a1a1a]">
      <Header title={title} />
      <div className="flex flex-1 fle">
        <aside className="w-64 bg-[#242424] text-white flex flex-col p-4 justify-between">
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
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                      alt={user?.name}
                    />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 flex items-center justify-center overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
