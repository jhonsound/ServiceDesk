import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getStatusVariant } from "@/lib/utils";
import { Ticket, TicketStatus, UserRole } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "../ui/button";
import TicketTimeline from "./TicketTimeline";

export const TicketComment = ({
  ticket,
  currentUserRole,
  handleStatusChange,
  isLoading,
  error,
  setNewComment,
  newComment,
}: {
  ticket: Ticket;
  currentUserRole: UserRole;
  handleStatusChange: (newStatus: TicketStatus) => void;
  isLoading: boolean;
  error: string | null;
  setNewComment: (newComment: string) => void;
  newComment: string;
}) => {
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

  return (
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
  );
};
