import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
import PageLoader from "../components/common/PageLoader";
import PlayerFields from "../components/forms/PlayerFields";
import { getPublicTournament, registerTeam } from "../services/publicApi";
import { createEmptyPlayer, createInitialPlayers } from "../utils/constants";

function createInitialTeamForm() {
  return {
    teamName: "",
    clubName: "",
    captainName: "",
    contactEmail: "",
    contactPhone: "",
    city: "",
    coachName: "",
    paymentReference: "",
    paymentReceipt: null,
    players: createInitialPlayers(),
  };
}

function TeamRegistrationPage() {
  const [tournament, setTournament] = useState(null);
  const [formData, setFormData] = useState(createInitialTeamForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    async function loadTournament() {
      try {
        setIsLoading(true);
        const response = await getPublicTournament();
        setTournament(response.data);
      } catch (error) {
        setFeedback({ type: "error", message: error.message });
      } finally {
        setIsLoading(false);
      }
    }

    loadTournament();
  }, []);

  function handleTeamFieldChange(field, value) {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handlePlayerChange(playerIndex, field, value) {
    setFormData((currentForm) => ({
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

  function addPlayer() {
    setFormData((currentForm) => {
      if (currentForm.players.length >= 20) {
        return currentForm;
      }

      return {
        ...currentForm,
        players: [...currentForm.players, createEmptyPlayer(currentForm.players.length)],
      };
    });
  }

  function removePlayer(playerIndex) {
    setFormData((currentForm) => {
      if (currentForm.players.length <= 11) {
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!tournament) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback({ type: "", message: "" });

      const submissionData = new FormData();
      submissionData.append("tournamentId", tournament.id);
      submissionData.append("teamName", formData.teamName);
      submissionData.append("clubName", formData.clubName);
      submissionData.append("captainName", formData.captainName);
      submissionData.append("contactEmail", formData.contactEmail);
      submissionData.append("contactPhone", formData.contactPhone);
      submissionData.append("city", formData.city);
      submissionData.append("coachName", formData.coachName);
      submissionData.append("paymentReference", formData.paymentReference);
      submissionData.append("players", JSON.stringify(formData.players));

      if (formData.paymentReceipt) {
        submissionData.append("paymentReceipt", formData.paymentReceipt);
      }

      const response = await registerTeam(submissionData);

      setFeedback({
        type: "success",
        message: response.message || "Team registration submitted successfully.",
      });
      setFormData(createInitialTeamForm());
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.payload?.errors?.[0]?.msg || error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <PageLoader label="Preparing registration form..." />;
  }

  return (
    <div className="space-y-8">
      <section className="glass-panel grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-field-700">
            Team Registration
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-ink">
            Submit your squad and payment receipt
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Fill in all required fields carefully. The team will remain pending until an admin
            reviews the submission.
          </p>
        </div>

        <div className="rounded-[2rem] bg-ink p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-field-200">
            Active Tournament
          </p>
          <h3 className="mt-3 font-display text-3xl font-semibold">
            {tournament?.title || "Tournament details unavailable"}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Register between 11 and {tournament?.maxPlayersPerTeam || 20} players and upload a
            valid payment receipt.
          </p>
        </div>
      </section>

      <AlertMessage type={feedback.type} message={feedback.message} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="glass-panel p-6 sm:p-8">
          <h3 className="font-display text-2xl font-semibold text-ink">Team Information</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="field-label">Team Name</label>
              <input
                className="field-input"
                value={formData.teamName}
                onChange={(event) => handleTeamFieldChange("teamName", event.target.value)}
                placeholder="Colombo Strikers"
                required
              />
            </div>

            <div>
              <label className="field-label">Club Name</label>
              <input
                className="field-input"
                value={formData.clubName}
                onChange={(event) => handleTeamFieldChange("clubName", event.target.value)}
                placeholder="Colombo Cricket Club"
              />
            </div>

            <div>
              <label className="field-label">Captain Name</label>
              <input
                className="field-input"
                value={formData.captainName}
                onChange={(event) => handleTeamFieldChange("captainName", event.target.value)}
                placeholder="Nipun Perera"
                required
              />
            </div>

            <div>
              <label className="field-label">Contact Email</label>
              <input
                className="field-input"
                type="email"
                value={formData.contactEmail}
                onChange={(event) => handleTeamFieldChange("contactEmail", event.target.value)}
                placeholder="team@example.com"
                required
              />
            </div>

            <div>
              <label className="field-label">Contact Phone</label>
              <input
                className="field-input"
                value={formData.contactPhone}
                onChange={(event) => handleTeamFieldChange("contactPhone", event.target.value)}
                placeholder="+94 77 123 4567"
                required
              />
            </div>

            <div>
              <label className="field-label">City</label>
              <input
                className="field-input"
                value={formData.city}
                onChange={(event) => handleTeamFieldChange("city", event.target.value)}
                placeholder="Colombo"
              />
            </div>

            <div>
              <label className="field-label">Coach Name</label>
              <input
                className="field-input"
                value={formData.coachName}
                onChange={(event) => handleTeamFieldChange("coachName", event.target.value)}
                placeholder="Ruwan Silva"
              />
            </div>

            <div>
              <label className="field-label">Payment Reference</label>
              <input
                className="field-input"
                value={formData.paymentReference}
                onChange={(event) => handleTeamFieldChange("paymentReference", event.target.value)}
                placeholder="CPCC-001"
              />
            </div>

            <div>
              <label className="field-label">Payment Receipt</label>
              <input
                className="field-input file:mr-4 file:rounded-full file:border-0 file:bg-field-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-field-800"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  handleTeamFieldChange("paymentReceipt", event.target.files?.[0] || null)
                }
                required
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold text-ink">Players</h3>
              <p className="text-sm text-slate-600">
                Add between 11 and 20 players. One player must be marked as captain.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={addPlayer}
              disabled={formData.players.length >= 20}
            >
              Add Player
            </button>
          </div>

          {formData.players.map((player, index) => (
            <PlayerFields
              key={`${index}-${player.fullName}`}
              player={player}
              index={index}
              onChange={(field, value) => handlePlayerChange(index, field, value)}
              onRemove={() => removePlayer(index)}
              disableRemove={formData.players.length <= 11}
            />
          ))}
        </section>

        <div className="flex justify-end">
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeamRegistrationPage;
