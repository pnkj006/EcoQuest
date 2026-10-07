import React from 'react';

export default function FeaturedQuest({ onStartQuest }) {
  const featured = {
    id: 'featured-tree-detective',
    title: 'The Tree Detective',
    subtitle: 'Find three different trees near you.',
    time: 20,
    timeLabel: '20 Minutes',
    difficulty: 'Easy',
    environment: 'Park',
    mood: 'Curious',
    description: 'Find three different trees. Compare their leaves, touch their bark, and discover one detail you have never noticed before.',
    mission: 'Slow down and pay close attention to the gentle giants that share your immediate landscape.',
    steps: [
      'Find your first tree and observe its leaves, silhouette, and leaf veins.',
      'Touch and compare the bark texture of two distinctly different trees.',
      'Find one unusual organic detail: moss patch, lichen growth, or unique branch curve.'
    ],
    bonusChallenge: 'Find an insect, bird, or small creature resting on or near one of the trunks.'
  };

  return (
    <section id="explore" className="featured-quest-section">
      <div className="featured-quest-inner">
        <div className="section-title-wrap">
          <span className="editorial-eyebrow light">Featured Exploration</span>
          <h2 className="editorial-title light">Your next adventure is waiting.</h2>
        </div>

        <div className="featured-quest-grid">
          <div className="featured-quest-content">
            <div className="meta-pill-editorial">
              <span>20 Minutes</span>
              <span>/</span>
              <span>Easy</span>
              <span>/</span>
              <span>Park</span>
            </div>

            <h3 className="featured-quest-title">The Tree Detective</h3>

            <p className="featured-quest-summary">
              Find three different trees. Compare their leaves, touch their bark, and discover one detail you have never noticed before.
            </p>

            <ul className="quest-steps-minimal">
              <li className="quest-step-item-minimal">
                <span className="step-index-small">01</span>
                <span>Find your first tree and observe its leaf shape, pattern, and veins.</span>
              </li>
              <li className="quest-step-item-minimal">
                <span className="step-index-small">02</span>
                <span>Touch and compare the bark texture of two distinctly different trees.</span>
              </li>
              <li className="quest-step-item-minimal">
                <span className="step-index-small">03</span>
                <span>Discover one unusual organic detail hiding in plain sight.</span>
              </li>
            </ul>

            <div className="bonus-box-minimal">
              <div className="bonus-label-minimal">Bonus Challenge — +25 XP</div>
              <p className="bonus-text-minimal">
                Find an insect, bird, or other small creature living on or near one of the trees.
              </p>
            </div>

            <button
              className="btn-editorial btn-solid-light"
              onClick={() => onStartQuest(featured)}
            >
              Start This Quest →
            </button>
          </div>

          <div className="featured-quest-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=85"
              alt="Sunlight filtering through deep forest canopy"
              className="featured-quest-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
