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
  customFields: CustomField[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
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

export interface User {
  id: string;
  name: string;
  role: UserRole;
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
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  sla_resolution_target: string;
  version: number;
  requester: User;
  category: Category;
  history: TicketHistory[];
}

export enum UserRole {
  REQUESTER = "requester",
  AGENT = "agent",
  MANAGER = "manager",
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

// URL base de tu API de NestJS
const API_BASE_URL = "http://localhost:5000"; // Asegúrate de que el puerto sea correcto

// --- NUEVA FUNCIÓN AUXILIAR ---
// Esta función nos ayudará a obtener las cabeceras de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Formato estándar para JWT
  };
};

/**
 * Registra un nuevo usuario.
 * El payload debe coincidir con el CreateUserDto del backend.
 */
export const registerUser = async (payload: any): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al registrar el usuario");
  }
  return response.json();
};

/**
 * Inicia sesión de un usuario.
 * El payload debe coincidir con el LoginDto del backend.
 */
export const loginUser = async (payload: any): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Credenciales inválidas");
  }
  return response.json();
};

/**
 * Obtiene todas las categorías desde el backend.
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

export const getTickets = async (): Promise<Ticket[]> => {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    headers: getAuthHeaders(), // <-- AÑADIMOS LAS CABECERAS
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return response.json();
};

export const getTicketById = async (id: string): Promise<Ticket> => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    headers: getAuthHeaders(), // <-- AÑADIMOS LAS CABECERAS
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket with id: ${id}`);
  }
  return response.json();
};

export const updateTicketStatus = async (
  id: string,
  payload: UpdateTicketStatusPayload
): Promise<Ticket> => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(), // <-- AÑADIMOS LAS CABECERAS
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Lanzamos el mensaje de error específico del backend (ej: "Conflict")
    throw new Error(errorData.message || "Failed to update ticket status");
  }

  return response.json();
};

/**
 * Envía los datos de un nuevo ticket al backend.
 * @param ticketData - Los datos del ticket a crear.
 */
export const createTicket = async (
  ticketData: CreateTicketPayload
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: "POST",
    headers: getAuthHeaders(), // <-- AÑADIMOS LAS CABECERAS
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    // Si hay un error, intentamos leer el mensaje del backend
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create ticket");
  }

  return response.json();
};

/**
 * Obtiene los datos de KPIs para el dashboard.
 */
export const getKpis = async (): Promise<KpiData> => {
  const response = await fetch(`${API_BASE_URL}/dashboard/kpis`, {
    headers: getAuthHeaders(), // <-- AÑADIMOS LAS CABECERAS
  });
  if (!response.ok) {
    throw new Error("Failed to fetch KPI data");
  }
  return response.json();
};
