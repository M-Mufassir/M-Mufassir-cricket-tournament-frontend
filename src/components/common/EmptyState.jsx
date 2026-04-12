function EmptyState({ title, description }) {
  return (
    <div className="glass-panel px-6 py-12 text-center">
      <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">{description}</p>
    </div>
  );
}

export default EmptyState;
