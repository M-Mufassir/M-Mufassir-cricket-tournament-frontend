import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
import CricketMotionScene from "../components/common/CricketMotionScene";
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
      <section className="hero-frame relative overflow-hidden px-5 py-6 sm:px-8 lg:px-10">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-field-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-pitch-300/30 blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
          <div>
            <p className="section-kicker">
              Public Tournament Details
            </p>
            <h2 className="headline-glow mt-4 font-display text-4xl font-bold text-ink sm:text-5xl lg:text-6xl">
              {tournament.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              {tournament.description || "Tournament details will be updated soon."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-field-200 bg-field-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-field-800">
                {formatStatusLabel(tournament.registrationStatus)}
              </span>
              <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-600">
                {tournament.location}
              </span>
              <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-600">
                Deadline {formatDate(tournament.registrationDeadline)}
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="hero-stat">
                <p className="hero-stat-label">Entry Fee</p>
                <p className="mt-2 font-display text-2xl font-semibold text-ink">
                  {formatCurrency(tournament.entryFee)}
                </p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-label">Squad Size</p>
                <p className="mt-2 font-display text-2xl font-semibold text-ink">
                  {tournament.maxPlayersPerTeam} Players
                </p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-label">Starts</p>
                <p className="mt-2 font-display text-2xl font-semibold text-ink">
                  {formatDate(tournament.startDate)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button w-full sm:w-auto" to="/register">
                Register Your Team
              </Link>
              <Link className="secondary-button w-full sm:w-auto" to="/instructions">
                View Instructions
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <CricketMotionScene />

            <div className="surface-dark p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-field-100">
                Match Window
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-field-100/75">
                    Registration Deadline
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-white">
                    {formatDate(tournament.registrationDeadline)}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-field-100/75">
                    Tournament Ends
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-white">
                    {formatDate(tournament.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="glass-panel p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Venue</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            {tournament.location}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The venue is locked in and ready for squads arriving from around the area.
          </p>
        </article>

        <article className="glass-panel p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tournament Starts</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            {formatDate(tournament.startDate)}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Use this to finalize your squad early and avoid last-minute changes.
          </p>
        </article>

        <article className="glass-panel p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tournament Ends</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            {formatDate(tournament.endDate)}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Share the full tournament window with players so availability is clear.
          </p>
        </article>

        <article className="glass-panel p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Registration Deadline</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            {formatDate(tournament.registrationDeadline)}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Receipts and squad details should be submitted before this date for review.
          </p>
        </article>
      </section>
    </div>
  );
}

export default TournamentDetailsPage;
