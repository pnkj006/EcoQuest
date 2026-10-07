import React, { useState } from 'react';
import { generateQuest } from '../services/ai';
import QuestCard from './QuestCard';

const TIME_OPTIONS = [
  { id: '10', label: '10 Min', sub: 'Quick reset' },
  { id: '20', label: '20 Min', sub: 'Balanced walk' },
  { id: '30', label: '30 Min', sub: 'Deep immersion' }
];

const ENVIRONMENT_OPTIONS = [
  { id: 'Park', label: 'Park', sub: 'Trees & lawns' },
  { id: 'Urban', label: 'Urban', sub: 'City streets & alleys' },
  { id: 'Nature', label: 'Nature', sub: 'Trails & woods' },
  { id: 'Anywhere', label: 'Anywhere', sub: 'Right outside your door' }
];

const MOOD_OPTIONS = [
  { id: 'Relaxed', label: 'Relaxed', sub: 'Calm & grounding' },
  { id: 'Curious', label: 'Curious', sub: 'Observant & mindful' },
  { id: 'Active', label: 'Active', sub: 'Energizing pace' },
  { id: 'Adventurous', label: 'Adventurous', sub: 'Bold exploration' }
];

const DIFFICULTY_OPTIONS = [
  { id: 'Easy', label: 'Easy', sub: 'Gentle & simple' },
  { id: 'Medium', label: 'Medium', sub: 'Engaging details' },
  { id: 'Challenging', label: 'Challenging', sub: 'Deep focus' }
];

export default function QuestSetup({ onStartQuest, initialQuest = null }) {
  const [selectedTime, setSelectedTime] = useState('20');
  const [selectedEnvironment, setSelectedEnvironment] = useState('Park');
  const [selectedMood, setSelectedMood] = useState('Curious');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');

  const [generatedQuest, setGeneratedQuest] = useState(initialQuest);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const quest = await generateQuest({
        time: `${selectedTime} minutes`,
        environment: selectedEnvironment,
        mood: selectedMood,
        difficulty: selectedDifficulty
      });
      setGeneratedQuest(quest);
    } catch (err) {
      console.error('Error generating quest:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: '120px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="editorial-eyebrow">Personalized Exploration</span>
        <h1 className="editorial-title">What kind of adventure are you looking for?</h1>
        <p className="editorial-lead" style={{ margin: '12px auto 0', textAlign: 'center' }}>
          Select your preferences to craft an intentional outdoor journey.
        </p>
      </div>

      <div className="generator-form-wrapper">
        {/* Time Selection */}
        <div className="selector-row">
          <div className="selector-label">
            <span className="selector-name">Time Commitment</span>
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

        {/* Environment Selection */}
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

        {/* Mood Selection */}
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

        {/* Difficulty Selection */}
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

        {/* Generate Quest Button */}
        <div className="generator-submit-block">
          <button
            type="button"
            className="btn-editorial btn-solid-dark"
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ minWidth: 260 }}
          >
            {isGenerating ? 'Crafting adventure...' : 'Generate Quest →'}
          </button>
        </div>

        {/* Generated Quest Display */}
        {generatedQuest && (
          <div style={{ marginTop: 40 }}>
            <QuestCard
              quest={generatedQuest}
              onStartQuest={onStartQuest}
              onRegenerate={handleGenerate}
              isRegenerating={isGenerating}
            />
          </div>
        )}
      </div>
    </div>
  );
}
