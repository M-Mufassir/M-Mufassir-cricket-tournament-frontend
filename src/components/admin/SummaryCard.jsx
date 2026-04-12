function SummaryCard({ label, value, accent = "field" }) {
  const accentClasses = {
    field: "from-field-500/20 to-field-100 bg-field-50",
    pitch: "from-pitch-500/20 to-pitch-100 bg-pitch-50",
    ink: "from-slate-700/20 to-slate-100 bg-slate-50",
  };

  return (
    <article className={`rounded-[1.75rem] bg-gradient-to-br p-5 ${accentClasses[accent] || accentClasses.field}`}>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-4 font-display text-3xl font-bold text-ink">{value}</p>
    </article>
  );
}

export default SummaryCard;
