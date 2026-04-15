import { PLAYER_ROLE_OPTIONS } from "../../utils/constants";

function PlayerFields({
  player,
  index,
  onChange,
  onRemove,
  disableRemove,
  showLeadershipControls = false,
  showRemoveButton = true,
}) {
  return (
    <div className="soft-card p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-kicker">Player {index + 1}</p>
          <h3 className="font-display text-lg font-semibold text-ink">Squad Member Details</h3>
        </div>

        {showRemoveButton ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={disableRemove}
            className="w-full rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Remove
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="field-label">Name with Initials</label>
          <input
            className="field-input"
            value={player.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            placeholder="M.M. Fernando"
            required
          />
        </div>

        <div>
          <label className="field-label">Role</label>
          <select
            className="field-input"
            value={player.role}
            onChange={(event) => onChange("role", event.target.value)}
          >
            {PLAYER_ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">NIC Number</label>
          <input
            className="field-input"
            value={player.nicNumber}
            onChange={(event) => onChange("nicNumber", event.target.value)}
            placeholder="200012345678"
            required
          />
        </div>

        <div className="md:col-span-2 xl:col-span-4">
          <label className="field-label">Phone Number</label>
          <input
            className="field-input"
            value={player.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            placeholder="+94 77 123 4567"
            required
          />
        </div>
      </div>

      {showLeadershipControls ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="rounded-2xl border border-slate-200 bg-cream px-4 py-3 text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={player.isCaptain}
                onChange={(event) => onChange("isCaptain", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-field-600 focus:ring-field-300"
              />
              Mark as captain
            </span>
          </label>

          <label className="rounded-2xl border border-slate-200 bg-cream px-4 py-3 text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={player.isViceCaptain}
                onChange={(event) => onChange("isViceCaptain", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-field-600 focus:ring-field-300"
              />
              Mark as vice captain
            </span>
          </label>
        </div>
      ) : null}
    </div>
  );
}

export default PlayerFields;
