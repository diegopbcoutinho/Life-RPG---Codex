import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import StatsPanel from './components/StatsPanel'
import TaskPanel from './components/TaskPanel'
import WealthPanel from './components/WealthPanel'
import SkillTree from './components/SkillTree'
import LevelUpModal from './components/LevelUpModal'
import CharacterPanel from './components/CharacterPanel'
import DailyResetPanel from './components/DailyResetPanel'
import EpicQuestPanel from './components/EpicQuestPanel'
import WeeklyMissions from './components/WeeklyMissions'
import SoundToggle from './components/SoundToggle'
import { useLocalStorageState } from './hooks/useLocalStorage'
import {
  DIFFICULTY_XP,
  getDayKey,
  getLevelFromXP,
  getLevelProgress,
  getQuestCooldown,
  getWeekKey,
  getWealthProgress,
  MILESTONE_XP,
  WEEKLY_CHECK_IN_XP,
} from './utils/gameMath'
import { skills } from './data/skills'

const defaultTasks = [
  {
    id: 'task-1',
    title: 'Morning training session',
    category: 'health',
    difficulty: 'medium',
    xp: DIFFICULTY_XP.medium,
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Study a new skill for 45 minutes',
    category: 'learning',
    difficulty: 'easy',
    xp: DIFFICULTY_XP.easy,
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Pitch a new client',
    category: 'money',
    difficulty: 'hard',
    xp: DIFFICULTY_XP.hard,
    completed: false,
  },
]

const initialIncome = 3500

const playTone = (frequency = 440, duration = 0.12, volume = 0.08) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gainNode.gain.value = volume

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.start()
  oscillator.stop(audioCtx.currentTime + duration)
}

