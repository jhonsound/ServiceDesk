"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTickets, Ticket, TicketStatus } from "@/services/api";
import Dashboard from "@/components/dashboard/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getStatusVariant } from "@/lib/utils";

export default function TicketsListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        console.log("🚀 ~ fetchTickets ~ data:", data)
        setTickets(data);
      } catch (err) {
        setError(
          "No se pudieron cargar los tickets. Por favor, intenta de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="space-y-8 w-full p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#cbcbcb]">
          Dashboard de Soporte
        </h1>
        <Button className="bg-gray-700" asChild>
          <Link href="/tickets/new">Crear Nuevo Ticket</Link>
        </Button>
      </div>

      <Dashboard />

      <Card className="bg-[#242424] border-none shadow-2xl max-h-85 overflow-auto">
        <CardHeader>
          <CardTitle className="text-white">Cola de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="p-6 text-center text-white">Cargando tickets...</p>
          ) : error ? (
            <p className="p-6 text-center text-red-600">{error}</p>
          ) : (
            <Table className="bg-[#242424] ">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Título</TableHead>
                  <TableHead className="text-white">Estado</TableHead>
                  <TableHead className="text-white">Solicitante</TableHead>
                  <TableHead className="text-white">Fecha Creación</TableHead>
                  <TableHead className="text-white">SLA</TableHead>
                  <TableHead className="text-right text-white">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
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
                        {format(
                          new Date(ticket.created_at),
                          "d 'de' MMMM, yyyy",
                          { locale: es }
                        )}
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
                              <span className="sr-only text-white">
                                Abrir menú
                              </span>
                              <MoreHorizontal className="h-4 w-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/tickets/${ticket.id}`)
                              }
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
