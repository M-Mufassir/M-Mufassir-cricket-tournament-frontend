import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
import CricketMotionScene from "../components/common/CricketMotionScene";
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

  const approvedCount = approvedTeams.length;

  return (
    <div className="space-y-8">
      <section className="hero-frame gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
        <div>
          <p className="section-kicker">Approved Teams</p>
          <h2 className="headline-glow mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Public list of accepted squads
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Showing approved teams for tournament ID {tournamentId}. Captains and vice captains are
            highlighted from the submitted squad.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="hero-stat">
              <p className="hero-stat-label">Approved Squads</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">{approvedCount}</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-label">Tournament ID</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">{tournamentId}</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-label">Visibility</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">Public Board</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <CricketMotionScene compact />
          <div className="surface-dark p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-field-100">
              Team Board
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              This board helps players and spectators quickly confirm which squads have completed
              the admin review process.
            </p>
          </div>
        </div>
      </section>

      <section className="section-divider" />

      <section className="grid gap-5 lg:grid-cols-2">
        {approvedTeams.map((team) => (
          <article key={team.id} className="soft-card overflow-hidden p-0">
            <div className="border-b border-white/60 bg-gradient-to-r from-field-600 to-field-500 px-6 py-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-field-50/85">
                {team.tournamentTitle}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{team.teamName}</h3>
            </div>

            <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                    Captain: {team.captainName || "Not set"}
                  </span>
                  <span className="rounded-full bg-pitch-500 px-3 py-1 text-xs font-semibold text-white">
                    Vice Captain: {team.viceCaptainName || "Not set"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-cream px-4 py-3 text-left sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Venue
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {team.tournamentLocation}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/70 bg-slate-50/90 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Squad
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {team.players.map((player, index) => (
                  <div
                    key={player.id || `${player.nicNumber}-${index}`}
                    className={`rounded-2xl border px-4 py-3 ${
                      player.isCaptain
                        ? "border-ink/20 bg-ink text-white"
                        : player.isViceCaptain
                          ? "border-pitch-200 bg-pitch-50"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${player.isCaptain ? "text-white" : "text-ink"}`}>
                      {player.fullName}
                      {player.isCaptain ? " (Captain)" : ""}
                      {player.isViceCaptain ? " (Vice Captain)" : ""}
                    </p>
                    <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${
                      player.isCaptain ? "text-white/75" : "text-slate-500"
                    }`}>
                      {player.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ApprovedTeamsPage;
