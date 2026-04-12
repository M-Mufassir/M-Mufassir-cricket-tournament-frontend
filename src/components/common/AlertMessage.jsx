function AlertMessage({ type = "info", message }) {
  if (!message) {
    return null;
  }

  const styles = {
    success: "border-field-200 bg-field-50 text-field-800",
    error: "border-rose-200 bg-rose-50 text-rose-700",
    info: "border-sky-200 bg-sky-50 text-sky-700",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${styles[type] || styles.info}`}>
      {message}
    </div>
  );
}

export default AlertMessage;
