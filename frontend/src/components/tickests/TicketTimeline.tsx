import { TicketHistory } from "@/types"

const TicketTimeline = ({ history }: { history: TicketHistory[] }) => {
  return (
    <div>
          <h3 className="text-lg font-semibold text-white  mb-4">
            Historial del Ticket
          </h3>
          <div className="border-l-2 border-gray-200 ml-2">
            {history &&
              history
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((entry) => (
                  <div key={entry.id} className="relative mb-8">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 bg-gray-700 rounded-full"></div>
                    <div className="ml-8">
                      <p className="font-semibold text-white">
                        {entry.user.name}{" "}
                        <span className="text-white font-normal">
                          ({entry.user.role})
                        </span>
                      </p>
                      <div className="text-sm text-white">
                        {entry.action === "status_change" &&
                          `Cambió el estado de "${entry.old_value}" a "${entry.new_value}"`}
                        {entry.action === "ticket_created" && "Creó el ticket"}
                        {entry.action === "comment_added" && (
                          <div className="mt-1 p-3 bg-[#1a1a1a]  rounded-md border">
                            <p className="whitespace-pre-wrap">{entry.comment}</p>
                          </div>
                        )}
                      </div>
                      <time className="text-xs text-white mt-1 inline-block">
                        {new Date(entry.created_at).toLocaleString()}
                      </time>
                    </div>
                  </div>
                ))}
          </div>
        </div>
  )
}

export default TicketTimeline