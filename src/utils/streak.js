/**
 * EcoQuest - Streak Logic Utility
 *
 * Core rule: Multiple quests completed on the same calendar day count as only ONE Nature Day.
 */

/**
 * Format a Date object into local YYYY-MM-DD string
 * Avoids UTC timezone conversion shifts for pre-formatted strings
 * @param {Date|string|number} date
 * @returns {string}
 */
export const formatDateKey = (date = new Date()) => {
  if (typeof date === 'string') {
    const trimmed = date.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  }
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

  // Normalize all date strings and place into a fast-lookup Set
  const dateSet = new Set(
    completedDates
      .filter(Boolean)
      .map(d => formatDateKey(d))
  );

  const today = new Date();
  today.setHours(12, 0, 0, 0); // Noon anchor prevents DST boundary crossing
  const todayKey = formatDateKey(today);

  const hasToday = dateSet.has(todayKey);

  let checkDate = new Date(today);
  let streak = 0;

  if (hasToday) {
    // Today is completed -> counts as day 1 of the active streak
    streak = 1;
    // Walk backward starting from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (dateSet.has(formatDateKey(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    // Today is not completed yet -> check if yesterday was completed to keep streak alive
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayKey = formatDateKey(checkDate);
    if (!dateSet.has(yesterdayKey)) {
      return 0; // Missed yesterday and not completed today -> streak is 0
    }
    // Walk backward starting from yesterday
    while (dateSet.has(formatDateKey(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
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
  const completedSet = new Set((completedDates || []).filter(Boolean).map(d => formatDateKey(d)));
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  
  // Diff to Monday (Mon=0, Tue=1, ..., Sun=6)
  const diffToMonday = (currentDayOfWeek + 6) % 7;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(12, 0, 0, 0);

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
  const keyToAdd = formatDateKey(dateToAdd);
  const set = new Set();
  if (Array.isArray(existingDates)) {
    for (const d of existingDates) {
      if (d) {
        set.add(formatDateKey(d));
      }
    }
  }
  set.add(keyToAdd);
  return Array.from(set).sort();
};
