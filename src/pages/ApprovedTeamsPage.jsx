import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
import CricketMotionScene from "../components/common/CricketMotionScene";
import CricketPosterCard from "../components/common/CricketPosterCard";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import SportsIcon from "../components/common/SportsIcon";
import { getApprovedTeams, getPublicTournament } from "../services/publicApi";

function ApprovedTeamsPage() {
  const [approvedTeams, setApprovedTeams] = useState([]);
  const [tournamentId, setTournamentId] = useState(null);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
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
            Official list of accepted squads
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Approved teams for tournament ID {tournamentId} are listed below, with captains and
            vice captains identified in each squad.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="hero-stat">
              <div className="hero-stat-icon">
                <SportsIcon icon="shield-check" className="h-5 w-5" />
              </div>
              <p className="hero-stat-label">Approved Squads</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">{approvedCount}</p>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">
                <SportsIcon icon="guide" className="h-5 w-5" />
              </div>
              <p className="hero-stat-label">Tournament ID</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">{tournamentId}</p>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">
                <SportsIcon icon="stadium" className="h-5 w-5" />
              </div>
              <p className="hero-stat-label">Listing</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">Official Board</p>
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
              Approved sides are published here once the tournament review process is complete.
            </p>
          </div>
        </div>
      </section>

      <section className="section-divider" />

      <section className="grid gap-5 lg:grid-cols-2">
        {approvedTeams.map((team) => (
          <article key={team.id} className="soft-card overflow-hidden p-0">
            <button
              type="button"
              className="w-full text-left"
              onClick={() =>
                setExpandedTeamId((currentTeamId) => (currentTeamId === team.id ? null : team.id))
              }
            >
              <div className="border-b border-white/60 bg-gradient-to-r from-field-600 to-field-500 px-6 py-4 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-field-50/85">
                      {team.tournamentTitle}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">{team.teamName}</h3>
                  </div>

                  <span
                    className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 transition ${
                      expandedTeamId === team.id ? "rotate-180" : ""
                    }`}
                  >
                    <SportsIcon icon="chevron-down" className="h-5 w-5" />
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                        Captain: {team.captainName || "Not set"}
                      </span>
                      <span className="rounded-full bg-pitch-500 px-3 py-1 text-xs font-semibold text-white">
                        Vice Captain: {team.viceCaptainName || "Not set"}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-600">
                      {expandedTeamId === team.id ? "Hide squad list" : "View full squad"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-cream px-4 py-3 text-left sm:text-right">
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-field-700 shadow-sm sm:ml-auto">
                      <SportsIcon icon="location" className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Venue
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {team.tournamentLocation}
                    </p>
                  </div>
                </div>
              </div>
            </button>

            {expandedTeamId === team.id ? (
              <div className="border-t border-white/60 px-6 pb-6 pt-1">
                <div className="rounded-3xl border border-white/70 bg-slate-50/90 p-4">
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
                        <p
                          className={`text-sm font-semibold ${
                            player.isCaptain ? "text-white" : "text-ink"
                          }`}
                        >
                          {player.fullName}
                          {player.isCaptain ? " (Captain)" : ""}
                          {player.isViceCaptain ? " (Vice Captain)" : ""}
                        </p>
                        <p
                          className={`mt-1 text-xs uppercase tracking-[0.2em] ${
                            player.isCaptain ? "text-white/75" : "text-slate-500"
                          }`}
                        >
                          {player.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="poster-grid">
        <CricketPosterCard
          variant="trophy"
          title="Tournament Honors"
          subtitle="Strengthens the official presentation of the approved teams section."
        />
        <CricketPosterCard
          variant="stadium"
          title="Ground Board"
          subtitle="Gives the approved squads page the character of a formal tournament listing."
        />
      </section>
    </div>
  );
}

export default ApprovedTeamsPage;
