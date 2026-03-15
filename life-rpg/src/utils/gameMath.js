export const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 45,
}

export const xpForLevel = (level) => {
  return Math.floor(100 * level * level)
}

export const getLevelFromXP = (totalXP) => {
  let level = 1
  while (totalXP >= xpForLevel(level + 1)) {
    level += 1
  }
  return level
}

export const getLevelProgress = (totalXP) => {
  const level = getLevelFromXP(totalXP)
  const currentBase = xpForLevel(level)
  const nextBase = xpForLevel(level + 1)
  const current = totalXP - currentBase
  const needed = nextBase - currentBase
  const progress = needed === 0 ? 0 : Math.min(current / needed, 1)
  return { level, current, needed, progress, nextBase }
}

const WEALTH_THRESHOLDS = [
  0,
  1000,
  2500,
  5000,
  8000,
  12000,
  18000,
  25000,
  35000,
  50000,
  70000,
  90000,
]

export const getWealthProgress = (income) => {
  const safeIncome = Math.max(0, Number(income) || 0)
  let levelIndex = 0
  for (let i = 0; i < WEALTH_THRESHOLDS.length; i += 1) {
    if (safeIncome >= WEALTH_THRESHOLDS[i]) {
      levelIndex = i
    }
  }
  const currentBase = WEALTH_THRESHOLDS[levelIndex]
  const nextBase =
    WEALTH_THRESHOLDS[levelIndex + 1] ??
    WEALTH_THRESHOLDS[WEALTH_THRESHOLDS.length - 1] + 25000
  const progress =
    nextBase === currentBase
      ? 1
      : Math.min((safeIncome - currentBase) / (nextBase - currentBase), 1)

  return {
    level: levelIndex + 1,
    currentBase,
    nextBase,
    progress,
  }
}

export const getDayKey = (date = new Date()) => {
  return date.toISOString().slice(0, 10)
}

export const getStreakStatus = (lastCompletedDay, todayKey) => {
  if (!lastCompletedDay) {
    return { streak: 0, broken: false }
  }

  const last = new Date(lastCompletedDay)
  const today = new Date(todayKey)
  const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24))

  if (diff === 0) {
    return { streak: null, broken: false }
  }
  if (diff === 1) {
    return { streak: 'continue', broken: false }
  }
  return { streak: 0, broken: true }
}

export const getQuestCooldown = (difficulty) => {
  if (difficulty === 'hard') return 3
  if (difficulty === 'medium') return 2
  return 1
}

export const getWeekKey = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const dayOfWeek = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7))
  return monday.toISOString().slice(0, 10)
}

export const getWeekEnd = (weekKey) => {
  const d = new Date(weekKey)
  d.setDate(d.getDate() + 6)
  return d.toISOString().slice(0, 10)
}

export const getWeekLabel = (weekKey) => {
  const start = new Date(weekKey + 'T00:00:00')
  const end = new Date(weekKey + 'T00:00:00')
  end.setDate(end.getDate() + 6)
  const fmt = (d) => `${d.getDate()}/${d.getMonth() + 1}`
  return `${fmt(start)} – ${fmt(end)}`
}

export const MILESTONE_XP = 60

export const WEEKLY_CHECK_IN_XP = 30
