import React from 'react';
import { getWeeklyStreakStatus } from '../utils/streak.js';

export default function StreakSection({ streak, completedDates, onNavigate }) {
  const weekDays = getWeeklyStreakStatus(completedDates);

  return (
    <section id="streak" className="streak-panoramic-section">
      <div className="streak-inner">
        <span className="editorial-eyebrow light">Daily Outdoor Habit</span>

        <h2 className="editorial-title light" style={{ letterSpacing: '0.04em' }}>
          Your Nature Streak
        </h2>

        <div className="streak-number-hero">
          {streak} {streak === 1 ? 'Day' : 'Days'}
        </div>

        {/* Minimal Weekly Calendar */}
        <div className="calendar-strip-minimal">
          {weekDays.map(day => (
            <div
              key={day.dateKey}
              className={`calendar-day-col ${day.isToday ? 'is-today' : ''}`}
            >
              <span className="cal-day-label">{day.label}</span>
              <div
                className={`cal-day-status ${day.isCompleted ? 'completed' : 'pending'}`}
                title={`${day.label} (${day.dateKey})${day.isCompleted ? ' — Nature Day Logged' : ''}`}
              >
                {day.isCompleted ? '✓' : '○'}
              </div>
            </div>
          ))}
        </div>

        <p className="streak-philosophy-text">
          "Consistency beats intensity. One outdoor moment every day."
        </p>

        <button
          className="btn-editorial btn-outline-light"
          onClick={() => {
            const el = document.getElementById('journal');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else onNavigate('journal');
          }}
        >
          View Journal →
        </button>
      </div>
    </section>
  );
}
