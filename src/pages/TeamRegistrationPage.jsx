import { useEffect, useState } from "react";

import AlertMessage from "../components/common/AlertMessage";
import CricketMotionScene from "../components/common/CricketMotionScene";
import PageLoader from "../components/common/PageLoader";
import PlayerFields from "../components/forms/PlayerFields";
import { getPublicTournament, registerTeam } from "../services/publicApi";
import {
  buildPlayersWithLeadership,
  createEmptyPlayer,
  DEFAULT_MAX_PLAYERS_PER_TEAM,
  getPlayerDisplayName,
  MIN_PLAYERS_PER_TEAM,
} from "../utils/constants";
import { formatCurrency, formatDate } from "../utils/formatters";

const registrationSteps = [
  {
    id: "payment",
    title: "Team & Payment",
    description: "Start with the team name, deposit reference, and payment proof.",
  },
  {
    id: "players",
    title: "Squad Members",
    description: "Add your players with only the required details.",
  },
  {
    id: "leaders",
    title: "Captain Selection",
    description: "Choose the captain and vice captain from the completed squad list.",
  },
  {
    id: "summary",
    title: "Summary",
    description: "Review everything before the registration is submitted.",
  },
];

function createInitialTeamForm() {
  return {
    teamName: "",
    paymentReference: "",
    paymentReceipt: null,
    captainIndex: "",
    viceCaptainIndex: "",
    players: [],
  };
}

function getDuplicateValue(values) {
  const seenValues = new Set();

  for (const value of values) {
    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue) {
      continue;
    }

    if (seenValues.has(normalizedValue)) {
      return value.trim();
    }

    seenValues.add(normalizedValue);
  }

  return "";
}

