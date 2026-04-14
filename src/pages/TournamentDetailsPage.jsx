import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import { getPublicTournament } from "../services/publicApi";
import { formatCurrency, formatDate, formatStatusLabel } from "../utils/formatters";

function TournamentDetailsPage() {
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTournament() {
      try {
        setIsLoading(true);
        setError("");
        const response = await getPublicTournament();
        setTournament(response.data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTournament();
  }, []);

  if (isLoading) {
    return <PageLoader label="Loading tournament details..." />;
  }

  if (error) {
    return <AlertMessage type="error" message={error} />;
  }

  if (!tournament) {
    return (
      <EmptyState
        title="Tournament not available"
        description="There is no public tournament available right now. Please check again later."
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-ink px-6 py-8 text-white shadow-soft sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-stadium-glow opacity-100" />
        <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-pitch-400/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-field-200">
              Public Tournament Details
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              {tournament.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              {tournament.description || "Tournament details will be updated soon."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="primary-button" to="/register">
                Register Your Team
              </Link>
              <Link className="secondary-button border-white/20 bg-white/10 text-white hover:bg-white/20" to="/instructions">
                View Instructions
              </Link>
            </div>
          </div>

          <div className="glass-panel grid gap-4 p-5 text-ink shadow-2xl shadow-slate-900/15">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-field-700">
                Registration Status
              </p>
              <p className="mt-2 font-display text-2xl font-semibold">
                {formatStatusLabel(tournament.registrationStatus)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/40 bg-white/55 p-4 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Entry Fee
                </p>
                <p className="mt-2 text-lg font-bold">{formatCurrency(tournament.entryFee)}</p>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/55 p-4 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Max Players
                </p>
                <p className="mt-2 text-lg font-bold">{tournament.maxPlayersPerTeam}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <article className="glass-panel p-6 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Venue</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{tournament.location}</h3>
        </article>

        <article className="glass-panel p-6 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tournament Starts</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            {formatDate(tournament.startDate)}
          </h3>
        </article>

        <article className="glass-panel p-6 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tournament Ends</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            {formatDate(tournament.endDate)}
          </h3>
        </article>

        <article className="glass-panel p-6 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Registration Deadline</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            {formatDate(tournament.registrationDeadline)}
          </h3>
        </article>
      </section>
    </div>
  );
}

export default TournamentDetailsPage;
