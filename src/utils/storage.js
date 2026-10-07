import { formatDateKey, calculateStreak, addCompletedDate } from './streak.js';

const STORAGE_KEY = 'ecoquest_state_v1';

export const LEVELS = [
  { name: 'Beginner', minXP: 0, maxXP: 199 },
  { name: 'Explorer', minXP: 200, maxXP: 499 },
  { name: 'Nature Walker', minXP: 500, maxXP: 999 },
  { name: 'Trail Seeker', minXP: 1000, maxXP: 1999 },
  { name: 'Eco Adventurer', minXP: 2000, maxXP: Infinity },
];

/**
 * Determine the user's level and progress toward the next level
 * @param {number} xp
 */
export const getLevelInfo = (xp = 0) => {
  const currentLevel = [...LEVELS].reverse().find(lvl => xp >= lvl.minXP) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1] || null;

  let progressPercent = 100;
  let xpToNext = 0;

  if (nextLevel) {
    const range = nextLevel.minXP - currentLevel.minXP;
    const currentProgress = xp - currentLevel.minXP;
    progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
    xpToNext = nextLevel.minXP - xp;
  }

  return {
    levelName: currentLevel.name,
    xp,
    nextLevelName: nextLevel ? nextLevel.name : null,
    nextLevelMinXP: nextLevel ? nextLevel.minXP : null,
    xpToNext,
    progressPercent
  };
};

/**
 * Generate relative past dates for realistic initial state (7-day streak through yesterday)
 */
export const generateInitialCompletedDates = () => {
  const dates = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  // Fill the previous 7 days through yesterday (excluding today, so today is ready to be conquered!)
  for (let i = 7; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(formatDateKey(d));
  }
  return dates;
};

const getInitialState = () => {
  const completedDates = generateInitialCompletedDates();
  const today = new Date();
  
  const formatDateDisplay = (daysAgo) => {
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return {
    completedDates,
    natureXP: 450,
    questsCompleted: 7,
    timeOutsideMinutes: 110,
    todayQuest: null, // Initially not created or ready to create
    journalEntries: [
      {
        id: 'entry-mock-1',
        date: formatDateDisplay(1),
        questTitle: 'Golden Hour Pine Scout',
        environment: 'Park',
        difficulty: 'Easy',
        durationMinutes: 20,
        reflection: 'Found three fallen pine cones of distinctly different sizes and observed how the evening sun lit up the tree canopy. Felt completely unplugged.',
        bonusCompleted: true,
        xpEarned: 20,
        photo: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'entry-mock-2',
        date: formatDateDisplay(2),
        questTitle: 'Urban Stone & Lichen Hunt',
        environment: 'Urban',
        difficulty: 'Medium',
        durationMinutes: 15,
        reflection: 'Discovered vibrant mint green lichen growing on an old stone wall right near the crosswalk. Walked by it a hundred times before and never looked.',
        bonusCompleted: false,
        xpEarned: 15,
        photo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'entry-mock-3',
        date: formatDateDisplay(3),
        questTitle: 'Breeze & Canopy Listening',
        environment: 'Nature',
        difficulty: 'Easy',
        durationMinutes: 25,
        reflection: 'Left my phone in my pocket the whole walk. Counted four distinct bird calls and watched a squirrel hide acorns.',
        bonusCompleted: true,
        xpEarned: 25,
        photo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  };
};

/**
 * Load app data from localStorage
 */
export const loadAppData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = getInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(stored);
    
    // Normalize stored completedDates
    let completedDates = Array.isArray(parsed.completedDates) && parsed.completedDates.length > 0
      ? parsed.completedDates.map(d => formatDateKey(d))
      : generateInitialCompletedDates();

    // If existing localStorage had the legacy 6-day mock streak, heal the 7th past day
    // so a user with an existing streak through yesterday gets 8 today
    const initial7 = generateInitialCompletedDates();
    const hasLegacy6 = initial7.slice(1).every(d => completedDates.includes(d));
    if (hasLegacy6 && !completedDates.includes(initial7[0])) {
      completedDates = addCompletedDate(completedDates, initial7[0]);
      parsed.completedDates = completedDates;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return {
      completedDates,
      natureXP: typeof parsed.natureXP === 'number' ? parsed.natureXP : 450,
      questsCompleted: typeof parsed.questsCompleted === 'number' ? parsed.questsCompleted : 7,
      timeOutsideMinutes: typeof parsed.timeOutsideMinutes === 'number' ? parsed.timeOutsideMinutes : 110,
      todayQuest: parsed.todayQuest || null,
      journalEntries: Array.isArray(parsed.journalEntries)
        ? parsed.journalEntries.map((entry, idx) => ({
            ...entry,
            id: entry.id || `entry-legacy-${idx}`
          }))
        : []
    };
  } catch (err) {
    console.error('Failed to load EcoQuest state:', err);
    return getInitialState();
  }
};

/**
 * Save app data to localStorage
 */
export const saveAppData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save EcoQuest state:', err);
  }
};

