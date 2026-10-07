import React, { useState } from 'react';

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80'
];

export default function Journal({ journalEntries = [], onStartQuestSetup, onDeleteEntry }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleTriggerDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = (id) => {
    if (onDeleteEntry) {
      onDeleteEntry(id);
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="journal-page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 24 }}>
        <div>
          <span className="editorial-eyebrow">Archive & Field Notes</span>
          <h1 className="editorial-title">Nature Journal</h1>
        </div>

        <button className="btn-editorial btn-solid-dark" onClick={onStartQuestSetup}>
          New Quest →
        </button>
      </div>

      <p className="editorial-lead" style={{ marginBottom: 48 }}>
        A quiet log of your real-world outdoor moments, mindful reflections, and discoveries.
      </p>

      {journalEntries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px solid var(--border-light)' }}>
          <span className="editorial-eyebrow">Empty Journal</span>
          <h3 className="editorial-title" style={{ fontSize: '2.2rem', margin: '10px 0 16px' }}>
            Your journal is waiting.
          </h3>
          <p className="editorial-lead" style={{ margin: '0 auto 28px' }}>
            Complete your first outdoor quest to record what you discover outside.
          </p>
          <button className="btn-editorial btn-solid-dark" onClick={onStartQuestSetup}>
            Start a Quest Today →
          </button>
        </div>
      ) : (
        <div className="journal-entries-editorial-list">
          {journalEntries.map((entry, idx) => {
            const photoSrc = entry.photo || FALLBACK_PHOTOS[idx % FALLBACK_PHOTOS.length];
            const entryIdentifier = entry.id || `entry-${idx}`;
            const isConfirming = confirmDeleteId === entryIdentifier;

            return (
              <article key={entryIdentifier} className="journal-editorial-row">
                <div
                  className="journal-row-image-box"
                  onClick={() => setSelectedPhoto(photoSrc)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view full photograph"
                >
                  <img
                    src={photoSrc}
                    alt={entry.questTitle}
                    className="journal-row-img"
                  />
                </div>

                <div className="journal-row-content">
                  <div className="journal-row-meta">
                    <span>{entry.date}</span>
                    <span>/</span>
                    <span>{entry.durationMinutes || entry.duration || 20} Minutes Outside</span>
                    <span>/</span>
                    <span>{entry.environment || 'Outside'}</span>
                    {entry.difficulty && (
                      <>
                        <span>/</span>
                        <span>{entry.difficulty}</span>
                      </>
                    )}
                  </div>

                  <h3 className="journal-row-title">{entry.questTitle}</h3>

                  {entry.reflection && (
                    <p className="journal-row-quote">
                      "{entry.reflection}"
                    </p>
                  )}

                  <div className="journal-row-foot">
                    <div className="journal-row-foot-left">
                      <span>Awarded: <strong>+{entry.xpEarned || 100} XP</strong></span>
                      {entry.bonusCompleted && (
                        <span style={{ color: 'var(--color-clay)', fontWeight: 600 }}>
                          Bonus Completed
                        </span>
                      )}
                    </div>

                    <div className="journal-row-foot-actions">
                      {isConfirming ? (
                        <div className="journal-delete-confirm-box">
                          <span className="journal-delete-prompt">
                            Delete this journal entry?
                          </span>
                          <button
                            type="button"
                            className="btn-journal-confirm-delete"
                            onClick={() => handleConfirmDelete(entryIdentifier)}
                          >
                            DELETE
                          </button>
                          <button
                            type="button"
                            className="btn-journal-confirm-cancel"
                            onClick={handleCancelDelete}
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn-journal-delete"
                          onClick={() => handleTriggerDelete(entryIdentifier)}
                        >
                          DELETE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(12, 16, 13, 0.88)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh' }}>
            <img
              src={selectedPhoto}
              alt="Nature Discovery"
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: -40,
                right: 0,
                color: '#ffffff',
                fontSize: '0.875rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase'
              }}
            >
              Close [✕]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
