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