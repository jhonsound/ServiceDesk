import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MoreHorizontal } from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStatusVariant } from "@/lib/utils";
import { Ticket } from "@/types";
import { deleteTickets } from "@/services/api";
import { Checkbox } from "@/components/ui/checkbox";

const TableTicket = ({ tickets, setTickets }: { tickets: Ticket[], setTickets: React.Dispatch<React.SetStateAction<Ticket[]>> }) => {
  const router = useRouter();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedTickets(tickets.map((ticket) => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelect = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets((prev) => [...prev, ticketId]);
    } else {
      setSelectedTickets((prev) => prev.filter((id) => id !== ticketId));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTickets.length === 0) return;

    if (window.confirm("Are you sure you want to delete the selected tickets?")) {
      try {
        await deleteTickets(selectedTickets);
        setTickets((prev) => prev.filter((ticket) => !selectedTickets.includes(ticket.id)));
        setSelectedTickets([]);
      } catch (error) {
        console.error("Failed to delete tickets", error);
        // Optionally, show an error message to the user
      }
    }
  };

  return (
    <div>
      {selectedTickets.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-[#242424]">
          <Button onClick={handleDeleteSelected} variant="destructive">
            Delete Selected ({selectedTickets.length})
          </Button>
        </div>
      )}
      <Table className="bg-[#242424] ">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                onCheckedChange={handleSelectAll}
                checked={
                  selectedTickets.length === tickets.length && tickets.length > 0
                    ? true
                    : selectedTickets.length > 0
                    ? "indeterminate"
                    : false
                }
              />
            </TableHead>
            <TableHead className="text-white">Título</TableHead>
            <TableHead className="text-white">Estado</TableHead>
            <TableHead className="text-white">Solicitante</TableHead>
            <TableHead className="text-white">Fecha Creación</TableHead>
            <TableHead className="text-white">SLA</TableHead>
            <TableHead className="text-right text-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const isSlaBreached =
              ticket.status !== "resolved" &&
              ticket.status !== "closed" &&
              new Date() > new Date(ticket.sla_resolution_target);

            return (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={(checked) => handleSelect(ticket.id, checked as boolean)}
                    checked={selectedTickets.includes(ticket.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-white">
                  {ticket.title}
                </TableCell>
                <TableCell className="text-white">
                  <Badge variant={getStatusVariant(ticket.status)}>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-white">
                  {ticket.requester.name}
                </TableCell>
                <TableCell className="text-white">
                  {format(new Date(ticket.created_at), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>
                  {isSlaBreached && (
                    <Badge variant={"destructive"} className="whitespace-nowrap">
                      <AlertTriangle className="h-4 w-4 mr-1.5" />
                      SLA Vencido
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only text-white">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/tickets/${ticket.id}`)}
                      >
                        Ver Detalles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableTicket;
