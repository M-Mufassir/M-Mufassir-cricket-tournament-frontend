import PlayerFields from "../forms/PlayerFields";

function TeamEditForm({
  formData,
  onTeamFieldChange,
  onPlayerChange,
  onAddPlayer,
  onRemovePlayer,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">Tournament ID</label>
          <input
            className="field-input"
            type="number"
            value={formData.tournamentId}
            onChange={(event) => onTeamFieldChange("tournamentId", event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label">Team Name</label>
          <input
            className="field-input"
            value={formData.teamName}
            onChange={(event) => onTeamFieldChange("teamName", event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label">Club Name</label>
          <input
            className="field-input"
            value={formData.clubName}
            onChange={(event) => onTeamFieldChange("clubName", event.target.value)}
          />
        </div>

        <div>
          <label className="field-label">Captain Name</label>
          <input
            className="field-input"
            value={formData.captainName}
            onChange={(event) => onTeamFieldChange("captainName", event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label">Contact Email</label>
          <input
            className="field-input"
            type="email"
            value={formData.contactEmail}
            onChange={(event) => onTeamFieldChange("contactEmail", event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label">Contact Phone</label>
          <input
            className="field-input"
            value={formData.contactPhone}
            onChange={(event) => onTeamFieldChange("contactPhone", event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label">City</label>
          <input
            className="field-input"
            value={formData.city}
            onChange={(event) => onTeamFieldChange("city", event.target.value)}
          />
        </div>

        <div>
          <label className="field-label">Coach Name</label>
          <input
            className="field-input"
            value={formData.coachName}
            onChange={(event) => onTeamFieldChange("coachName", event.target.value)}
          />
        </div>

        <div>
          <label className="field-label">Payment Reference</label>
          <input
            className="field-input"
            value={formData.paymentReference}
            onChange={(event) => onTeamFieldChange("paymentReference", event.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="field-label">Admin Notes</label>
          <textarea
            className="field-input min-h-28 resize-y"
            value={formData.notes}
            onChange={(event) => onTeamFieldChange("notes", event.target.value)}
            placeholder="Internal note for admin use"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-display text-xl font-semibold text-ink">Edit Squad</h4>
          <p className="text-sm text-slate-600">Keep the squad between 11 and 20 players.</p>
        </div>

        <button className="secondary-button" type="button" onClick={onAddPlayer}>
          Add Player
        </button>
      </div>

      <div className="space-y-4">
        {formData.players.map((player, index) => (
          <PlayerFields
            key={`${index}-${player.fullName}`}
            player={player}
            index={index}
            onChange={(field, value) => onPlayerChange(index, field, value)}
            onRemove={() => onRemovePlayer(index)}
            disableRemove={formData.players.length <= 11}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Team Changes"}
        </button>
      </div>
    </form>
  );
}

export default TeamEditForm;
