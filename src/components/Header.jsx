import React, { useState, useEffect } from 'react';

export default function Header({ onStartQuest, onNavigate, streak, xp }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`editorial-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="brand-wrapper" onClick={() => onNavigate('home')}>
        <span className="brand-logo-text">EcoQuest</span>
        <span className="brand-tag-small">Outdoor Exploration</span>
      </div>

      <nav className="nav-links-editorial">
        <button
          className="nav-item-editorial"
          onClick={() => handleNavClick('explore')}
        >
          Explore
        </button>
        <button
          className="nav-item-editorial"
          onClick={() => handleNavClick('how-it-works')}
        >
          How It Works
        </button>
        <button
          className="nav-item-editorial"
          onClick={() => handleNavClick('streak')}
        >
          Streak
        </button>
        <button
          className="nav-item-editorial"
          onClick={() => handleNavClick('journal')}
        >
          Journal
        </button>
        <button
          className="nav-item-editorial"
          onClick={() => handleNavClick('about')}
        >
          About
        </button>
      </nav>

      <div className="header-cta-group">
        {typeof streak === 'number' && (
          <span className="streak-indicator-subtle" title="Active Outdoor Days">
            {streak} Day Streak
          </span>
        )}
        {typeof xp === 'number' && (
          <span className="streak-indicator-subtle" title="Total Nature XP">
            {xp} XP
          </span>
        )}
        <button
          className="btn-editorial btn-solid-light header-cta-btn"
          onClick={onStartQuest}
        >
          <span className="header-cta-full">Start Your Quest</span>
          <span className="header-cta-short">Start Quest</span>
        </button>
      </div>
    </header>
  );
}
