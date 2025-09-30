"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Ticket, LogOut, LayoutGrid } from "lucide-react"; // Iconos
import { usePathname } from "next/navigation";
import Header from "./Header";
import { cn } from "@/lib/utils";

// Helper para obtener el título basado en la ruta
const getTitleForPath = (path: string) => {
  if (path.startsWith("/tickets/new")) return "Crear Nuevo Ticket";
  if (path.startsWith("/tickets/")) return "Detalles del Ticket";
  if (path.startsWith("/tickets")) return "Dashboard de Soporte";
  if (path.startsWith("/categories")) return "Gestión de Categorías";
  // Añade más rutas aquí si es necesario
  return "Dashboard";
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  console.log("🚀 ~ AppLayout ~ pathname:", pathname);
  const title = getTitleForPath(pathname);

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Barra Lateral */}
      <Header title={title} />
      <div className="flex flex-1">
        <aside className="w-64 bg-[#242424]  text-white flex flex-col p-4">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/tickets"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors",
                pathname === "/tickets" ? "bg-gray-700" : ""
              )}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/tickets/new"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors",
                pathname === "/tickets/new" ? "bg-gray-700" : ""
              )}
            >
              <Ticket className="mr-3 h-5 w-5" />
              Nuevo Ticket
            </Link>
            
            <Link
              href="/categories"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors",
                pathname.startsWith("/categories") ? "bg-gray-700" : ""
              )}
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              Categorías
            </Link>
          </nav>
         
        </aside>

        <main className="flex-1 flex items-center justify-center overflow-y-auto bg-[#1a1a1a]">
          {children}
        </main>
      </div>
    </div>
  );
}
