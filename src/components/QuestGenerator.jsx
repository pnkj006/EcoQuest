import React, { useState, useRef } from 'react';
import { generateQuest as generateQuestMock } from '../services/questGenerator.js';

const TIME_OPTIONS = [
  { id: '10', label: '10 Minutes' },
  { id: '20', label: '20 Minutes' },
  { id: '30', label: '30 Minutes' }
];

const ENVIRONMENT_OPTIONS = [
  { id: 'Park', label: 'Park' },
  { id: 'Urban', label: 'Urban' },
  { id: 'Nature', label: 'Nature' },
  { id: 'Anywhere', label: 'Anywhere' }
];

const MOOD_OPTIONS = [
  { id: 'Relaxed', label: 'Relaxed' },
  { id: 'Curious', label: 'Curious' },
  { id: 'Active', label: 'Active' },
  { id: 'Adventurous', label: 'Adventurous' }
];

const DIFFICULTY_OPTIONS = [
  { id: 'Easy', label: 'Easy' },
  { id: 'Medium', label: 'Medium' },
  { id: 'Challenging', label: 'Challenging' }
];

export default function QuestGenerator({ onStartQuest }) {
  const [selectedTime, setSelectedTime] = useState('20');
  const [selectedEnvironment, setSelectedEnvironment] = useState('Park');
  const [selectedMood, setSelectedMood] = useState('Curious');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');

  const [generatedQuest, setGeneratedQuest] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const resultRef = useRef(null);

  const handleGenerate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);

    const payload = {
      time: parseInt(selectedTime, 10) || 20,
      environment: selectedEnvironment.toLowerCase(),
      mood: selectedMood.toLowerCase(),
      difficulty: selectedDifficulty.toLowerCase()
    };

    try {
      const response = await fetch('/api/generate-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Server returned error status');
      }

      const questData = await response.json();
      if (!questData || !questData.title || !Array.isArray(questData.steps)) {
        throw new Error('Malformed quest response');
      }

      setGeneratedQuest(questData);
      setErrorMessage(null);

      // Smoothly scroll to the generated quest
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 60);
    } catch (err) {
      setErrorMessage('Something went wrong while creating your quest. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseFallback = () => {
    const fallbackQuest = generateQuestMock({
      time: `${selectedTime} minutes`,
      environment: selectedEnvironment,
      mood: selectedMood,
      difficulty: selectedDifficulty
    });
    setGeneratedQuest(fallbackQuest);
    setErrorMessage(null);
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  return (
    <section id="generator" className="generator-section">
      <div className="generator-inner">
        <div className="generator-header-center">
          <span className="editorial-eyebrow">Personalized Exploration</span>
          <h2 className="editorial-title">What are you in the mood for?</h2>
          <p className="editorial-lead" style={{ margin: '14px auto 0', textAlign: 'center' }}>
            Set your current constraints to receive an open-weight outdoor quest tailored to this moment.
          </p>
        </div>

        <div className="generator-form-wrapper">
          <form onSubmit={handleGenerate}>
            {/* TIME */}
            <div className="selector-row">
              <div className="selector-label">
                <span className="selector-name">Time</span>
                <span className="selector-current-value">{selectedTime} Minutes</span>
              </div>
              <div className="segmented-control">
                {TIME_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`segment-btn ${selectedTime === opt.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ENVIRONMENT */}
            <div className="selector-row">
              <div className="selector-label">
                <span className="selector-name">Environment</span>
                <span className="selector-current-value">{selectedEnvironment}</span>
              </div>
              <div className="segmented-control">
                {ENVIRONMENT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`segment-btn ${selectedEnvironment === opt.id ? 'selected' : ''}`}
                    onClick={() => setSelectedEnvironment(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MOOD */}
            <div className="selector-row">
              <div className="selector-label">
                <span className="selector-name">Mood</span>
                <span className="selector-current-value">{selectedMood}</span>
              </div>
              <div className="segmented-control">
                {MOOD_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`segment-btn ${selectedMood === opt.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DIFFICULTY */}
            <div className="selector-row">
              <div className="selector-label">
                <span className="selector-name">Difficulty</span>
                <span className="selector-current-value">{selectedDifficulty}</span>
              </div>
              <div className="segmented-control">
                {DIFFICULTY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`segment-btn ${selectedDifficulty === opt.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDifficulty(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="generator-submit-block">
              <button
                type="submit"
                className="btn-editorial btn-solid-dark"
                disabled={isGenerating}
                style={{ minWidth: 260 }}
              >
                {isGenerating ? 'CREATING YOUR QUEST...' : 'GENERATE MY QUEST →'}
              </button>
            </div>
          </form>

          {/* Clean Error Message if API fails */}
          {errorMessage && (
            <div style={{
              marginTop: 32,
              padding: '28px 24px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light-strong)',
              textAlign: 'center'
            }}>
              <span className="editorial-eyebrow" style={{ color: 'var(--color-clay)' }}>
                Generation Notice
              </span>
              <p style={{
                fontSize: '1rem',
                color: 'var(--text-dark-primary)',
                marginBottom: 20,
                lineHeight: 1.5
              }}>
                {errorMessage}
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-editorial btn-solid-dark"
                  onClick={handleGenerate}
                >
                  TRY AGAIN →
                </button>
                <button
                  type="button"
                  className="btn-editorial btn-outline-dark"
                  onClick={handleUseFallback}
                >
                  USE OFFLINE QUEST →
                </button>
              </div>
            </div>
          )}

          {/* Generated Result Display */}
          {generatedQuest && (
            <div ref={resultRef} className="generated-quest-display">
              <div className="meta-pill-editorial" style={{ color: 'var(--color-forest)' }}>
                <span>{generatedQuest.duration ? `${generatedQuest.duration} Minutes` : `${generatedQuest.time} Minutes`}</span>
                <span>/</span>
                <span>{generatedQuest.difficulty}</span>
                <span>/</span>
                <span>{generatedQuest.environment}</span>
              </div>

              <h3 className="editorial-title" style={{ fontSize: '2.4rem', margin: '8px 0 16px' }}>
                {generatedQuest.title}
              </h3>

              <p className="editorial-lead" style={{ marginBottom: 28, fontStyle: 'italic' }}>
                "{generatedQuest.description}"
              </p>

              <div style={{ marginBottom: 28 }}>
                <span className="editorial-eyebrow">Steps</span>
                <ul className="quest-steps-minimal" style={{ borderTop: 'none', paddingTop: 0 }}>
                  {generatedQuest.steps.map((st, i) => (
                    <li key={i} className="quest-step-item-minimal" style={{ color: 'var(--text-dark-secondary)' }}>
                      <span className="step-index-small" style={{ color: 'var(--color-forest)' }}>
                        0{i + 1}
                      </span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {(generatedQuest.bonus || generatedQuest.bonusChallenge) && (
                <div className="bonus-box-minimal" style={{ background: 'var(--color-canvas-stone)', borderLeftColor: 'var(--color-clay)', marginBottom: 32 }}>
                  <div className="bonus-label-minimal" style={{ color: 'var(--color-clay)' }}>
                    Bonus Challenge
                  </div>
                  <p className="bonus-text-minimal" style={{ color: 'var(--text-dark-secondary)' }}>
                    "{generatedQuest.bonus || generatedQuest.bonusChallenge}"
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-editorial btn-outline-dark"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  className="btn-editorial btn-solid-dark"
                  onClick={() => onStartQuest(generatedQuest)}
                >
                  START QUEST →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
