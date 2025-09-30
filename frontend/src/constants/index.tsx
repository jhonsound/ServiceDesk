import { UserRole } from "@/types";
import { LayoutDashboard, LayoutGrid, Ticket } from "lucide-react";

export const navLinks = [
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
