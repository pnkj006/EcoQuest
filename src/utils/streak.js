/**
 * EcoQuest - Streak Logic Utility
 *
 * Core rule: Multiple quests completed on the same calendar day count as only ONE Nature Day.
 */

/**
 * Format a Date object into local YYYY-MM-DD string
 * @param {Date|string|number} date
 * @returns {string}
 */
export const formatDateKey = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate the current consecutive outdoor streak in days
 * @param {string[]} completedDates - Array of YYYY-MM-DD date strings
 * @returns {number}
 */
export const calculateStreak = (completedDates = []) => {
  if (!Array.isArray(completedDates) || completedDates.length === 0) {
    return 0;
  }

  const dateSet = new Set(completedDates);
  const today = new Date();
  const todayKey = formatDateKey(today);

  // Check if today is completed
  let hasToday = dateSet.has(todayKey);

  // If today is completed, streak starts at today and checks backwards
  // If today is NOT completed, check if yesterday was completed to keep streak alive
  let checkDate = new Date(today);
  let streak = 0;

  if (hasToday) {
    streak = 1;
    // Walk backward day by day starting from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Check yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayKey = formatDateKey(checkDate);
    if (!dateSet.has(yesterdayKey)) {
      return 0;
    }
    streak = 1;
    // Walk backward starting from 2 days ago
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Continue checking previous days
  while (true) {
    const key = formatDateKey(checkDate);
    if (dateSet.has(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Returns the current calendar week (Monday to Sunday) with completion status
 * @param {string[]} completedDates
 * @returns {Array<{ label: string, dateKey: string, isToday: boolean, isCompleted: boolean }>}
 */
export const getWeeklyStreakStatus = (completedDates = []) => {
  const completedSet = new Set(completedDates || []);
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  
  // Diff to Monday (Mon=0, Tue=1, ..., Sun=6)
  const diffToMonday = (currentDayOfWeek + 6) % 7;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const dateKey = formatDateKey(dayDate);
    const isToday = dateKey === formatDateKey(now);
    const isCompleted = completedSet.has(dateKey);

    weekDays.push({
      label: dayLabels[i],
      dateKey,
      isToday,
      isCompleted
    });
  }

  return weekDays;
};

/**
 * Safely add today's date to completed dates without duplication
 * @param {string[]} existingDates
 * @param {string} [dateToAdd]
 * @returns {string[]}
 */
export const addCompletedDate = (existingDates = [], dateToAdd = formatDateKey(new Date())) => {
  const set = new Set(existingDates);
  set.add(dateToAdd);
  return Array.from(set).sort();
};
