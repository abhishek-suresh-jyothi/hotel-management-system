import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { ORDER_STATUSES, STATUS_LABELS, OrderStatus } from "@/lib/constants";

export default function OrderStatusTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
        <XCircle size={20} />
        <span className="font-semibold">This order has been cancelled.</span>
      </div>
    );
  }

  const flow: OrderStatus[] = ORDER_STATUSES.filter((s) => s !== "cancelled");
  const currentIndex = flow.indexOf(status as OrderStatus);

  return (
    <div className="flex flex-col gap-0 sm:flex-row sm:items-center">
      {flow.map((s, idx) => {
        const done = idx <= currentIndex;
        const isLast = idx === flow.length - 1;
        return (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5 sm:flex-1">
              <div className={done ? "text-emerald-600" : "text-slate-300"}>
                {done ? <CheckCircle2 size={26} /> : <Circle size={26} />}
              </div>
              <span className={`text-center text-[11px] font-semibold uppercase tracking-wide ${done ? "text-emerald-700" : "text-slate-400"}`}>
                {STATUS_LABELS[s]}
              </span>
            </div>
            {!isLast && (
              <div className={`hidden h-0.5 flex-1 sm:block ${idx < currentIndex ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
