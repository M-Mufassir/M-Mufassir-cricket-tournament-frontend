import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AlertMessage from "../components/common/AlertMessage";
import { saveAdminSession } from "../hooks/useAdminAuth";
import { loginAdmin } from "../services/adminApi";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setFeedback({ type: "", message: "" });

      const response = await loginAdmin(credentials);
      saveAdminSession(response.data);

      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] bg-ink p-8 text-white shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-field-200">
            Admin Access
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold">
            Review registrations and keep the tournament list accurate.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200">
            Login with your admin account to approve, reject, edit, or remove team submissions.
          </p>

        </section>

        <section className="glass-panel p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-field-700">
            Login
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">Admin Sign In</h2>
          <p className="mt-3 text-sm text-slate-600">
            Enter your admin credentials to access the dashboard.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <AlertMessage type={feedback.type} message={feedback.message} />

            <div>
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="Enter your password"
                required
              />
            </div>

            <button className="primary-button w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login to Dashboard"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminLoginPage;
