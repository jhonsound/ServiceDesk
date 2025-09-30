"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getTicketById,
  updateTicketStatus,
  addCommentToTicket,
} from "@/services/api";

import { Ticket, TicketHistory, TicketStatus, UserRole } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { TicketDetailTitle } from "./TicketDetailTitle";
import { TicketComment } from "./TicketComment";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <TicketDetailTitle
          ticket={ticket}
          isSlaBreached={isSlaBreached}
          isLoading={isLoading}
          newComment={newComment}
          handleAddComment={handleAddComment}
          setNewComment={setNewComment}
        />

        <TicketComment
          ticket={ticket}
          currentUserRole={currentUserRole}
          handleStatusChange={handleStatusChange}
          isLoading={isLoading}
          error={error}
          setNewComment={setNewComment}
          newComment={newComment}
        />
      </div>
    </div>
  );
}
