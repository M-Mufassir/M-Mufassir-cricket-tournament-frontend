import { formatStatusLabel } from "../../utils/formatters";

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-field-100 text-field-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {formatStatusLabel(status)}
    </span>
  );
}

export default StatusBadge;
