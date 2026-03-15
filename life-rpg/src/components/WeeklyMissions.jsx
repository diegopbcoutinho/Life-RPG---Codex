import { useState } from 'react'
import { DIFFICULTY_XP, getWeekLabel } from '../utils/gameMath'

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

export default function WeeklyMissions({
  weeklyMissions,
  weekKey,
  onAddMission,
  onCompleteMission,
  onRemoveMission,
  weeklyCheckIn,
  onWeeklyCheckIn,
}) {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [showForm, setShowForm] = useState(false)

  const weekLabel = getWeekLabel(weekKey)
  const completedCount = weeklyMissions.filter((m) => m.completed).length
  const totalCount = weeklyMissions.length
  const allDone = totalCount > 0 && completedCount === totalCount
  const hasCheckedIn = weeklyCheckIn === weekKey

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAddMission({
      title: title.trim(),
      difficulty,
      xp: DIFFICULTY_XP[difficulty],
    })
    setTitle('')
    setDifficulty('medium')
  }

  return (
    <div className="hud-panel">
      <div className="flex items-center justify-between">
        <div>
          <p className="hud-title">Weekly Missions</p>
          <h2 className="mt-2 text-xl text-white">Week of {weekLabel}</h2>
        </div>
        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <span className="stat-pill">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
      </div>

      {totalCount > 0 && (
        <div className="mt-4">
          <div className="progress-track">
            <div
              className="progress-fill bg-sky-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {weeklyMissions.map((mission) => (
          <div
            key={mission.id}
            className={`flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 ${
              mission.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => !mission.completed && onCompleteMission(mission.id)}
                disabled={mission.completed}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  mission.completed
                    ? 'border-emerald-400/40 bg-white/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {mission.completed && (
                  <svg
                    className="h-3 w-3 text-emerald-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div>
                <p className={`text-sm ${mission.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                  {mission.title}
                </p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  {mission.difficulty} · +{mission.xp} XP
                </span>
              </div>
            </div>
            {!mission.completed && (
              <button
                type="button"
                onClick={() => onRemoveMission(mission.id)}
                className="text-xs text-slate-500 transition hover:text-slate-300"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {weeklyMissions.length === 0 && !showForm && (
        <p className="mt-4 text-sm text-slate-400">
          Add weekly missions — small steps toward your epic quests.
        </p>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Weekly mission (e.g. 4 gym sessions)"
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl border border-sky-400/40 bg-sky-500/20 px-4 py-3 text-sm uppercase tracking-[0.2em] text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/30"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-400 transition hover:border-white/20"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-4 w-full rounded-xl border border-white/10 border-dashed bg-white/[0.02] px-4 py-3 text-sm text-slate-400 transition hover:border-white/20 hover:text-slate-200"
        >
          + Add Weekly Mission
        </button>
      )}

      {!hasCheckedIn && (
        <button
          type="button"
          onClick={onWeeklyCheckIn}
          className="mt-4 w-full rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm uppercase tracking-[0.2em] text-amber-200 transition hover:border-amber-400 hover:bg-amber-500/25"
        >
          Weekly Check-in (+30 XP)
        </button>
      )}

      {hasCheckedIn && (
        <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2.5 text-center text-xs uppercase tracking-[0.2em] text-emerald-300">
          Checked in this week
        </div>
      )}

      {allDone && (
        <div className="mt-3 rounded-xl border border-sky-400/20 bg-sky-500/10 px-4 py-2.5 text-center text-xs uppercase tracking-[0.2em] text-sky-300">
          All weekly missions complete! +50 XP Bonus
        </div>
      )}
    </div>
  )
}
