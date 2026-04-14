import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import { getApprovedTeams, getPublicTournament } from "../services/publicApi";

function ApprovedTeamsPage() {
  const [approvedTeams, setApprovedTeams] = useState([]);
  const [tournamentId, setTournamentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApprovedTeams() {
      try {
        setIsLoading(true);
        setError("");

        const tournamentResponse = await getPublicTournament();
        const publicTournament = tournamentResponse.data;
        setTournamentId(publicTournament.id);

        const teamsResponse = await getApprovedTeams(publicTournament.id);
        setApprovedTeams(teamsResponse.data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadApprovedTeams();
  }, []);

  if (isLoading) {
    return <PageLoader label="Loading approved teams..." />;
  }

  if (error) {
    return <AlertMessage type="error" message={error} />;
  }

  if (!approvedTeams.length) {
    return (
      <EmptyState
        title="No approved teams yet"
        description="Approved teams will appear here once registrations are reviewed by the admin."
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="hero-frame px-6 py-8 sm:px-8">
        <p className="section-kicker">Approved Teams</p>
        <h2 className="mt-4 font-display text-4xl font-bold text-ink">
          Public list of accepted squads
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Showing approved teams for tournament ID {tournamentId}. Captains and vice captains are
          highlighted from the submitted squad.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {approvedTeams.map((team) => (
          <article key={team.id} className="soft-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-kicker">{team.tournamentTitle}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                  {team.teamName}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Captain: {team.captainName || "Not set"} | Vice Captain:{" "}
                  {team.viceCaptainName || "Not set"}
                </p>
              </div>

              <div className="rounded-2xl bg-cream px-4 py-3 text-right">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Venue
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {team.tournamentLocation}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Squad
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {team.players.map((player, index) => (
                  <div
                    key={player.id || `${player.nicNumber}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-ink">
                      {player.fullName}
                      {player.isCaptain ? " (Captain)" : ""}
                      {player.isViceCaptain ? " (Vice Captain)" : ""}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {player.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ApprovedTeamsPage;
