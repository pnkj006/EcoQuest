import React from 'react';

export default function Footer({ onNavigate, onResetData }) {
  const handleNavClick = (sectionId) => {
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <footer id="about" className="editorial-footer">
      <div className="footer-inner-editorial">
        <div className="footer-top-grid">
          <div>
            <h3 className="footer-brand-title">EcoQuest</h3>
            <p className="footer-brand-tagline">
              "Turn screen time into outside time."
            </p>
            <p className="footer-brand-desc">
              EcoQuest is an open-weight exploration initiative that transforms passive screen hours into real-world observation, mindful walking, and daily nature habits.
            </p>
          </div>

          <div className="footer-nav-columns">
            <div className="footer-nav-col">
              <h4>Navigation</h4>
              <ul>
                <li>
                  <a href="#explore" onClick={(e) => { e.preventDefault(); handleNavClick('explore'); }}>
                    Explore
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('how-it-works'); }}>
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#streak" onClick={(e) => { e.preventDefault(); handleNavClick('streak'); }}>
                    Streak
                  </a>
                </li>
                <li>
                  <a href="#journal" onClick={(e) => { e.preventDefault(); handleNavClick('journal'); }}>
                    Journal
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4>Philosophy</h4>
              <ul>
                <li><span style={{ color: 'var(--text-light-secondary)', fontSize: '0.875rem' }}>Open-Weight AI</span></li>
                <li><span style={{ color: 'var(--text-light-secondary)', fontSize: '0.875rem' }}>Honor System</span></li>
                <li><span style={{ color: 'var(--text-light-secondary)', fontSize: '0.875rem' }}>Digital Well-Being</span></li>
                <li>
                  <button
                    onClick={onResetData}
                    style={{ color: 'var(--color-sand)', fontSize: '0.8125rem', marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                  >
                    Reset Demo Archive
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>
            Built with open-weight AI.
          </div>
          <div>
            &copy; {new Date().getFullYear()} EcoQuest. Leave the screen. Explore the world.
          </div>
        </div>
      </div>
    </footer>
  );
}
