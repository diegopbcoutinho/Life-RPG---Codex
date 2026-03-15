import { useState } from 'react'
import { MILESTONE_XP } from '../utils/gameMath'

const EPIC_CATEGORIES = [
  { id: 'health', label: 'Health', color: 'emerald' },
  { id: 'money', label: 'Money', color: 'amber' },
  { id: 'learning', label: 'Learning', color: 'violet' },
  { id: 'discipline', label: 'Discipline', color: 'rose' },
]

const COLOR_MAP = {
  emerald: {
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-500/20 text-emerald-200',
    border: 'border-emerald-400/40',
    glow: 'shadow-[0_0_16px_rgba(52,211,153,0.25)]',
  },
  amber: {
    bar: 'bg-amber-500',
    badge: 'bg-amber-500/20 text-amber-200',
    border: 'border-amber-400/40',
    glow: 'shadow-[0_0_16px_rgba(245,158,11,0.25)]',
  },
  violet: {
    bar: 'bg-violet-500',
    badge: 'bg-violet-500/20 text-violet-200',
    border: 'border-violet-400/40',
    glow: 'shadow-[0_0_16px_rgba(167,139,250,0.25)]',
  },
  rose: {
    bar: 'bg-rose-500',
    badge: 'bg-rose-500/20 text-rose-200',
    border: 'border-rose-400/40',
    glow: 'shadow-[0_0_16px_rgba(244,63,94,0.25)]',
  },
}

export default function EpicQuestPanel({
  epicQuests,
  onAddEpicQuest,
  onCompleteMilestone,
  onRemoveEpicQuest,
}) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('health')
  const [deadline, setDeadline] = useState('')
  const [milestoneInputs, setMilestoneInputs] = useState(['', '', ''])

  const handleAddMilestoneInput = () => {
    setMilestoneInputs((prev) => [...prev, ''])
  }

  const handleMilestoneChange = (index, value) => {
    setMilestoneInputs((prev) => prev.map((m, i) => (i === index ? value : m)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const milestones = milestoneInputs
      .filter((m) => m.trim())
      .map((m, i) => ({
        id: `ms-${Date.now()}-${i}`,
        title: m.trim(),
        completed: false,
      }))
    if (milestones.length === 0) return
    onAddEpicQuest({
      title: title.trim(),
      category,
      deadline: deadline || null,
      milestones,
    })
    setTitle('')
    setCategory('health')
    setDeadline('')
    setMilestoneInputs(['', '', ''])
    setShowForm(false)
  }

  return (
    <div className="hud-panel">
      <div className="flex items-center justify-between">
        <div>
          <p className="hud-title">Epic Quests</p>
          <h2 className="mt-2 text-xl text-white">Long-Term Goals</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="stat-pill cursor-pointer transition hover:bg-white/20"
        >
          {showForm ? 'Cancel' : '+ New Epic'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Epic quest name (e.g. Burn 5kg)"
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none"
            >
              {EPIC_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Milestones (+{MILESTONE_XP} XP each)
            </p>
            {milestoneInputs.map((m, i) => (
              <input
                key={i}
                value={m}
                onChange={(e) => handleMilestoneChange(i, e.target.value)}
                placeholder={`Milestone ${i + 1}`}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white focus:border-sky-400/60 focus:outline-none"
              />
            ))}
            <button
              type="button"
              onClick={handleAddMilestoneInput}
              className="text-xs text-sky-300 transition hover:text-sky-200"
            >
              + Add milestone
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl border border-sky-400/40 bg-sky-500/20 px-4 py-3 text-sm uppercase tracking-[0.2em] text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/30"
          >
            Create Epic Quest
          </button>
        </form>
      )}

      <div className="mt-5 space-y-4">
        {epicQuests.length === 0 && !showForm && (
          <p className="text-sm text-slate-400">
            No epic quests yet. Create one to break long-term goals into milestones.
          </p>
        )}
        {epicQuests.map((quest) => {
          const catMeta = EPIC_CATEGORIES.find((c) => c.id === quest.category)
          const colors = COLOR_MAP[catMeta?.color || 'emerald']
          const completedCount = quest.milestones.filter((m) => m.completed).length
          const totalCount = quest.milestones.length
          const progress = totalCount > 0 ? completedCount / totalCount : 0
          const isComplete = completedCount === totalCount

          return (
            <div
              key={quest.id}
              className={`rounded-2xl border border-white/10 bg-slate-950/70 p-4 ${isComplete ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-white">{quest.title}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 ${colors.badge}`}>
                      {catMeta?.label}
                    </span>
                    {quest.deadline && (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-slate-400">
                        Due: {quest.deadline}
                      </span>
                    )}
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-slate-400">
                      {completedCount}/{totalCount} milestones
                    </span>
                  </div>
                </div>
                {!isComplete && (
                  <button
                    type="button"
                    onClick={() => onRemoveEpicQuest(quest.id)}
                    className="text-xs text-slate-500 transition hover:text-slate-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mt-3">
                <div className="progress-track">
                  <div
                    className={`progress-fill ${colors.bar}`}
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-slate-500">
                  {Math.round(progress * 100)}%
                </p>
              </div>

              <div className="mt-2 space-y-1.5">
                {quest.milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => !ms.completed && onCompleteMilestone(quest.id, ms.id)}
                      disabled={ms.completed}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        ms.completed
                          ? `${colors.border} bg-white/10`
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      {ms.completed && (
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
                    <span
                      className={`text-sm ${ms.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}
                    >
                      {ms.title}
                    </span>
                    {ms.completed && (
                      <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                        +{MILESTONE_XP} XP
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {isComplete && (
                <div className={`mt-3 rounded-xl ${colors.border} border bg-white/5 px-3 py-2 text-center`}>
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Epic Quest Complete!
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
