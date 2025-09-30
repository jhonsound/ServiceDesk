"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTickets, Ticket } from "@/services/api";
import Dashboard from "@/components/dashboard/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Spinner } from "@/components/ui/shadcn-io/spinner";
import TableTicket from "@/components/tickests/TableTicket";

export default function TicketsListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        console.log("🚀 ~ fetchTickets ~ data:", data);
        setTickets(data);
      } catch {
        setError(
          "No se pudieron cargar los tickets. Por favor, intenta de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (isLoadingCard && isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="text-gray-500" variant={"infinite"} size={64} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

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

      <Dashboard setIsLoadingCard={setIsLoadingCard} />

      <Card className="bg-[#242424] border-none shadow-2xl max-h-85 overflow-auto">
        <CardHeader>
          <CardTitle className="text-white">Cola de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <TableTicket tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
}
