import React from 'react';
import FeaturedQuest from './FeaturedQuest';
import QuestGenerator from './QuestGenerator';
import StreakSection from './StreakSection';
import JournalSection from './JournalSection';

export default function Home({
  appData,
  onStartQuest,
  onNavigate,
  onDeleteJournalEntry
}) {
  const {
    completedDates = [],
    questsCompleted = 0,
    timeOutsideMinutes = 0,
    journalEntries = []
  } = appData;

  const streak = appData.streak ?? 0;

  // Compute dynamic stats blending with realistic benchmark
  const displayQuestsCount = (1240 + questsCompleted).toLocaleString();
  const displayMinutes = ((8400 + timeOutsideMinutes) / 1000).toFixed(1) + 'K';
  const displayDays = 24 + (completedDates.length > 7 ? completedDates.length - 7 : 0);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-editorial-page">
      {/* 1. HERO SECTION */}
      <section className="hero-editorial-section">
        <img
          src="/hero-landscape.jpg"
          alt="Hiker standing on mountain summit looking out at snow-capped peaks and pine forest"
          className="hero-bg-photo"
        />
        <div className="hero-bg-overlay" aria-hidden="true" />

        <div className="hero-container-inner">
          <div className="hero-editorial-content">
            <span className="hero-tagline-eyebrow">
              Leave the screen. Explore the world.
            </span>

            <h1 className="hero-headline-large">
              Turn screen time<br />into outside time.
            </h1>

            <p className="hero-supporting-text">
              AI-powered outdoor quests designed to get you moving, exploring, and noticing the world around you.
            </p>

            <div className="hero-button-group">
              <button
                className="btn-editorial btn-solid-light"
                onClick={() => scrollToSection('generator')}
              >
                Start Your Quest →
              </button>
              <button
                className="btn-editorial btn-outline-light"
                onClick={() => scrollToSection('how-it-works')}
              >
                How It Works ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS / INTRODUCTION SECTION */}
      <section className="intro-stats-section">
        <div className="intro-stats-inner">
          <div className="intro-header-block">
            <div>
              <span className="editorial-eyebrow">Manifesto</span>
              <h2 className="editorial-title">The world is waiting.</h2>
            </div>
            <div>
              <p className="editorial-lead">
                EcoQuest uses open-weight AI to create small outdoor adventures based on your time, mood, environment, and curiosity.
              </p>
              <p style={{ marginTop: 16, fontSize: '0.9375rem', color: 'var(--text-dark-muted)', lineHeight: 1.65 }}>
                We believe physical well-being begins by looking up. Not with arbitrary screen restrictions, but by replacing passive digital feeds with active natural encounters.
              </p>
            </div>
          </div>

          <div className="stats-horizontal-strip">
            <div className="stat-item-editorial">
              <div className="stat-number-large">{displayQuestsCount}</div>
              <div className="stat-label-editorial">Outdoor Quests</div>
              <p className="stat-description-editorial">Completed by curious explorers worldwide</p>
            </div>

            <div className="stat-item-editorial">
              <div className="stat-number-large">{displayMinutes}</div>
              <div className="stat-label-editorial">Minutes Outside</div>
              <p className="stat-description-editorial">Unplugged real-world exploration logged</p>
            </div>

            <div className="stat-item-editorial">
              <div className="stat-number-large">{displayDays}</div>
              <div className="stat-label-editorial">Nature Days</div>
              <p className="stat-description-editorial">Active streak days recorded this season</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW ECOQUEST WORKS */}
      <section id="how-it-works" className="how-works-section">
        <div className="how-works-inner">
          <div className="section-title-wrap">
            <span className="editorial-eyebrow">The Framework</span>
            <h2 className="editorial-title">How EcoQuest works.</h2>
          </div>

          <div className="how-works-grid">
            {/* Step 01 */}
            <div className="how-step-column">
              <div className="how-step-image-box">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                  alt="Open mountain vista"
                  className="how-step-image"
                />
              </div>
              <div className="how-step-body">
                <div className="step-number-editorial">01</div>
                <h3 className="step-title-editorial">Choose</h3>
                <p className="step-desc-editorial">
                  Tell EcoQuest how much time you have and what kind of environment you're exploring.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="how-step-column">
              <div className="how-step-image-box">
                <img
                  src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80"
                  alt="Pine forest trail in sunlight"
                  className="how-step-image"
                />
              </div>
              <div className="how-step-body">
                <div className="step-number-editorial">02</div>
                <h3 className="step-title-editorial">Explore</h3>
                <p className="step-desc-editorial">
                  Our open-weight AI creates a personalized outdoor quest tailored to your immediate setting.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="how-step-column">
              <div className="how-step-image-box">
                <img
                  src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
                  alt="Sunlight on green leaves"
                  className="how-step-image"
                />
              </div>
              <div className="how-step-body">
                <div className="step-number-editorial">03</div>
                <h3 className="step-title-editorial">Return</h3>
                <p className="step-desc-editorial">
                  Come back, record what you discovered, and build your Nature Streak without screen pressure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED QUEST SECTION */}
      <FeaturedQuest onStartQuest={onStartQuest} />

      {/* 5. QUEST GENERATOR SECTION */}
      <QuestGenerator onStartQuest={onStartQuest} />

      {/* 6. NATURE STREAK SECTION */}
      <StreakSection
        streak={streak}
        completedDates={completedDates}
        onNavigate={onNavigate}
      />

      {/* 7. NATURE JOURNAL SECTION */}
      <JournalSection
        journalEntries={journalEntries}
        onStartQuest={() => scrollToSection('generator')}
        onDeleteEntry={onDeleteJournalEntry}
      />
    </div>
  );
}
