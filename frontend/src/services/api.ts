// Definimos los tipos de datos que esperamos de la API
// Esto nos da autocompletado y previene errores.
export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  is_required: boolean;
}

export interface Category {
  id:string;
  name: string;
  customFields: CustomField[];
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
  role: 'requester' | 'agent' | 'manager';
}

export interface TicketHistory {
  id: string;
  action: 'ticket_created' | 'status_change' | 'comment_added';
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
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  version: number;
  requester: User;
  category: Category;
  history: TicketHistory[];
}

export type UserRole = 'requester' | 'agent' | 'manager';

export interface UpdateTicketStatusPayload {
  newStatus: 'open' | 'in_progress' | 'resolved' | 'closed';
  version: number;
}

// URL base de tu API de NestJS
const API_BASE_URL = 'http://localhost:5000'; // Asegúrate de que el puerto sea correcto

/**
 * Obtiene todas las categorías desde el backend.
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};


export const getTickets = async (): Promise<Ticket[]> => {
  const response = await fetch(`${API_BASE_URL}/tickets`);
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  return response.json();
};

export const getTicketById = async (id: string): Promise<Ticket> => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket with id: ${id}`);
  }
  return response.json();
};

export const updateTicketStatus = async (id: string, payload: UpdateTicketStatusPayload): Promise<Ticket> => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Lanzamos el mensaje de error específico del backend (ej: "Conflict")
    throw new Error(errorData.message || 'Failed to update ticket status');
  }

  return response.json();
};

/**
 * Envía los datos de un nuevo ticket al backend.
 * @param ticketData - Los datos del ticket a crear.
 */
export const createTicket = async (ticketData: CreateTicketPayload): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
        // Si hay un error, intentamos leer el mensaje del backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create ticket');
    }

    return response.json();
};