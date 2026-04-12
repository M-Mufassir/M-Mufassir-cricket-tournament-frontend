import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SummaryCard from "../components/admin/SummaryCard";
import TeamEditForm from "../components/admin/TeamEditForm";
import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import StatusBadge from "../components/common/StatusBadge";
import { clearAdminSession, getStoredAdminProfile, getStoredAdminToken } from "../hooks/useAdminAuth";
import {
  deleteAdminTeam,
  getAdminTeamById,
  getAdminTeams,
  getDashboardSummary,
  updateAdminTeam,
  updateAdminTeamStatus,
} from "../services/adminApi";
import { createEmptyPlayer } from "../utils/constants";
import { formatDate } from "../utils/formatters";

function createEditForm(team) {
  return {
    tournamentId: team.tournamentId || "",
    teamName: team.teamName || "",
    clubName: team.clubName || "",
    captainName: team.captainName || "",
    contactEmail: team.contactEmail || "",
    contactPhone: team.contactPhone || "",
    city: team.city || "",
    coachName: team.coachName || "",
    paymentReference: team.paymentReference || "",
    notes: team.notes || "",
    players: (team.players || []).map((player) => ({
      fullName: player.fullName || "",
      role: player.role || "Batsman",
      age: player.age ?? "",
      jerseyNumber: player.jerseyNumber ?? "",
      battingStyle: player.battingStyle || "",
      bowlingStyle: player.bowlingStyle || "",
      phoneNumber: player.phoneNumber || "",
      isCaptain: Boolean(player.isCaptain),
    })),
  };
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const token = getStoredAdminToken();
  const storedAdmin = getStoredAdminProfile();
  const [summary, setSummary] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelLoading, setIsPanelLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const filteredTeams = teams;

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setFeedback({ type: "", message: "" });

        const [summaryResponse, teamsResponse] = await Promise.all([
          getDashboardSummary(token),
          getAdminTeams(token, {
            status: statusFilter,
            search: searchTerm,
          }),
        ]);

        setSummary(summaryResponse.data);
        setTeams(teamsResponse.data);

        if (!teamsResponse.data.length) {
          setSelectedTeam(null);
          setEditForm(null);
          return;
        }

        if (selectedTeam) {
          const selectedStillExists = teamsResponse.data.some((team) => team.id === selectedTeam.id);

          if (selectedStillExists) {
            const detailResponse = await getAdminTeamById(token, selectedTeam.id);
            setSelectedTeam(detailResponse.data);
            setEditForm(createEditForm(detailResponse.data));
            return;
          }
        }

        const detailResponse = await getAdminTeamById(token, teamsResponse.data[0].id);
        setSelectedTeam(detailResponse.data);
        setEditForm(createEditForm(detailResponse.data));
      } catch (error) {
        if (error.status === 401) {
          clearAdminSession();
          navigate("/admin/login", { replace: true });
          return;
        }

        setFeedback({ type: "error", message: error.message });
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchTerm, token]);

  async function handleSelectTeam(teamId) {
    try {
      setIsPanelLoading(true);
      setIsEditing(false);
      setRejectionReason("");

      const response = await getAdminTeamById(token, teamId);
      setSelectedTeam(response.data);
      setEditForm(createEditForm(response.data));
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsPanelLoading(false);
    }
  }

  async function refreshTeams({ preserveSelection = true } = {}) {
    const [summaryResponse, teamsResponse] = await Promise.all([
      getDashboardSummary(token),
      getAdminTeams(token, {
        status: statusFilter,
        search: searchTerm,
      }),
    ]);

    setSummary(summaryResponse.data);
    setTeams(teamsResponse.data);

    if (!teamsResponse.data.length) {
      setSelectedTeam(null);
      setEditForm(null);
      return;
    }

    if (preserveSelection && selectedTeam) {
      const selectedStillExists = teamsResponse.data.some((team) => team.id === selectedTeam.id);

      if (selectedStillExists) {
        const detailResponse = await getAdminTeamById(token, selectedTeam.id);
        setSelectedTeam(detailResponse.data);
        setEditForm(createEditForm(detailResponse.data));
        return;
      }
    }

    const detailResponse = await getAdminTeamById(token, teamsResponse.data[0].id);
    setSelectedTeam(detailResponse.data);
    setEditForm(createEditForm(detailResponse.data));
  }

  function handleEditTeamField(field, value) {
    setEditForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleEditPlayerChange(playerIndex, field, value) {
    setEditForm((currentForm) => ({
      ...currentForm,
      players: currentForm.players.map((player, index) => {
        if (index !== playerIndex) {
          if (field === "isCaptain" && value) {
            return { ...player, isCaptain: false };
          }

          return player;
        }

        return {
          ...player,
          [field]: value,
        };
      }),
    }));
  }

  function handleAddPlayer() {
    setEditForm((currentForm) => {
      if (!currentForm || currentForm.players.length >= 20) {
        return currentForm;
      }

      return {
        ...currentForm,
        players: [...currentForm.players, createEmptyPlayer(currentForm.players.length)],
      };
    });
  }

  function handleRemovePlayer(playerIndex) {
    setEditForm((currentForm) => {
      if (!currentForm || currentForm.players.length <= 11) {
        return currentForm;
      }

      const updatedPlayers = currentForm.players.filter((_, index) => index !== playerIndex);

      if (!updatedPlayers.some((player) => player.isCaptain) && updatedPlayers[0]) {
        updatedPlayers[0].isCaptain = true;
      }

      return {
        ...currentForm,
        players: updatedPlayers,
      };
    });
  }

  async function handleStatusChange(status) {
    if (!selectedTeam) {
      return;
    }

    try {
      setIsSaving(true);
      setFeedback({ type: "", message: "" });

      await updateAdminTeamStatus(token, selectedTeam.id, {
        status,
        rejectionReason: status === "rejected" ? rejectionReason : "",
      });

      setFeedback({
        type: "success",
        message: `Team status updated to ${status}.`,
      });

      if (status === "rejected") {
        setRejectionReason("");
      }

      await refreshTeams();
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveEdit(event) {
    event.preventDefault();

    if (!selectedTeam || !editForm) {
      return;
    }

    try {
      setIsSaving(true);
      setFeedback({ type: "", message: "" });

      await updateAdminTeam(token, selectedTeam.id, editForm);
      setFeedback({
        type: "success",
        message: "Team details updated successfully.",
      });
      setIsEditing(false);

      await refreshTeams();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.payload?.errors?.[0]?.msg || error.message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTeam() {
    if (!selectedTeam) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete ${selectedTeam.teamName}? This action will remove the team and all players.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSaving(true);
      setFeedback({ type: "", message: "" });

      await deleteAdminTeam(token, selectedTeam.id);
      setFeedback({
        type: "success",
        message: "Team deleted successfully.",
      });

      await refreshTeams({ preserveSelection: false });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  }

  if (isLoading && !summary) {
    return <PageLoader label="Loading admin dashboard..." />;
  }

  return (
    <div className="section-shell py-8">
      <div className="space-y-6">
        <section className="glass-panel flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-field-700">
              Admin Dashboard
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink">
              Welcome back{storedAdmin?.fullName ? `, ${storedAdmin.fullName}` : ""}.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review registrations, manage team records, and keep the public list accurate.
            </p>
          </div>

          <button className="secondary-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </section>

        <AlertMessage type={feedback.type} message={feedback.message} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Teams" value={summary?.totalTeams || 0} accent="ink" />
          <SummaryCard label="Pending Teams" value={summary?.pendingTeams || 0} accent="pitch" />
          <SummaryCard
            label="Approved Teams"
            value={summary?.approvedTeams || 0}
            accent="field"
          />
          <SummaryCard
            label="Rejected Teams"
            value={summary?.rejectedTeams || 0}
            accent="pitch"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="glass-panel p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                className="field-input"
                placeholder="Search team, captain, email, or tournament"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <select
                className="field-input sm:max-w-48"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mt-6 space-y-3">
              {!filteredTeams.length ? (
                <EmptyState
                  title="No teams found"
                  description="Try a different filter or search term."
                />
              ) : (
                filteredTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => handleSelectTeam(team.id)}
                    className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                      selectedTeam?.id === team.id
                        ? "border-field-300 bg-field-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-xl font-semibold text-ink">{team.teamName}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {team.tournamentTitle} | Captain: {team.captainName}
                        </p>
                      </div>
                      <StatusBadge status={team.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                      <span>{team.playerCount} players</span>
                      <span className="text-right">{formatDate(team.createdAt)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="glass-panel p-6">
            {isPanelLoading ? (
              <PageLoader label="Loading team details..." />
            ) : !selectedTeam ? (
              <EmptyState
                title="Select a team"
                description="Choose a team from the list to view full details and admin actions."
              />
            ) : isEditing ? (
              <TeamEditForm
                formData={editForm}
                onTeamFieldChange={handleEditTeamField}
                onPlayerChange={handleEditPlayerChange}
                onAddPlayer={handleAddPlayer}
                onRemovePlayer={handleRemovePlayer}
                onSubmit={handleSaveEdit}
                onCancel={() => {
                  setIsEditing(false);
                  setEditForm(createEditForm(selectedTeam));
                }}
                isSubmitting={isSaving}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-3xl font-bold text-ink">
                        {selectedTeam.teamName}
                      </h2>
                      <StatusBadge status={selectedTeam.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {selectedTeam.tournamentTitle} | {selectedTeam.city || "City not provided"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="secondary-button" type="button" onClick={() => setIsEditing(true)}>
                      Edit
                    </button>
                    <button
                      className="secondary-button border-rose-200 text-rose-700 hover:border-rose-300"
                      type="button"
                      onClick={handleDeleteTeam}
                      disabled={isSaving}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Contact Details
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                      <p><span className="font-semibold text-ink">Captain:</span> {selectedTeam.captainName}</p>
                      <p><span className="font-semibold text-ink">Email:</span> {selectedTeam.contactEmail}</p>
                      <p><span className="font-semibold text-ink">Phone:</span> {selectedTeam.contactPhone}</p>
                      <p><span className="font-semibold text-ink">Coach:</span> {selectedTeam.coachName || "N/A"}</p>
                    </div>
                  </article>

                  <article className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Payment & Timing
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                      <p>
                        <span className="font-semibold text-ink">Reference:</span>{" "}
                        {selectedTeam.paymentReference || "Not provided"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Receipt:</span>{" "}
                        <a
                          className="font-semibold text-field-700 underline"
                          href={`${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}${selectedTeam.paymentReceiptPath.startsWith("/") ? selectedTeam.paymentReceiptPath : `/${selectedTeam.paymentReceiptPath}`}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View uploaded receipt
                        </a>
                      </p>
                      <p><span className="font-semibold text-ink">Submitted:</span> {formatDate(selectedTeam.createdAt)}</p>
                    </div>
                  </article>
                </div>

                <article className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                    Squad List
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {selectedTeam.players.map((player) => (
                      <div key={player.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="font-semibold text-ink">
                          {player.fullName}
                          {player.isCaptain ? " (Captain)" : ""}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {player.role} | Jersey {player.jerseyNumber || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                    Status Actions
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      className="primary-button bg-field-600 hover:bg-field-700"
                      type="button"
                      onClick={() => handleStatusChange("approved")}
                      disabled={isSaving}
                    >
                      Approve Team
                    </button>

                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => handleStatusChange("pending")}
                      disabled={isSaving}
                    >
                      Mark Pending
                    </button>
                  </div>

                  <div className="mt-5 rounded-3xl bg-rose-50 p-4">
                    <label className="field-label">Rejection Reason</label>
                    <textarea
                      className="field-input min-h-24 resize-y bg-white"
                      value={rejectionReason}
                      onChange={(event) => setRejectionReason(event.target.value)}
                      placeholder="Add a short reason before rejecting the team"
                    />
                    <button
                      className="secondary-button mt-3 border-rose-200 text-rose-700 hover:border-rose-300"
                      type="button"
                      onClick={() => handleStatusChange("rejected")}
                      disabled={isSaving}
                    >
                      Reject Team
                    </button>
                  </div>

                  {selectedTeam.rejectionReason ? (
                    <p className="mt-4 text-sm text-rose-700">
                      <span className="font-semibold">Last rejection reason:</span>{" "}
                      {selectedTeam.rejectionReason}
                    </p>
                  ) : null}
                </article>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
