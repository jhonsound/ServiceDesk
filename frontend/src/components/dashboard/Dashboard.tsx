'use client';

import { useEffect, useState } from 'react';
import { getKpis, KpiData } from '../../services/api';

// Un sub-componente para cada tarjeta del KPI, para mantener el código limpio
function KpiCard({ title, value, description }: { title: string, value: string | number, description: string }) {
    return (
        <div className="bg-[#242424] p-6 rounded-lg shadow-2xl">
            <h3 className="text-sm font-medium text-gray-100">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    );
}

export default function Dashboard() {
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKpis = async () => {
            try {
                const data = await getKpis();
                setKpiData(data);
            } catch (err) {
                setError('No se pudo cargar la información del dashboard.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchKpis();
    }, []);

    if (isLoading) {
        return <div className="text-center p-4">Cargando dashboard...</div>;
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>;
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