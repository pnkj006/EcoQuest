import React, { useState, useEffect, useRef } from 'react';

/**
 * Robust helper to extract duration in minutes from various quest object formats
 */
const getQuestMinutes = (quest) => {
  if (!quest) return 20;
  const raw = quest.duration ?? quest.time ?? 20;
  if (typeof raw === 'number' && !isNaN(raw) && raw > 0) return raw;
  const parsed = parseInt(String(raw).replace(/[^\d]/g, ''), 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : 20;
};

export default function ActiveQuest({ quest, onCompleteQuest, onContinue, onCancelQuest }) {
  const totalMinutes = getQuestMinutes(quest);
  const totalSeconds = totalMinutes * 60;

  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(true);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef(null);

  // Sync state if quest changes
  useEffect(() => {
    const mins = getQuestMinutes(quest);
    setSecondsRemaining(mins * 60);
    setIsActive(true);
    setIsCompleted(false);
    setCheckedSteps({});
  }, [quest]);

  // Main countdown timer
  useEffect(() => {
    if (!isActive || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isCompleted]);

  const togglePause = () => {
    if (secondsRemaining > 0) {
      setIsActive(prev => !prev);
    }
  };

  const handleToggleStep = (index) => {
    setCheckedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Helper for quick verification during testing
  const handleFastForward = (seconds) => {
    setSecondsRemaining(Math.max(0, seconds));
    if (seconds <= 0) {
      setIsActive(false);
    }
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handleComplete = () => {
    if (isCompleted) return; // Prevent double execution
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsActive(false);
    setIsCompleted(true);
    if (onCompleteQuest) {
      onCompleteQuest(quest, totalMinutes);
    }
  };

  const handleContinueClick = () => {
    if (onContinue) {
      onContinue();
    } else if (onCancelQuest) {
      onCancelQuest();
    }
  };

  const questSteps = Array.isArray(quest?.steps) ? quest.steps : [];

  return (
    <div className="focus-view-container">
      <div className="focus-view-card">
        {isCompleted ? (
          /* Quest Complete State */
          <div className="quest-completion-state" style={{ textAlign: 'center', padding: '36px 0' }}>
            <span className="editorial-eyebrow light" style={{ letterSpacing: '0.2em' }}>
              QUEST COMPLETE
            </span>

            <h2 className="editorial-title light" style={{ fontSize: '2.5rem', margin: '14px 0 20px', lineHeight: 1.2 }}>
              You made time to step outside.
            </h2>

            <div style={{
              margin: '0 auto 36px',
              maxWidth: 520,
              padding: '22px 26px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <span style={{
                display: 'block',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-light-muted)',
                marginBottom: 8
              }}>
                Completed Quest
              </span>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                color: 'var(--text-light-primary)',
                margin: '0 0 10px 0',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: 1.25
              }}>
                {quest?.title || 'Outdoor Exploration'}
              </h3>
              <div style={{ fontSize: '0.8125rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-clay)', fontWeight: 600 }}>
                +{totalMinutes} XP Earned · {totalMinutes} Minutes Logged
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-editorial btn-solid-light"
                onClick={handleContinueClick}
                style={{ minWidth: 200 }}
              >
                CONTINUE
              </button>
            </div>
          </div>
        ) : (
          /* Active Quest Exploration View */
          <>
            {/* Admonition banner */}
            <div className="admonition-banner-editorial">
              <span className="editorial-eyebrow light">Exploration in Progress</span>
              <h2 className="admonition-title-editorial">
                Your quest has started. Put your phone away and explore.
              </h2>
              <p className="admonition-sub-editorial">
                EcoQuest is designed for presence. Pocket your device, step into the open air, and observe the details of your landscape.
              </p>
            </div>

            {/* Quest meta */}
            <div className="meta-pill-editorial" style={{ justifyContent: 'center' }}>
              <span>{totalMinutes} Minutes</span>
              <span>/</span>
              <span>{quest?.difficulty || 'Easy'}</span>
              <span>/</span>
              <span>{quest?.environment || 'Outside'}</span>
            </div>

            {/* Large Countdown Timer */}
            <div className="countdown-timer-large">{formattedTime}</div>

            <div className="timer-subtext">
              {secondsRemaining === 0 ? (
                <span style={{ color: 'var(--color-clay)', fontWeight: 600, letterSpacing: '0.12em' }}>
                  TIME COMPLETE
                </span>
              ) : isActive ? (
                'Timer running in background'
              ) : (
                'Timer paused'
              )}
            </div>

            {/* Start / Pause & Complete Controls */}
            <div className="timer-action-row" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-editorial btn-outline-light"
                onClick={togglePause}
                style={{ minWidth: 140 }}
                disabled={secondsRemaining === 0}
              >
                {isActive ? 'Pause' : 'Start'}
              </button>

              <button
                type="button"
                className="btn-editorial btn-solid-light"
                onClick={handleComplete}
                style={{ minWidth: 200 }}
              >
                COMPLETE QUEST
              </button>
            </div>

            {/* Mission details & steps */}
            <div style={{ textAlign: 'left', marginTop: 32, borderTop: '1px solid var(--border-dark)', paddingTop: 28 }}>
              <h3 className="editorial-title light" style={{ fontSize: '1.8rem', marginBottom: 12 }}>
                {quest?.title}
              </h3>

              {quest?.description && (
                <p style={{ color: 'var(--text-light-secondary)', marginBottom: 20, fontSize: '0.95rem', fontStyle: 'italic' }}>
                  "{quest.description}"
                </p>
              )}

              <span className="editorial-eyebrow light">Steps Checklist</span>
              <ul className="quest-steps-minimal" style={{ borderTop: 'none', paddingTop: 0 }}>
                {questSteps.map((step, idx) => {
                  const isChecked = !!checkedSteps[idx];
                  return (
                    <li
                      key={idx}
                      className="quest-step-item-minimal"
                      style={{
                        cursor: 'pointer',
                        opacity: isChecked ? 0.45 : 1,
                        textDecoration: isChecked ? 'line-through' : 'none'
                      }}
                      onClick={() => handleToggleStep(idx)}
                    >
                      <span className="step-index-small">0{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  );
                })}
              </ul>

              {(quest?.bonus || quest?.bonusChallenge) && (
                <div className="bonus-box-minimal">
                  <div className="bonus-label-minimal">Bonus Challenge</div>
                  <p className="bonus-text-minimal">
                    "{quest.bonus || quest.bonusChallenge}"
                  </p>
                </div>
              )}
            </div>

            {/* Testing Shortcuts */}
            <div className="testing-shortcuts-strip">
              <span>Testing tool:</span>
              <button
                type="button"
                className="testing-btn"
                onClick={() => handleFastForward(5)}
              >
                Jump to 00:05
              </button>
              <button
                type="button"
                className="testing-btn"
                onClick={() => handleFastForward(0)}
              >
                Jump to 00:00 (Time Complete)
              </button>
            </div>

            <div style={{ marginTop: 28 }}>
              <button
                type="button"
                className="btn-text-editorial light"
                onClick={onCancelQuest}
              >
                Cancel and Return Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
