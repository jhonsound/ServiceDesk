import { TicketStatus } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getStatusVariant = (status: TicketStatus) => {
  switch (status) {
    case 'open':
      return 'default';
    case 'in_progress':
      return 'secondary';
    case 'resolved':
      return 'outline';
    case 'closed':
      return 'destructive';
    default:
      return 'default';
  }
};

export const getTitleForPath = (path: string) => {
  if (path.startsWith("/tickets/new")) return "Crear Nuevo Ticket";
  if (path.startsWith("/tickets/")) return "Detalles del Ticket";
  if (path.startsWith("/tickets")) return "Dashboard de Soporte";
  if (path.startsWith("/categories")) return "Gestión de Categorías";
  if (path.startsWith("/dashboard")) return "Analytics de Soporte";
  return "Dashboard";
};