export default function App() {
  const [tasks, setTasks] = useLocalStorageState('lifeRpg.tasks', defaultTasks)
  const [totalXP, setTotalXP] = useLocalStorageState('lifeRpg.totalXP', 0)
  const [level, setLevel] = useLocalStorageState('lifeRpg.level', 1)
  const [skillPoints, setSkillPoints] = useLocalStorageState(
    'lifeRpg.skillPoints',
    0,
  )
  const [income, setIncome] = useLocalStorageState(
    'lifeRpg.income',
    initialIncome,
  )
  const [unlockedSkills, setUnlockedSkills] = useLocalStorageState(
    'lifeRpg.skills',
    [],
  )
  const [lastReset, setLastReset] = useLocalStorageState(
    'lifeRpg.lastReset',
    null,
  )
  const [streak, setStreak] = useLocalStorageState('lifeRpg.streak', 0)
  const [lastCompletedDay, setLastCompletedDay] = useLocalStorageState(
    'lifeRpg.lastCompletedDay',
    null,
  )
  const [soundEnabled, setSoundEnabled] = useLocalStorageState(
    'lifeRpg.sound',
    true,
  )
  const [avatar, setAvatar] = useLocalStorageState('lifeRpg.avatar', null)
  const [epicQuests, setEpicQuests] = useLocalStorageState('lifeRpg.epicQuests', [])
  const [weeklyMissions, setWeeklyMissions] = useLocalStorageState('lifeRpg.weeklyMissions', [])
  const [weeklyMissionsWeek, setWeeklyMissionsWeek] = useLocalStorageState('lifeRpg.weeklyMissionsWeek', null)
  const [weeklyCheckIn, setWeeklyCheckIn] = useLocalStorageState('lifeRpg.weeklyCheckIn', null)
  const [allWeeklyBonusClaimed, setAllWeeklyBonusClaimed] = useLocalStorageState('lifeRpg.allWeeklyBonus', null)

  const [showLevelUp, setShowLevelUp] = useState(false)
  const [gainedPoints, setGainedPoints] = useState(0)
  const didMount = useRef(false)

  const todayKey = getDayKey(new Date())
  const weekKey = getWeekKey(new Date())
  const levelInfo = useMemo(() => getLevelProgress(totalXP), [totalXP])
  const wealthInfo = useMemo(() => getWealthProgress(income), [income])

  useEffect(() => {
    const computedLevel = getLevelFromXP(totalXP)
    if (!didMount.current) {
      setLevel(computedLevel)
      didMount.current = true
      return
    }
    if (computedLevel > level) {
      const gained = (computedLevel - level) * 2
      setLevel(computedLevel)
      setSkillPoints((prev) => prev + gained)
      setGainedPoints(gained)
      setShowLevelUp(true)
      if (soundEnabled) playTone(880, 0.18, 0.1)
    }
  }, [totalXP, level, setLevel, setSkillPoints, soundEnabled])

  useEffect(() => {
    if (lastCompletedDay && lastCompletedDay !== todayKey) {
      const last = new Date(lastCompletedDay)
      const today = new Date(todayKey)
      const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24))
      if (diff > 1) {
        setStreak(0)
      }
    }
  }, [lastCompletedDay, todayKey, setStreak])

  useEffect(() => {
    if (lastReset !== todayKey) {
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          completed: false,
        })),
      )
      setLastReset(todayKey)
    }
  }, [lastReset, todayKey, setLastReset, setTasks])

  useEffect(() => {
    if (weeklyMissionsWeek !== weekKey) {
      setWeeklyMissions((prev) =>
        prev.map((m) => ({ ...m, completed: false })),
      )
      setWeeklyMissionsWeek(weekKey)
      setAllWeeklyBonusClaimed(null)
    }
  }, [weeklyMissionsWeek, weekKey, setWeeklyMissions, setWeeklyMissionsWeek, setAllWeeklyBonusClaimed])

  const handleAddEpicQuest = (quest) => {
    const id = crypto?.randomUUID?.() || `epic-${Date.now()}`
    setEpicQuests((prev) => [{ id, ...quest }, ...prev])
    if (soundEnabled) playTone(520, 0.12, 0.06)
  }

  const handleCompleteMilestone = (questId, milestoneId) => {
    setEpicQuests((prev) =>
      prev.map((quest) => {
        if (quest.id !== questId) return quest
        const updated = quest.milestones.map((ms) =>
          ms.id === milestoneId ? { ...ms, completed: true } : ms,
        )
        return { ...quest, milestones: updated }
      }),
    )
    setTotalXP((current) => current + MILESTONE_XP)
    if (soundEnabled) playTone(660, 0.16, 0.08)
  }

  const handleRemoveEpicQuest = (questId) => {
    setEpicQuests((prev) => prev.filter((q) => q.id !== questId))
  }

  const handleAddWeeklyMission = (mission) => {
    const id = crypto?.randomUUID?.() || `wm-${Date.now()}`
    setWeeklyMissions((prev) => [{ id, completed: false, ...mission }, ...prev])
    if (soundEnabled) playTone(520, 0.12, 0.06)
  }

  const handleCompleteWeeklyMission = (missionId) => {
    setWeeklyMissions((prev) => {
      const target = prev.find((m) => m.id === missionId)
      if (!target || target.completed) return prev
      setTotalXP((current) => current + target.xp)
      if (soundEnabled) playTone(660, 0.16, 0.08)
      const updated = prev.map((m) =>
        m.id === missionId ? { ...m, completed: true } : m,
      )
      const allDone = updated.every((m) => m.completed)
      if (allDone && updated.length > 0 && allWeeklyBonusClaimed !== weekKey) {
        setTotalXP((current) => current + 50)
        setAllWeeklyBonusClaimed(weekKey)
      }
      return updated
    })
  }

  const handleRemoveWeeklyMission = (missionId) => {
    setWeeklyMissions((prev) => prev.filter((m) => m.id !== missionId))
  }

  const handleWeeklyCheckIn = () => {
    if (weeklyCheckIn === weekKey) return
    setWeeklyCheckIn(weekKey)
    setTotalXP((current) => current + WEEKLY_CHECK_IN_XP)
    if (soundEnabled) playTone(740, 0.14, 0.08)
  }

  const handleAddTask = (task) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `task-${Date.now()}`

    setTasks((prev) => [
      {
        id,
        completed: false,
        ...task,
      },
      ...prev,
    ])
    if (soundEnabled) playTone(520, 0.12, 0.06)
  }

  const handleCompleteTask = (taskId) => {
    setTasks((prev) => {
      const target = prev.find((task) => task.id === taskId)
      if (!target || target.completed) return prev

      setTotalXP((current) => current + target.xp)

      if (lastCompletedDay !== todayKey) {
        setStreak((current) => (current === 0 ? 1 : current + 1))
        setLastCompletedDay(todayKey)
      }

      const cooldownDays = getQuestCooldown(target.difficulty)
      const cooldownUntil = new Date(todayKey)
      cooldownUntil.setDate(cooldownUntil.getDate() + cooldownDays)

      if (soundEnabled) playTone(660, 0.16, 0.08)

      return prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: true, cooldownUntil: cooldownUntil.toISOString().slice(0, 10) }
          : task,
      )
    })
  }

  const handleRemoveTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleIncomeChange = (value) => {
    const next = Number(value)
    setIncome(Number.isNaN(next) ? 0 : next)
  }

  const handleUnlockSkill = (skillId) => {
    setUnlockedSkills((prev) =>
      prev.includes(skillId) ? prev : [...prev, skillId],
    )
    setSkillPoints((prev) => Math.max(prev - 1, 0))
    if (soundEnabled) playTone(740, 0.12, 0.07)
  }

  const handleReset = () => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        completed: false,
        cooldownUntil: null,
      })),
    )
    setLastReset(todayKey)
    if (soundEnabled) playTone(420, 0.12, 0.05)
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const badges = useMemo(() => {
    const unlockedCount = unlockedSkills.length
    const questsCompleted = tasks.filter((task) => task.completed).length
    return [
      `Level ${level}`,
      `${questsCompleted} Quests`,
      `${unlockedCount} Skills`,
    ]
  }, [unlockedSkills.length, tasks, level])

  return (
    <div className="app-shell">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Header />
          <SoundToggle enabled={soundEnabled} onToggle={setSoundEnabled} />
        </div>

        <StatsPanel
          levelInfo={levelInfo}
          totalXP={totalXP}
          skillPoints={skillPoints}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="flex flex-col gap-6">
            <TaskPanel
              tasks={tasks}
              onAddTask={handleAddTask}
              onCompleteTask={handleCompleteTask}
              onRemoveTask={handleRemoveTask}
              todayKey={todayKey}
            />
            <WeeklyMissions
              weeklyMissions={weeklyMissions}
              weekKey={weekKey}
              onAddMission={handleAddWeeklyMission}
              onCompleteMission={handleCompleteWeeklyMission}
              onRemoveMission={handleRemoveWeeklyMission}
              weeklyCheckIn={weeklyCheckIn}
              onWeeklyCheckIn={handleWeeklyCheckIn}
            />
            <WealthPanel
              income={income}
              onIncomeChange={handleIncomeChange}
              wealthInfo={wealthInfo}
            />
            <DailyResetPanel
              todayKey={todayKey}
              lastReset={lastReset}
              onReset={handleReset}
            />
          </div>
          <div className="flex flex-col gap-6">
            <CharacterPanel
              avatar={avatar}
              onAvatarChange={handleAvatarChange}
              title="Eclipse Vanguard"
              archetype="Adaptive Strategist"
              streak={streak}
              badges={badges}
            />
            <EpicQuestPanel
              epicQuests={epicQuests}
              onAddEpicQuest={handleAddEpicQuest}
              onCompleteMilestone={handleCompleteMilestone}
              onRemoveEpicQuest={handleRemoveEpicQuest}
            />
            <SkillTree
              skills={skills}
              unlockedSkills={unlockedSkills}
              skillPoints={skillPoints}
              onUnlock={handleUnlockSkill}
            />
            <div className="hud-panel">
              <p className="hud-title">System Pulse</p>
              <h2 className="mt-2 text-xl text-white">Combat Readiness</h2>
              <p className="mt-3 text-sm text-slate-300">
                You have {tasks.filter((task) => !task.completed).length} active quests and
                {` ${skillPoints}`} skill points ready. Keep completing missions to
                unlock the next tier.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Active Quests</span>
                  <span className="text-white">
                    {tasks.filter((task) => !task.completed).length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Total XP Earned</span>
                  <span className="text-white">{totalXP}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LevelUpModal
        open={showLevelUp}
        level={level}
        gainedPoints={gainedPoints}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  )
}
