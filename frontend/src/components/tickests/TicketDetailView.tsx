"use client";

import { useState, useEffect } from "react"; // <--- CAMBIO 1: Importamos useState y useEffect
import {
  Ticket,
  TicketHistory,
  updateTicketStatus,
  UserRole,
} from "../../services/api";
import { useRouter } from "next/navigation";

// Componente para el historial (sin cambios)
function TicketTimeline({ history }: { history: TicketHistory[] }) {
  // ... (el código de este componente se mantiene exactamente igual)
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Historial del Ticket
      </h3>
      <div className="border-l-2 border-gray-200 ml-2">
        {history
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((entry) => (
            <div key={entry.id} className="relative mb-6">
              <div className="absolute -left-[11px] top-1 w-5 h-5 bg-blue-500 rounded-full"></div>
              <div className="ml-8">
                <p className="font-semibold text-gray-700">
                  {entry.user.name}{" "}
                  <span className="text-gray-500 font-normal">
                    ({entry.user.role})
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  {entry.action === "status_change" &&
                    `Cambió el estado de "${entry.old_value}" a "${entry.new_value}"`}
                  {entry.action === "ticket_created" && "Creó el ticket"}
                </p>
                <time className="text-xs text-gray-400">
                  {new Date(entry.created_at).toLocaleString()}
                </time>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// Componente principal
export default function TicketDetailView({
  initialTicket,
}: {
  initialTicket: Ticket;
}) {
  const [ticket, setTicket] = useState(initialTicket);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  
  const isSlaBreached =
    ticket.status !== 'resolved' &&
    ticket.status !== 'closed' &&
    new Date() > new Date(ticket.sla_resolution_target);;

  // --- CAMBIO 2: Usamos useState para el rol del usuario ---
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("agent");

  const handleStatusChange = async (newStatus: Ticket["status"]) => {
    // ... (esta función se mantiene exactamente igual)
    setIsLoading(true);
    setError(null);
    try {
      const updatedTicket = await updateTicketStatus(ticket.id, {
        newStatus,
        version: ticket.version,
      });
      /* setTicket(updatedTicket); */
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Lógica para mostrar botones de acción (AHORA FUNCIONARÁ SIN ERRORES) ---
  const getAvailableActions = () => {
    const actions = [];
    if (currentUserRole === "agent" || currentUserRole === "manager") {
      if (ticket.status === "open")
        actions.push({ label: "Tomar Ticket", newStatus: "in_progress" });
      if (ticket.status === "in_progress")
        actions.push({ label: "Marcar como Resuelto", newStatus: "resolved" });
    }
    if (currentUserRole === "requester" || currentUserRole === "manager") {
      if (ticket.status === "resolved")
        actions.push({ label: "Reabrir Ticket", newStatus: "in_progress" });
    }
    // La acción de cerrar es más general según nuestra matriz
    if (ticket.status === "resolved")
      actions.push({ label: "Cerrar Ticket", newStatus: "closed" });

    return actions;
  };

  return (
    <>
      {/* --- CAMBIO 3: Añadimos un selector de rol para pruebas --- */}
      <div className="max-w-7xl mx-auto mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
        <p className="font-bold mb-2">Panel de Simulación:</p>
        <div className="flex items-center gap-4">
          <span>Viendo como:</span>
          <div className="flex gap-2">
            {(["agent", "requester", "manager"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setCurrentUserRole(role)}
                className={`px-3 py-1 rounded-md text-xs ${
                  currentUserRole === role
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* ... (el resto del JSX se mantiene exactamente igual) ... */}
        {/* Columna principal de detalles */}
        <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {ticket.title}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Solicitado por: {ticket.requester.name} el{" "}
            {new Date(ticket.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-700 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {/* Columna lateral de estado e historial */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Estado y Acciones
            </h3>
            <p className="mb-4">
              Estado actual: <span className="font-bold">{ticket.status}</span>
            </p>
            <div className="space-y-2">
              {getAvailableActions().map((action) => (
                <button
                  key={action.newStatus}
                  onClick={() =>
                    handleStatusChange(action.newStatus as Ticket["status"])
                  }
                  disabled={isLoading}
                  className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
            {isLoading && (
              <p className="text-sm text-center mt-2">Actualizando...</p>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <TicketTimeline history={ticket.history} />
          </div>
        </div>
      </div>
    </>
  );
}
