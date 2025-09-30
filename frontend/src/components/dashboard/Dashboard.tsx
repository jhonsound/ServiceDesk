"use client";

import { useEffect, useState } from "react";
import { getKpis } from "../../services/api";
import KpiCard from "./KpiCard";
import { KpiData } from "@/types";

export default function Dashboard({
  setIsLoadingCard,
}: {
  setIsLoadingCard: (loading: boolean) => void;
}) {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await getKpis();
        setKpiData(data);
      } catch {
        setError("No se pudo cargar la información del dashboard.");
      } finally {
        setIsLoadingCard(false);
      }
    };
    fetchKpis();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <KpiCard
        title="Tickets Abiertos"
        value={kpiData?.openTickets ?? 0}
        description="Tickets activos actualmente"
      />
      <KpiCard
        title="Nuevos Tickets (Últimos 7 días)"
        value={kpiData?.ticketsInLast7Days ?? 0}
        description="Volumen de solicitudes recientes"
      />
      <KpiCard
        title="Cumplimiento de SLA"
        value={`${(kpiData?.slaCompliancePercentage ?? 100).toFixed(1)}%`}
        description="Tickets resueltos a tiempo"
      />
    </div>
  );
}
