// frontend/src/app/tickets/[id]/page.tsx

import TicketDetailView from '@/components/tickests/TicketDetailView';
import { getTicketById } from '../../../services/api';

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = await getTicketById(params.id);

  if (!ticket) {
    return <div>Ticket no encontrado.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <TicketDetailView initialTicket={ticket} />
    </main>
  );
}