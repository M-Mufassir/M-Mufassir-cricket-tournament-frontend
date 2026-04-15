import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
import CricketMotionScene from "../components/common/CricketMotionScene";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import { getPublicTournament } from "../services/publicApi";
import { formatCurrency, formatDate } from "../utils/formatters";

function RegistrationInstructionsPage() {
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
    return <PageLoader label="Loading registration instructions..." />;
  }

  if (error) {
    return <AlertMessage type="error" message={error} />;
  }

  if (!tournament) {
    return (
      <EmptyState
        title="Instructions unavailable"
        description="There is currently no tournament instruction set available."
      />
    );
  }

  const instructionItems = [
    `Complete the team registration before ${formatDate(tournament.registrationDeadline)}.`,
    `Prepare a squad with 11 to ${tournament.maxPlayersPerTeam} players.`,
    `Pay the tournament entry fee of ${formatCurrency(tournament.entryFee)} before submitting.`,
    "Upload a clear payment receipt in PDF, JPG, JPEG, or PNG format.",
    "Wait for an admin to review and approve your team submission.",
  ];

  return (
    <div className="space-y-8">
      <section className="hero-frame gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <p className="section-kicker">
            Registration Instructions
          </p>
          <h2 className="headline-glow mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Everything your team needs before submitting
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Read through these requirements carefully before you upload your receipt and submit
            your squad.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="hero-stat">
              <p className="hero-stat-label">Deadline</p>
              <p className="mt-2 font-display text-xl font-semibold text-ink">
                {formatDate(tournament.registrationDeadline)}
              </p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-label">Entry Fee</p>
              <p className="mt-2 font-display text-xl font-semibold text-ink">
                {formatCurrency(tournament.entryFee)}
              </p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-label">Squad Range</p>
              <p className="mt-2 font-display text-xl font-semibold text-ink">
                11 - {tournament.maxPlayersPerTeam}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="primary-button w-full sm:w-auto" to="/register">
              Go to Registration Form
            </Link>
            <Link className="secondary-button w-full sm:w-auto" to="/teams">
              View Approved Teams
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <CricketMotionScene compact />

          <div className="surface-dark p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-field-100">
              Team Briefing
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white">
              {tournament.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              {tournament.instructions ||
                "Complete the form carefully, attach the payment receipt, and wait for approval."}
            </p>
          </div>
        </div>
      </section>

      <section className="section-divider" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {instructionItems.map((item, index) => (
          <article key={item} className="soft-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-pitch-600">
              Step 0{index + 1}
            </p>
            <p className="mt-3 font-display text-xl font-semibold text-ink">
              {["Prepare", "Build Squad", "Pay Fee", "Upload Proof", "Wait Review"][index]}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{item}</p>
          </article>
        ))}
      </section>

      <section className="glass-panel grid gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="section-kicker">Quick Checklist</p>
          <h3 className="mt-3 font-display text-3xl font-semibold text-ink">
            Before you hit submit
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/65 bg-white/75 p-4">
              <p className="text-sm font-semibold text-ink">Clear receipt uploaded</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Bank slip, transfer confirmation, or payment photo should be readable.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/65 bg-white/75 p-4">
              <p className="text-sm font-semibold text-ink">Leadership selected</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Choose one captain and one vice captain after the squad is complete.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-field-100 bg-field-100/85 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-field-800">
            Match Office Reminder
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Double-check player NIC numbers and phone numbers before submission so the admin can
            verify entries quickly.
          </p>
        </div>
      </section>
    </div>
  );
}

export default RegistrationInstructionsPage;
