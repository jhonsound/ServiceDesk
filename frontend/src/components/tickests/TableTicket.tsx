import React from "react";
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

const TableTicket = ({ tickets }: { tickets: Ticket[] }) => {
  const router = useRouter();

  return (
    <Table className="bg-[#242424] ">
      <TableHeader>
        <TableRow>
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
                  <span className="flex items-center text-red-500 font-semibold">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />{" "}
                    {/* Usamos un icono para que sea más claro */}
                    Vencido
                  </span>
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
  );
};

export default TableTicket;
