import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
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
      <section className="glass-panel grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-field-700">
            Registration Instructions
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-ink">
            Everything your team needs before submitting
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Read through these requirements carefully before you upload your receipt and submit
            your squad.
          </p>

          <Link className="primary-button mt-8" to="/register">
            Go to Registration Form
          </Link>
        </div>

        <div className="rounded-[2rem] bg-ink p-6 text-white">
          <h3 className="font-display text-2xl font-semibold">{tournament.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            {tournament.instructions ||
              "Complete the form carefully, attach the payment receipt, and wait for approval."}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {instructionItems.map((item, index) => (
          <article key={item} className="glass-panel p-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-pitch-600">
              Step 0{index + 1}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{item}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default RegistrationInstructionsPage;
