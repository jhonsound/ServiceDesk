"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getTicketById,
  updateTicketStatus,
  addCommentToTicket,
  Ticket,
  TicketHistory,
  UserRole,
  TicketStatus,
} from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "lucide-react";

// --- Sub-componente para renderizar el historial ---
function TicketTimeline({ history }: { history: TicketHistory[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Historial del Ticket
      </h3>
      <div className="border-l-2 border-gray-200 ml-2">
        {history &&
          history
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((entry) => (
              <div key={entry.id} className="relative mb-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 bg-blue-500 rounded-full"></div>
                <div className="ml-8">
                  <p className="font-semibold text-gray-700">
                    {entry.user.name}{" "}
                    <span className="text-gray-500 font-normal">
                      ({entry.user.role})
                    </span>
                  </p>
                  <div className="text-sm text-gray-600">
                    {entry.action === "status_change" &&
                      `Cambió el estado de "${entry.old_value}" a "${entry.new_value}"`}
                    {entry.action === "ticket_created" && "Creó el ticket"}
                    {entry.action === "comment_added" && (
                      <div className="mt-1 p-3 bg-gray-100 rounded-md border">
                        <p className="whitespace-pre-wrap">{entry.comment}</p>
                      </div>
                    )}
                  </div>
                  <time className="text-xs text-gray-400 mt-1 inline-block">
                    {new Date(entry.created_at).toLocaleString()}
                  </time>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

// --- Componente Principal ---
export default function TicketDetailView() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(
    UserRole.AGENT
  );
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (typeof id === "string") {
      const fetchTicket = async () => {
        setIsLoading(true);
        try {
          const data = await getTicketById(id);
          setTicket(data);
        } catch (err) {
          setError("No se pudo cargar el ticket.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchTicket();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: Ticket["status"]) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Capturamos el ticket actualizado que devuelve la API
      const updatedTicket = await updateTicketStatus(ticket!.id, {
        newStatus,
        version: ticket!.version,
      });

      // 2. Actualizamos nuestro estado local con el ticket completo y actualizado
      setTicket(updatedTicket);

      // 3. Ya no necesitamos router.refresh()
      // router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim().length < 5) return;

    setIsLoading(true);
    setError(null);
    try {
      // 1. Capturamos la nueva entrada del historial que devuelve la API
      const newHistoryEntry = await addCommentToTicket(ticket!.id, newComment);

      // 2. Actualizamos el estado local, añadiendo el nuevo comentario al historial existente
      setTicket((prevTicket) => {
        if (!prevTicket) return null;
        return {
          ...prevTicket,
          history: [...prevTicket.history, newHistoryEntry],
        };
      });

      setNewComment(""); // Limpiamos el textarea

      // 3. Ya no necesitamos router.refresh()
      // router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableActions = () => {
    if (!ticket) return [];
    const actions = [];
    if (
      currentUserRole === UserRole.AGENT ||
      currentUserRole === UserRole.MANAGER
    ) {
      if (ticket.status === TicketStatus.OPEN)
        actions.push({
          label: "Tomar Ticket",
          newStatus: TicketStatus.IN_PROGRESS,
        });
      if (ticket.status === TicketStatus.IN_PROGRESS)
        actions.push({
          label: "Marcar como Resuelto",
          newStatus: TicketStatus.RESOLVED,
        });
    }
    if (
      currentUserRole === UserRole.REQUESTER ||
      currentUserRole === UserRole.MANAGER
    ) {
      if (ticket.status === TicketStatus.RESOLVED)
        actions.push({
          label: "Reabrir Ticket",
          newStatus: TicketStatus.IN_PROGRESS,
        });
    }
    if (ticket.status === TicketStatus.RESOLVED)
      actions.push({ label: "Cerrar Ticket", newStatus: TicketStatus.CLOSED });
    return actions;
  };

  if (isLoading && !ticket) {
    return (
      <div className="flex items-center justify-center h-full">
        Cargando detalles del ticket...
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        {error}
      </div>
    );
  }

  if (!ticket) {
    return <div>Ticket no encontrado.</div>;
  }

  const isSlaBreached =
    ticket.status !== TicketStatus.RESOLVED &&
    ticket.status !== TicketStatus.CLOSED &&
    new Date() > new Date(ticket.sla_resolution_target);

  return (
    <>
      <div className="max-w-7xl mx-auto mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
        <p className="font-bold mb-2">Panel de Simulación:</p>
        <div className="flex items-center gap-4">
          <span>Viendo como:</span>
          <div className="flex gap-2">
            {Object.values(UserRole).map((role) => (
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
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              {isSlaBreached && (
                <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                  <p className="font-bold">Atención</p>
                  <p>El SLA de resolución ha sido incumplido.</p>
                </div>
              )}
              <CardTitle className="text-3xl">{ticket.title}</CardTitle>
              <p className="text-sm text-gray-500">
                Solicitado por: {ticket.requester.name} el{" "}
                {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Añadir un Comentario</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddComment} className="space-y-4">
                <Textarea
                  placeholder="Escribe tu comentario aquí..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  type="submit"
                  disabled={isLoading || newComment.trim().length < 5}
                >
                  {isLoading ? "Enviando..." : "Enviar Comentario"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado y Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Estado actual:{" "}
                <Badge
                  variant={ticket.status === "open" ? "default" : "secondary"}
                >
                  {ticket.status}
                </Badge>
              </p>
              <div className="space-y-2">
                {getAvailableActions().map((action) => (
                  <Button
                    key={action.newStatus}
                    onClick={() => handleStatusChange(action.newStatus)}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketTimeline history={ticket.history} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
