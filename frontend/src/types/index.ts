export enum UserRole {
  Requester = 'requester',
  Agent = 'agent',
  Manager = 'manager',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

// Definimos los tipos de datos que esperamos de la API
// Esto nos da autocompletado y previene errores.
export interface CustomField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  is_required: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  sla_first_response_hours: number;
  sla_resolution_hours: number;
  customFields: CustomField[];
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  sla_first_response_hours: number;
  sla_resolution_hours: number;
  customFields: {
    label: string;
    type: "text" | "textarea" | "select";
    is_required: boolean;
  }[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

import { User, UserRole } from "@/types/user";

export interface RegisterPayload extends LoginPayload {
  name: string;
  role: UserRole;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  categoryId: string;
  customFieldValues: {
    customFieldId: string;
    value: string;
  }[];
}


export interface TicketHistory {
  id: string;
  action: "ticket_created" | "status_change" | "comment_added";
  old_value: string | null;
  new_value: string | null;
  comment: string | null;
  created_at: string;
  user: User;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  created_at: string;
  sla_resolution_target: string;
  version: number;
  requester: User;
  category: Category;
  history: TicketHistory[];
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export interface UpdateTicketStatusPayload {
  newStatus: "open" | "in_progress" | "resolved" | "closed";
  version: number;
}

export interface KpiData {
  openTickets: number;
  ticketsInLast7Days: number;
  slaCompliancePercentage: number;
}