/**
 * Save active today's quest
 */
export const saveTodayQuest = (quest) => {
  const data = loadAppData();
  data.todayQuest = quest;
  saveAppData(data);
  return data;
};

/**
 * Record a completed quest, updating XP, streak, minutes, and journal
 */
export const recordQuestCompletion = ({
  quest,
  reflection = 'What did you notice?',
  photo = null,
  bonusCompleted = false,
  actualMinutes = null
}) => {
  const data = loadAppData();

  // Determine quest duration in minutes (e.g. 10, 20, 30)
  const rawMinutes = actualMinutes ?? quest?.duration ?? quest?.time ?? 20;
  const parsed = typeof rawMinutes === 'number' ? rawMinutes : parseInt(String(rawMinutes).replace(/[^\d]/g, ''), 10);
  const minutes = (!isNaN(parsed) && parsed > 0) ? parsed : 20;

  // 1. XP: Award XP based on duration (10 min = 10 XP, 20 min = 20 XP, 30 min = 30 XP)
  const xpEarned = minutes;
  const newXP = (data.natureXP || 0) + xpEarned;

  // 2. Outdoor Time: Add to existing minutes without resetting
  const newTimeOutside = (data.timeOutsideMinutes || 0) + minutes;

  // 3. Quests Completed: Increment existing counter by 1
  const newQuestsCompleted = (data.questsCompleted || 0) + 1;

  // 4. Nature Streak: Mark today as completed outdoor day (deduplicated)
  const todayKey = formatDateKey(new Date());
  const updatedDates = addCompletedDate(data.completedDates, todayKey);
  const currentStreak = calculateStreak(updatedDates);

  // Level info
  const prevLevel = getLevelInfo(data.natureXP || 0).levelName;
  const nextLevel = getLevelInfo(newXP).levelName;
  const leveledUp = prevLevel !== nextLevel;

  // 5. Journal Entry
  const todayDisplay = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const newEntry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: todayDisplay,
    dateKey: todayKey,
    questTitle: quest?.title || 'Outdoor Exploration',
    duration: minutes,
    durationMinutes: minutes,
    environment: quest?.environment || 'Outside',
    difficulty: quest?.difficulty || 'Easy',
    reflection: (reflection && reflection.trim()) ? reflection.trim() : 'What did you notice?',
    bonusCompleted: !!bonusCompleted,
    xpEarned,
    photo
  };

  data.natureXP = newXP;
  data.completedDates = updatedDates;
  data.questsCompleted = newQuestsCompleted;
  data.timeOutsideMinutes = newTimeOutside;
  data.journalEntries = [newEntry, ...(data.journalEntries || [])];
  data.todayQuest = { ...quest, completed: true, completedAt: new Date().toISOString() };

  saveAppData(data);

  return {
    updatedData: data,
    xpEarned,
    newStreak: currentStreak,
    leveledUp,
    newLevel: nextLevel,
    entry: newEntry
  };
};

/**
 * Delete a single journal entry by ID from localStorage
 * Does not affect streak, XP, or other sections
 * @param {string} entryId
 * @returns {Object} updated app data
 */
export const deleteJournalEntry = (entryId) => {
  const data = loadAppData();
  if (Array.isArray(data.journalEntries)) {
    data.journalEntries = data.journalEntries.filter(entry => entry.id !== entryId);
    saveAppData(data);
  }
  return data;
};

/**
 * Reset storage back to clean state
 */
export const resetAppData = () => {
  const initial = getInitialState();
  saveAppData(initial);
  return initial;
};
