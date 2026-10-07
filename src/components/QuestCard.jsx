import React from 'react';

export default function QuestCard({ quest, onStartQuest, onRegenerate, isRegenerating = false }) {
  if (!quest) return null;

  return (
    <div className="generated-quest-display">
      <div className="meta-pill-editorial" style={{ color: 'var(--color-forest)' }}>
        <span>{quest.timeLabel || `${quest.time} Minutes`}</span>
        <span>/</span>
        <span>{quest.difficulty}</span>
        <span>/</span>
        <span>{quest.environment}</span>
        <span>/</span>
        <span>{quest.mood}</span>
      </div>

      <h3 className="editorial-title" style={{ fontSize: '2.4rem', margin: '8px 0 12px' }}>
        {quest.title}
      </h3>
      {quest.subtitle && (
        <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-forest)', marginBottom: 12 }}>
          {quest.subtitle}
        </p>
      )}
      <p className="editorial-lead" style={{ marginBottom: 24 }}>{quest.description}</p>

      <div style={{ marginBottom: 20 }}>
        <span className="editorial-eyebrow">Your Mission</span>
        <p style={{ fontSize: '1rem', color: 'var(--text-dark-primary)', fontWeight: 500 }}>
          {quest.mission}
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span className="editorial-eyebrow">Steps to Explore</span>
        <ul className="quest-steps-minimal" style={{ borderTop: 'none', paddingTop: 0 }}>
          {quest.steps.map((step, idx) => (
            <li key={idx} className="quest-step-item-minimal" style={{ color: 'var(--text-dark-secondary)' }}>
              <span className="step-index-small" style={{ color: 'var(--color-forest)' }}>
                0{idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {quest.bonusChallenge && (
        <div className="bonus-box-minimal" style={{ background: 'var(--color-canvas-stone)', borderLeftColor: 'var(--color-clay)', marginBottom: 28 }}>
          <div className="bonus-label-minimal" style={{ color: 'var(--color-clay)' }}>
            Bonus Challenge — +25 XP
          </div>
          <p className="bonus-text-minimal" style={{ color: 'var(--text-dark-secondary)' }}>
            {quest.bonusChallenge}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        {onRegenerate && (
          <button
            type="button"
            className="btn-editorial btn-outline-dark"
            onClick={onRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? 'Generating...' : 'Try Another'}
          </button>
        )}
        <button
          type="button"
          className="btn-editorial btn-solid-dark"
          onClick={() => onStartQuest(quest)}
        >
          Start Quest →
        </button>
      </div>
    </div>
  );
}