function TeamRegistrationPage() {
  const [tournament, setTournament] = useState(null);
  const [formData, setFormData] = useState(createInitialTeamForm);
  const [playerDraft, setPlayerDraft] = useState(() => createEmptyPlayer(0));
  const [editingPlayerIndex, setEditingPlayerIndex] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
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

  function handleDraftPlayerChange(field, value) {
    setPlayerDraft((currentPlayer) => ({
      ...currentPlayer,
      [field]: value,
    }));
  }

  function validateDraftPlayer() {
    if (!playerDraft.fullName.trim()) {
      return "Enter the player's name with initials.";
    }

    if (!playerDraft.role.trim()) {
      return "Select the player's role.";
    }

    if (!playerDraft.nicNumber.trim()) {
      return "Enter the player's NIC number.";
    }

    if (!playerDraft.phoneNumber.trim()) {
      return "Enter the player's phone number.";
    }

    const duplicateNicIndex = formData.players.findIndex(
      (player, index) =>
        index !== editingPlayerIndex &&
        player.nicNumber.trim().toLowerCase() === playerDraft.nicNumber.trim().toLowerCase()
    );

    if (duplicateNicIndex !== -1) {
      return "This NIC number is already added to the squad list.";
    }

    return "";
  }

  function resetPlayerDraft(nextPlayerIndex = formData.players.length) {
    setPlayerDraft(createEmptyPlayer(nextPlayerIndex));
    setEditingPlayerIndex(null);
  }

  function addPlayer() {
    const maxPlayers = tournament?.maxPlayersPerTeam || DEFAULT_MAX_PLAYERS_PER_TEAM;
    const validationMessage = validateDraftPlayer();

    if (validationMessage) {
      setFeedback({ type: "error", message: validationMessage });
      return;
    }

    if (editingPlayerIndex === null && formData.players.length >= maxPlayers) {
      setFeedback({
        type: "error",
        message: `You can add only up to ${maxPlayers} players for this tournament.`,
      });
      return;
    }

    setFeedback({ type: "", message: "" });
    setFormData((currentForm) => {
      const updatedPlayers =
        editingPlayerIndex === null
          ? [...currentForm.players, { ...playerDraft, sortOrder: currentForm.players.length + 1 }]
          : currentForm.players.map((player, index) =>
              index === editingPlayerIndex
                ? { ...playerDraft, sortOrder: editingPlayerIndex + 1 }
                : player
            );

      return {
        ...currentForm,
        players: updatedPlayers.map((player, index) => ({
          ...player,
          sortOrder: index + 1,
        })),
      };
    });
    resetPlayerDraft(editingPlayerIndex === null ? formData.players.length + 1 : formData.players.length);
  }

  function removePlayer(playerIndex) {
    setFormData((currentForm) => {
      const updatedPlayers = currentForm.players.filter((_, index) => index !== playerIndex);
      const currentCaptainIndex =
        currentForm.captainIndex === "" ? null : Number(currentForm.captainIndex);
      const currentViceCaptainIndex =
        currentForm.viceCaptainIndex === "" ? null : Number(currentForm.viceCaptainIndex);
      const nextCaptainIndex =
        currentCaptainIndex === playerIndex
          ? ""
          : currentCaptainIndex !== null && currentCaptainIndex > playerIndex
            ? String(currentCaptainIndex - 1)
            : currentForm.captainIndex;
      const nextViceCaptainIndex =
        currentViceCaptainIndex === playerIndex
          ? ""
          : currentViceCaptainIndex !== null && currentViceCaptainIndex > playerIndex
            ? String(currentViceCaptainIndex - 1)
            : currentForm.viceCaptainIndex;

      return {
        ...currentForm,
        players: updatedPlayers.map((player, index) => ({
          ...player,
          sortOrder: index + 1,
        })),
        captainIndex: nextCaptainIndex,
        viceCaptainIndex: nextViceCaptainIndex,
      };
    });

    if (editingPlayerIndex === playerIndex) {
      resetPlayerDraft(Math.max(formData.players.length - 1, 0));
    } else if (editingPlayerIndex !== null && editingPlayerIndex > playerIndex) {
      setEditingPlayerIndex((currentIndex) => (currentIndex === null ? null : currentIndex - 1));
    }
  }

  function editPlayer(playerIndex) {
    const selectedPlayer = formData.players[playerIndex];

    if (!selectedPlayer) {
      return;
    }

    setPlayerDraft({ ...selectedPlayer });
    setEditingPlayerIndex(playerIndex);
    setFeedback({ type: "", message: "" });
  }

  function validateCurrentStep(stepIndex = currentStep) {
    const maxPlayers = tournament?.maxPlayersPerTeam || DEFAULT_MAX_PLAYERS_PER_TEAM;

    if (stepIndex === 0) {
      if (!formData.teamName.trim()) {
        return "Team name is required before you continue.";
      }

      if (!formData.paymentReference.trim()) {
        return "Payment reference is required before you continue.";
      }

      if (!formData.paymentReceipt) {
        return "Upload the payment slip or receipt before you continue.";
      }

      return "";
    }

    if (stepIndex === 1) {
      if (formData.players.length < MIN_PLAYERS_PER_TEAM) {
        return `Add at least ${MIN_PLAYERS_PER_TEAM} players to continue.`;
      }

      if (formData.players.length > maxPlayers) {
        return `You can add only up to ${maxPlayers} players for this tournament.`;
      }

      const incompletePlayer = formData.players.find(
        (player) =>
          !player.fullName.trim() ||
          !player.role.trim() ||
          !player.nicNumber.trim() ||
          !player.phoneNumber.trim()
      );

      if (incompletePlayer) {
        return "Complete the name, role, NIC number, and phone number for every player.";
      }

      const duplicateNic = getDuplicateValue(formData.players.map((player) => player.nicNumber));

      if (duplicateNic) {
        return `NIC number ${duplicateNic} is duplicated in the squad list.`;
      }

      return "";
    }

    if (stepIndex === 2) {
      if (formData.captainIndex === "") {
        return "Select the captain from the player list.";
      }

      if (formData.viceCaptainIndex === "") {
        return "Select the vice captain from the player list.";
      }

      if (Number(formData.captainIndex) === Number(formData.viceCaptainIndex)) {
        return "Captain and vice captain must be two different players.";
      }
    }

    return "";
  }

  function validateAllSteps() {
    for (let stepIndex = 0; stepIndex < registrationSteps.length - 1; stepIndex += 1) {
      const validationMessage = validateCurrentStep(stepIndex);

      if (validationMessage) {
        return validationMessage;
      }
    }

    return "";
  }

  function goToNextStep() {
    const validationMessage = validateCurrentStep();

    if (validationMessage) {
      setFeedback({ type: "error", message: validationMessage });
      return;
    }

    setFeedback({ type: "", message: "" });
    setCurrentStep((currentValue) => Math.min(currentValue + 1, registrationSteps.length - 1));
  }

  function goToPreviousStep() {
    setFeedback({ type: "", message: "" });
    setCurrentStep((currentValue) => Math.max(currentValue - 1, 0));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!tournament) {
      return;
    }

    try {
      const validationMessage = validateAllSteps();

      if (validationMessage) {
        setFeedback({ type: "error", message: validationMessage });
        return;
      }

      setIsSubmitting(true);
      setFeedback({ type: "", message: "" });

      const players = buildPlayersWithLeadership(
        formData.players,
        formData.captainIndex,
        formData.viceCaptainIndex
      );
      const submissionData = new FormData();

      submissionData.append("tournamentId", tournament.id);
      submissionData.append("teamName", formData.teamName);
      submissionData.append("paymentReference", formData.paymentReference);
      submissionData.append("players", JSON.stringify(players));

      if (formData.paymentReceipt) {
        submissionData.append("paymentReceipt", formData.paymentReceipt);
      }

      const response = await registerTeam(submissionData);

      setFeedback({
        type: "success",
        message: response.message || "Team registration submitted successfully.",
      });
      setFormData(createInitialTeamForm());
      resetPlayerDraft(0);
      setCurrentStep(0);
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

  const maxPlayers = tournament?.maxPlayersPerTeam || DEFAULT_MAX_PLAYERS_PER_TEAM;
  const summaryPlayers = buildPlayersWithLeadership(
    formData.players,
    formData.captainIndex,
    formData.viceCaptainIndex
  );
  const captainName =
    formData.captainIndex !== ""
      ? getPlayerDisplayName(
          formData.players[Number(formData.captainIndex)],
          Number(formData.captainIndex)
        )
      : "Not selected";
  const viceCaptainName =
    formData.viceCaptainIndex !== ""
      ? getPlayerDisplayName(
          formData.players[Number(formData.viceCaptainIndex)],
          Number(formData.viceCaptainIndex)
        )
      : "Not selected";
  const completionPercentage = Math.round(((currentStep + 1) / registrationSteps.length) * 100);

  return (
    <div className="space-y-8">
      <section className="hero-frame relative overflow-hidden px-5 py-6 sm:px-8 lg:px-10">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-field-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-pitch-300/25 blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
          <div>
            <p className="section-kicker">Team Registration</p>
            <h2 className="headline-glow mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
              Register your squad for {tournament?.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              The form now follows a cleaner match-day flow: payment first, squad second,
              leadership selection third, and a final summary before submission.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-field-200 bg-field-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-field-800">
                Step {currentStep + 1} of {registrationSteps.length}
              </span>
              <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-600">
                {completionPercentage}% complete
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="hero-stat">
                <p className="hero-stat-label">Location</p>
                <p className="mt-2 font-display text-xl font-semibold text-ink">
                  {tournament?.location}
                </p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-label">Entry Fee</p>
                <p className="mt-2 font-display text-xl font-semibold text-ink">
                  {formatCurrency(tournament?.entryFee)}
                </p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-label">Deadline</p>
                <p className="mt-2 font-display text-xl font-semibold text-ink">
                  {formatDate(tournament?.registrationDeadline)}
                </p>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-3">
                {registrationSteps.map((step, index) => (
                  <div
                    key={`hero-step-${step.id}`}
                    className={`min-w-[200px] rounded-[1.5rem] border px-4 py-4 ${
                      currentStep === index
                        ? "border-field-300 bg-field-50 shadow-md"
                        : currentStep > index
                          ? "border-white/70 bg-white/85"
                          : "border-white/55 bg-white/65"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                      Step 0{index + 1}
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-ink">{step.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <CricketMotionScene compact />

            <div className="surface-dark p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-field-100">
                    Registration Flow
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                    Built for quick submission
                  </h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  {formData.players.length} / {maxPlayers} players
                </div>
              </div>

              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-field-300 to-pitch-400"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="mt-5 space-y-3">
                {registrationSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`rounded-[1.5rem] border px-4 py-3 ${
                      currentStep === index
                        ? "border-field-300/70 bg-field-400/25 shadow-lg shadow-field-500/10"
                        : currentStep > index
                          ? "border-white/20 bg-white/10"
                          : "border-white/10 bg-slate-900/60"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-field-100">
                      Step 0{index + 1}
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-white">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-100/90">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AlertMessage type={feedback.type} message={feedback.message} />

      <form className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <section className="soft-card p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-kicker">Step 0{currentStep + 1}</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-ink">
                  {registrationSteps[currentStep].title}
                </h3>
              </div>
              <div className="rounded-full border border-field-200 bg-field-100 px-4 py-2 text-sm font-semibold text-field-900 shadow-sm">
                {formData.players.length} / {maxPlayers} players
              </div>
            </div>

            <p className="mt-4 text-base leading-7 text-slate-600">
              {registrationSteps[currentStep].description}
            </p>

            {currentStep === 0 ? (
              <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
                <div className="space-y-4">
                  <div>
                    <label className="field-label">Team Name</label>
                    <input
                      className="field-input"
                      value={formData.teamName}
                      onChange={(event) => handleTeamFieldChange("teamName", event.target.value)}
                      placeholder="Periyamulla Lions"
                      required
                    />
                  </div>

                  <div>
                    <label className="field-label">Payment Reference</label>
                    <input
                      className="field-input"
                      value={formData.paymentReference}
                      onChange={(event) =>
                        handleTeamFieldChange("paymentReference", event.target.value)
                      }
                      placeholder="PMT-2026-001"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-dashed border-field-400 bg-field-100/80 p-5 shadow-sm">
                  <label className="field-label">Payment Receipt / Photo</label>
                  <input
                    className="field-input file:mr-4 file:rounded-full file:border-0 file:bg-field-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) =>
                      handleTeamFieldChange("paymentReceipt", event.target.files?.[0] || null)
                    }
                    required
                  />
                  <p className="mt-3 text-sm text-slate-600">
                    Upload a clear bank slip, transfer confirmation, or payment image.
                  </p>
                  {formData.paymentReceipt ? (
                    <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                      <span className="font-semibold text-ink">Selected file:</span>{" "}
                      {formData.paymentReceipt.name}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {currentStep === 1 ? (
              <div className="mt-8 space-y-4">
                <div className="rounded-[1.8rem] border border-field-100 bg-field-100/85 px-5 py-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                      Add players one by one. After each player is added, the form resets and the
                      squad list appears underneath.
                    </p>

                    <button
                      type="button"
                      className="secondary-button w-full sm:w-auto"
                      onClick={addPlayer}
                      disabled={editingPlayerIndex === null && formData.players.length >= maxPlayers}
                    >
                      <span className="text-lg leading-none">+</span>
                      {editingPlayerIndex === null ? "Add Player" : "Update Player"}
                    </button>
                  </div>
                </div>

                <PlayerFields
                  key={playerDraft.clientId}
                  player={playerDraft}
                  index={editingPlayerIndex ?? formData.players.length}
                  onChange={handleDraftPlayerChange}
                  onRemove={() => resetPlayerDraft(formData.players.length)}
                  disableRemove={false}
                  showRemoveButton={false}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="primary-button w-full sm:w-auto"
                    onClick={addPlayer}
                    disabled={editingPlayerIndex === null && formData.players.length >= maxPlayers}
                  >
                    {editingPlayerIndex === null ? "Add Player To Squad" : "Save Player Changes"}
                  </button>

                  {editingPlayerIndex !== null ? (
                    <button
                      type="button"
                      className="secondary-button w-full sm:w-auto"
                      onClick={() => resetPlayerDraft(formData.players.length)}
                    >
                      Cancel Edit
                    </button>
                  ) : null}
                </div>

                <div className="rounded-[1.8rem] border border-field-100 bg-field-100/80 p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="section-kicker">Added Players</p>
                      <h4 className="mt-2 font-display text-2xl font-semibold text-ink">
                        Squad List
                      </h4>
                    </div>
                    <div className="rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                      {formData.players.length} added | Minimum {MIN_PLAYERS_PER_TEAM}
                    </div>
                  </div>

                  {!formData.players.length ? (
                    <p className="mt-5 text-sm text-slate-600">
                      No players added yet. Start with player 1 and keep adding one by one.
                    </p>
                  ) : (
                    <div className="mt-5 grid gap-3 lg:grid-cols-2">
                      {formData.players.map((player, index) => (
                        <div
                          key={player.clientId || `added-player-${index}`}
                          className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                Player {index + 1}
                              </p>
                              <p className="mt-2 font-semibold text-ink">
                                {getPlayerDisplayName(player, index)}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                                onClick={() => editPlayer(index)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:border-rose-300"
                                onClick={() => removePlayer(index)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-2 text-sm text-slate-600">
                            <p>Role: {player.role}</p>
                            <p>NIC: {player.nicNumber}</p>
                            <p>Phone: {player.phoneNumber}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="field-label">Captain</label>
                    <select
                      className="field-input"
                      value={formData.captainIndex}
                      onChange={(event) => handleTeamFieldChange("captainIndex", event.target.value)}
                    >
                      <option value="">Select captain</option>
                      {formData.players.map((player, index) => (
                        <option key={`captain-${player.nicNumber}-${index}`} value={index}>
                          {getPlayerDisplayName(player, index)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Vice Captain</label>
                    <select
                      className="field-input"
                      value={formData.viceCaptainIndex}
                      onChange={(event) =>
                        handleTeamFieldChange("viceCaptainIndex", event.target.value)
                      }
                    >
                      <option value="">Select vice captain</option>
                      {formData.players.map((player, index) => (
                        <option key={`vice-${player.nicNumber}-${index}`} value={index}>
                          {getPlayerDisplayName(player, index)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {formData.players.map((player, index) => {
                    const isCaptain = Number(formData.captainIndex) === index;
                    const isViceCaptain = Number(formData.viceCaptainIndex) === index;

                    return (
                      <div
                        key={`leadership-${player.nicNumber}-${index}`}
                        className={`rounded-[1.6rem] border p-4 ${
                          isCaptain || isViceCaptain
                            ? "border-field-300 bg-field-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">
                            {getPlayerDisplayName(player, index)}
                          </p>
                          {isCaptain ? (
                            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                              Captain
                            </span>
                          ) : null}
                          {isViceCaptain ? (
                            <span className="rounded-full bg-pitch-500 px-3 py-1 text-xs font-semibold text-white">
                              Vice Captain
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {player.role} | {player.phoneNumber}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="info-card">
                    <p className="info-card-label">Team Name</p>
                    <p className="info-card-value">{formData.teamName}</p>
                  </div>
                  <div className="info-card">
                    <p className="info-card-label">Reference</p>
                    <p className="info-card-value">{formData.paymentReference}</p>
                  </div>
                  <div className="info-card">
                    <p className="info-card-label">Captain</p>
                    <p className="info-card-value">{captainName}</p>
                  </div>
                  <div className="info-card">
                    <p className="info-card-label">Vice Captain</p>
                    <p className="info-card-value">{viceCaptainName}</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-field-100 bg-field-100/70 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="section-kicker">Final Review</p>
                      <h4 className="mt-2 font-display text-2xl font-semibold text-ink">
                        Squad Summary
                      </h4>
                    </div>
                    <div className="rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                      Receipt: {formData.paymentReceipt?.name || "Not uploaded"}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {summaryPlayers.map((player, index) => (
                      <div key={`summary-${player.nicNumber}-${index}`} className="soft-card p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">
                            {getPlayerDisplayName(player, index)}
                          </p>
                          {player.isCaptain ? (
                            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                              Captain
                            </span>
                          ) : null}
                          {player.isViceCaptain ? (
                            <span className="rounded-full bg-pitch-500 px-3 py-1 text-xs font-semibold text-white">
                              Vice Captain
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{player.role}</p>
                        <p className="mt-1 text-sm text-slate-600">NIC: {player.nicNumber}</p>
                        <p className="mt-1 text-sm text-slate-600">Phone: {player.phoneNumber}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              className="secondary-button w-full sm:w-auto"
              type="button"
              onClick={goToPreviousStep}
              disabled={currentStep === 0 || isSubmitting}
            >
              Back
            </button>

            {currentStep < registrationSteps.length - 1 ? (
              <button className="primary-button w-full sm:w-auto" type="button" onClick={goToNextStep}>
                Continue
              </button>
            ) : (
              <button className="primary-button w-full sm:w-auto" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </button>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="soft-card sticky top-28 p-5">
            <p className="section-kicker">Registration Snapshot</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
              Before You Submit
            </h3>

            <div className="mt-5 space-y-3">
              {registrationSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-[1.4rem] border px-4 py-3 ${
                    currentStep === index
                      ? "border-field-400 bg-field-600 text-white shadow-lg shadow-field-600/20"
                      : currentStep > index
                        ? "border-field-100 bg-white/85"
                        : "border-slate-200 bg-slate-100/90"
                  }`}
                >
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${
                    currentStep === index ? "text-field-50" : "text-slate-500"
                  }`}>
                    Step 0{index + 1}
                  </p>
                  <p className={`mt-1 font-semibold ${currentStep === index ? "text-white" : "text-ink"}`}>
                    {step.title}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-field-100 bg-field-100/80 p-4 text-sm text-slate-700 shadow-sm">
              <p>
                Team: <span className="font-semibold text-ink">{formData.teamName || "Not entered"}</span>
              </p>
              <p className="mt-2">
                Players: <span className="font-semibold text-ink">{formData.players.length}</span>
              </p>
              <p className="mt-2">
                Captain: <span className="font-semibold text-ink">{captainName}</span>
              </p>
              <p className="mt-2">
                Vice Captain: <span className="font-semibold text-ink">{viceCaptainName}</span>
              </p>
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
}

export default TeamRegistrationPage;
