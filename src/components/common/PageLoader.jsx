function PageLoader({ label = "Loading..." }) {
  return (
    <div className="glass-panel flex min-h-[240px] items-center justify-center px-6 py-10">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-field-200 border-t-field-600" />
        <p className="mt-4 text-sm font-semibold text-slate-600">{label}</p>
      </div>
    </div>
  );
}

export default PageLoader;
