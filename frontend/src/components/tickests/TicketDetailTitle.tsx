import { Ticket } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";

export const TicketDetailTitle = ({
  ticket,
  isSlaBreached,
  isLoading,
  newComment,
  handleAddComment,
  setNewComment,
}: {
  ticket: Ticket;
  isSlaBreached: boolean;
  isLoading: boolean;
  newComment: string;
  handleAddComment: (e: React.FormEvent) => void;
  setNewComment: (newComment: string) => void;
}) => {
  return (
    <div className="md:col-span-2 space-y-8">
      <Card className="bg-[#242424] border-none shadow-2xl">
        <CardHeader>
          {isSlaBreached && (
            <div className="p-4 mb-4 bg-red-900/50 border-l-4 border-red-500 text-red-300 rounded-r-lg">
              <p className="font-bold text-red-200">Atención: SLA Incumplido</p>
              <p>Este ticket ha superado el tiempo objetivo de resolución.</p>
            </div>
          )}
          <CardTitle className="text-3xl text-white">{ticket.title}</CardTitle>
          <p className="text-sm text-white">
            Solicitado por: {ticket.requester.name} el{" "}
            {new Date(ticket.created_at).toLocaleDateString()}
          </p>
        </CardHeader>

        <CardContent className="max-h-[30vh] overflow-y-auto">
          <p className="text-white whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>
      <Card className="bg-[#242424] border-none shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Añadir un Comentario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddComment} className="space-y-4">
            <Textarea
              placeholder="Escribe tu comentario aquí..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] text-white bg-[#1a1a1a] border border-gray-700"
            />
            <Button
              type="submit"
              disabled={isLoading || newComment.trim().length < 5}
            >
              {isLoading ? "Enviando..." : "Enviar Comentario"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
