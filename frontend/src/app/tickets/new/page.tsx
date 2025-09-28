import CreateTicketForm from "@/components/tickests/CreateTicketForm";

export default function NewTicketPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <CreateTicketForm />
      </div>
    </main>
  );
}
