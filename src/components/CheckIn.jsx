import React, { useState } from 'react';

export default function CheckIn({ quest, onRecordCompletion, onCancel }) {
  const [reflection, setReflection] = useState('');
  const [completedBonus, setCompletedBonus] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [celebrationResult, setCelebrationResult] = useState(null);

  const baseXP = 100;
  const bonusXP = completedBonus ? 25 : 0;
  const totalXPToEarn = baseXP + bonusXP;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Please select an image under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoDataUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = onRecordCompletion({
      quest,
      reflection,
      photo: photoDataUrl,
      bonusCompleted: completedBonus,
      durationMinutes: quest.actualMinutes || quest.time || 20
    });

    setCelebrationResult(result);
    setIsSubmitting(false);
  };

  return (
    <div className="checkin-view-container">
      <div className="checkin-view-card">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="editorial-eyebrow">Honor-System Check-in</span>
          <h1 className="editorial-title">Welcome back.</h1>
          <p className="editorial-lead" style={{ margin: '8px auto 0', textAlign: 'center' }}>
            EcoQuest celebrates your intention and journey, not digital surveillance. Take a quiet moment to record what you observed outside.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Quest recap */}
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 20, marginBottom: 28 }}>
            <div className="meta-pill-editorial" style={{ color: 'var(--color-forest)', marginBottom: 6 }}>
              <span>{quest.actualMinutes || quest.time} Minutes Outside</span>
              <span>/</span>
              <span>{quest.environment}</span>
            </div>
            <h3 className="editorial-title" style={{ fontSize: '1.9rem' }}>
              {quest.title}
            </h3>
          </div>

          {/* Reflection */}
          <div style={{ marginBottom: 28 }}>
            <label className="editorial-eyebrow" htmlFor="reflection-text" style={{ display: 'block' }}>
              What did you discover?
            </label>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginBottom: 8 }}>
              Describe light, sound, organic textures, or unexpected movements.
            </p>
            <textarea
              id="reflection-text"
              className="reflection-input-editorial"
              placeholder="e.g. Found ants climbing the bark of an ancient oak tree. The evening air felt surprisingly cool near the water..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
            />
          </div>

          {/* Bonus Challenge Verification */}
          {quest.bonusChallenge && (
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  background: 'var(--color-canvas-stone)',
                  border: '1px solid var(--border-light-strong)',
                  padding: 18,
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={completedBonus}
                  onChange={(e) => setCompletedBonus(e.target.checked)}
                  style={{ marginTop: 4, width: 18, height: 18, accentColor: 'var(--color-forest)' }}
                />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-forest)' }}>
                    Completed Bonus Challenge (+25 XP)
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dark-secondary)', marginTop: 4 }}>
                    "{quest.bonusChallenge}"
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Add a Photo (Optional) */}
          <div style={{ marginBottom: 32 }}>
            <span className="editorial-eyebrow">Add a photo (optional)</span>
            {photoDataUrl ? (
              <div style={{ position: 'relative', marginTop: 8 }}>
                <img
                  src={photoDataUrl}
                  alt="Outdoor discovery"
                  style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block', border: '1px solid var(--border-light)' }}
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(0,0,0,0.75)',
                    color: '#fff',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase'
                  }}
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <label className="photo-uploader-editorial" style={{ display: 'block' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-forest)' }}>
                  Select Field Photograph
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dark-muted)', marginTop: 4 }}>
                  JPEG or PNG up to 3MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <button
              type="button"
              className="btn-text-editorial"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-editorial btn-solid-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording...' : `Record Discovery (+${totalXPToEarn} XP) →`}
            </button>
          </div>
        </form>

        {/* Celebration Modal (Editorial, No Emojis) */}
        {celebrationResult && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(14, 18, 15, 0.85)',
              backdropFilter: 'blur(6px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24
            }}
          >
            <div className="celebration-modal-editorial">
              <span className="editorial-eyebrow">Logged to Archive</span>
              <h2 className="editorial-title" style={{ fontSize: '2.4rem', margin: '8px 0 16px' }}>
                Discovery Recorded
              </h2>
              <p className="editorial-lead" style={{ fontSize: '0.95rem', marginBottom: 28 }}>
                Your outdoor quest is archived into your Nature Journal and your streak is updated.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32, borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '20px 0' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                    +{celebrationResult.xpEarned}
                  </div>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dark-muted)' }}>
                    Nature XP Earned
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                    {celebrationResult.newStreak}
                  </div>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dark-muted)' }}>
                    Days Active Streak
                  </div>
                </div>
              </div>

              {celebrationResult.leveledUp && (
                <div style={{ marginBottom: 24, padding: 12, background: 'var(--color-canvas-stone)', border: '1px solid var(--border-light-strong)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-forest)' }}>
                  Progression Level: {celebrationResult.newLevel}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  className="btn-editorial btn-solid-dark"
                  onClick={() => celebrationResult.onDone('journal')}
                >
                  View in Nature Journal →
                </button>
                <button
                  className="btn-editorial btn-outline-dark"
                  onClick={() => celebrationResult.onDone('home')}
                >
                  Return to Exploration Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
