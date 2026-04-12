import { PLAYER_ROLE_OPTIONS } from "../../utils/constants";

function PlayerFields({ player, index, onChange, onRemove, disableRemove }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-field-700">
            Player {index + 1}
          </p>
          <h3 className="font-display text-lg font-semibold text-ink">
            Squad Member Details
          </h3>
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={disableRemove}
          className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="field-label">Full Name</label>
          <input
            className="field-input"
            value={player.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            placeholder="Enter player's full name"
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

        <div className="flex items-end rounded-2xl border border-slate-200 bg-cream px-4 py-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={player.isCaptain}
              onChange={(event) => onChange("isCaptain", event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-field-600 focus:ring-field-300"
            />
            Mark as captain
          </label>
        </div>

        <div>
          <label className="field-label">Age</label>
          <input
            className="field-input"
            type="number"
            value={player.age}
            onChange={(event) => onChange("age", event.target.value)}
            placeholder="18"
          />
        </div>

        <div>
          <label className="field-label">Jersey Number</label>
          <input
            className="field-input"
            type="number"
            value={player.jerseyNumber}
            onChange={(event) => onChange("jerseyNumber", event.target.value)}
            placeholder="7"
          />
        </div>

        <div>
          <label className="field-label">Batting Style</label>
          <input
            className="field-input"
            value={player.battingStyle}
            onChange={(event) => onChange("battingStyle", event.target.value)}
            placeholder="Right-hand bat"
          />
        </div>

        <div>
          <label className="field-label">Bowling Style</label>
          <input
            className="field-input"
            value={player.bowlingStyle}
            onChange={(event) => onChange("bowlingStyle", event.target.value)}
            placeholder="Right-arm medium"
          />
        </div>

        <div className="md:col-span-2 xl:col-span-4">
          <label className="field-label">Phone Number</label>
          <input
            className="field-input"
            value={player.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            placeholder="+94 77 123 4567"
          />
        </div>
      </div>
    </div>
  );
}

export default PlayerFields;
