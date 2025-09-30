"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import Header from "./Header";

// Icons
import { LayoutDashboard, Ticket, LayoutGrid } from "lucide-react";

// Helper para obtener el título basado en la ruta
const getTitleForPath = (path: string) => {
  if (path.startsWith("/tickets/new")) return "Crear Nuevo Ticket";
  if (path.startsWith("/tickets/")) return "Detalles del Ticket";
  if (path.startsWith("/tickets")) return "Dashboard de Soporte";
  if (path.startsWith("/categories")) return "Gestión de Categorías";
  if (path.startsWith("/dashboard")) return "Analytics de Soporte";
  return "Dashboard";
};

// Componente de enlace de navegación reutilizable CON LÓGICA DE ACTIVACIÓN CORREGIDA
const NavLink = ({
  href,
  pathname,
  icon,
  label,
  matchType = "prefix",
}: {
  href: string;
  pathname: string;
  icon: React.ReactNode;
  label: string;
  matchType?: "exact" | "prefix";
}) => {
  const isActive =
    matchType === "exact" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors",
        isActive ? "bg-gray-700" : ""
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getTitleForPath(pathname);
  const { user, logout } = useAuth();

  const navLinks = [
    {
      href: "/tickets",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
      allowedRoles: [UserRole.Requester, UserRole.Agent, UserRole.Manager],
      matchType: "exact",
    },
    {
      href: "/tickets/new",
      label: "Nuevo Ticket",
      icon: <Ticket className="mr-3 h-5 w-5" />,
      allowedRoles: [UserRole.Requester, UserRole.Agent, UserRole.Manager],
      matchType: "exact",
    } /* 
    {
      href: "/dashboard",
      label: "Analytics",
      icon: <BarChart2 className="mr-3 h-5 w-5" />,
      allowedRoles: [UserRole.Agent, UserRole.Manager],
      matchType: "exact",
    }, */,
    {
      href: "/categories",
      label: "Categorías",
      icon: <LayoutGrid className="mr-3 h-5 w-5" />,
      allowedRoles: [UserRole.Manager],
      matchType: "prefix",
    },
  ];

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
