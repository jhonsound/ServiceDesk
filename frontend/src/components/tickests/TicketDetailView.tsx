"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getTicketById,
  updateTicketStatus,
  addCommentToTicket,
} from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusVariant } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Ticket, TicketHistory, TicketStatus, UserRole } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

// --- Sub-componente para renderizar el historial ---
function TicketTimeline({ history }: { history: TicketHistory[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white  mb-4">
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
                <div className="absolute -left-[11px] top-1 w-5 h-5 bg-gray-700 rounded-full"></div>
                <div className="ml-8">
                  <p className="font-semibold text-white">
                    {entry.user.name}{" "}
                    <span className="text-white font-normal">
                      ({entry.user.role})
                    </span>
                  </p>
                  <div className="text-sm text-white">
                    {entry.action === "status_change" &&
                      `Cambió el estado de "${entry.old_value}" a "${entry.new_value}"`}
                    {entry.action === "ticket_created" && "Creó el ticket"}
                    {entry.action === "comment_added" && (
                      <div className="mt-1 p-3 bg-[#1a1a1a]  rounded-md border">
                        <p className="whitespace-pre-wrap">{entry.comment}</p>
                      </div>
                    )}
                  </div>
                  <time className="text-xs text-white mt-1 inline-block">
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
  const { id } = params;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(
    UserRole.Agent
  );
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (typeof id === "string") {
      const fetchTicket = async () => {
        setIsLoading(true);
        try {
          const data = await getTicketById(id);
          console.log("🚀 ~ fetchTicket ~ data:", data);
          setTicket(data);
        } catch {
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
      await updateTicketStatus(ticket!.id, {
        newStatus,
        version: ticket!.version,
      });

      const freshTicketData = await getTicketById(ticket!.id);
      console.log(
        "🚀 ~ handleStatusChange ~ freshTicketData:",
        freshTicketData
      );

      setTicket(freshTicketData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while changing status.");
      }
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
      const newHistoryEntry = await addCommentToTicket(ticket!.id, newComment);

      setTicket((prevTicket) => {
        if (!prevTicket) return null;
        return {
          ...prevTicket,
          history: [...prevTicket.history, newHistoryEntry],
        };
      });

      setNewComment("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while adding comment.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableActions = () => {
    if (!ticket) return [];
    const actions = [];
    if (
      currentUserRole === UserRole.Agent ||
      currentUserRole === UserRole.Manager
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
      currentUserRole === UserRole.Requester ||
      currentUserRole === UserRole.Manager
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
      <div className="flex items-center justify-center">
        <Spinner className="text-gray-500" variant={"infinite"} size={64} />
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
    <div className="fle m-6">
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
          <Card className="bg-[#242424] border-none shadow-2xl">
            <CardHeader>
              {isSlaBreached && (
                <div className="p-4 mb-4 bg-red-900/50 border-l-4 border-red-500 text-red-300 rounded-r-lg">
                  <p className="font-bold text-red-200">Atención: SLA Incumplido</p>
                  <p>Este ticket ha superado el tiempo objetivo de resolución.</p>
                </div>
              )}
              <CardTitle className="text-3xl text-white">
                {ticket.title}
              </CardTitle>
              <p className="text-sm text-white">
                Solicitado por: {ticket.requester.name} el{" "}
                {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </CardHeader>

            <CardContent className="max-h-[30vh] overflow-y-auto">
              <p className="text-white whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#242424] border-none shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Añadir un Comentario</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddComment} className="space-y-4">
                <Textarea
                  placeholder="Escribe tu comentario aquí..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] text-white bg-[#1a1a1a] border border-gray-700"
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
          <Card className="bg-[#242424] border-none shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Estado y Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white">
                Estado actual:{" "}
                <Badge variant={getStatusVariant(ticket.status)}>
                  {ticket.status.replace("_", " ")}
                </Badge>
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <p>
                  <strong>Objetivo de Resolución:</strong>
                </p>
                <p>
                  {format(
                    new Date(ticket.sla_resolution_target),
                    "d 'de' MMMM, yyyy 'a las' HH:mm",
                    { locale: es }
                  )}
                </p>
              </div>
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
          <Card className="max-h-[50vh] bg-[#242424] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Historial</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[30vh] overflow-y-auto text-white">
              <TicketTimeline history={ticket.history} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
