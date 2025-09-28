'use client'; // <-- PASO 1: Convertir a Client Component

import { useState, useEffect } from 'react'; // <-- PASO 2: Importar hooks
import Link from 'next/link';
import { getTickets, Ticket } from '../../services/api'; // Importamos el tipo Ticket
import Dashboard from '../../components/dashboard/Dashboard';

export default function TicketsListPage() {
  // --- PASO 3: Manejar el estado localmente ---
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- PASO 4: Cargar datos en el cliente con useEffect ---
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (err) {
        setError('No se pudieron cargar los tickets. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []); // El array vacío asegura que se ejecute solo una vez

  const statusColor = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Cola de Soporte</h1>
          <Link href="/tickets/new" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Crear Nuevo Ticket
          </Link>
        </div>
        
        <Dashboard />

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {isLoading ? (
            <p className="p-6 text-center">Cargando tickets...</p>
          ) : error ? (
            <p className="p-6 text-center text-red-600">{error}</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              {/* ... (el <thead> de la tabla se mantiene igual) ... */}
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const isSlaBreached =
                    ticket.status !== 'resolved' &&
                    ticket.status !== 'closed' &&
                    new Date() > new Date(ticket.sla_resolution_target);

                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                         <Link href={`/tickets/${ticket.id}`} className="text-blue-600 hover:underline">
                            {ticket.id.substring(0, 8)}...
                         </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusColor[ticket.status]}`}>
                          {isSlaBreached && <span className="mr-1.5 text-red-600">⚠️</span>}
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.requester.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(ticket.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}