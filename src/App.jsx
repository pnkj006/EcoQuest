import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Journal from './components/Journal';
import ActiveQuest from './components/ActiveQuest';
import CheckIn from './components/CheckIn';
import Footer from './components/Footer';
import {
  loadAppData,
  saveTodayQuest,
  recordQuestCompletion,
  deleteJournalEntry,
  resetAppData
} from './utils/storage';
import { calculateStreak } from './utils/streak';
import './App.css';

export default function App() {
  const [appData, setAppData] = useState(() => loadAppData());
  const [currentView, setCurrentView] = useState('home');
  const [currentQuest, setCurrentQuest] = useState(null);

  // Dynamic calculated streak from completed dates
  const streak = calculateStreak(appData.completedDates);

  useEffect(() => {
    if (appData.todayQuest && !appData.todayQuest.completed && !currentQuest) {
      setCurrentQuest(appData.todayQuest);
    }
  }, [appData.todayQuest]);

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuest = (quest) => {
    saveTodayQuest(quest);
    setCurrentQuest(quest);
    setAppData(prev => ({ ...prev, todayQuest: quest }));
    setCurrentView('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckIn = (questWithDetails) => {
    setCurrentQuest(questWithDetails);
    setCurrentView('checkin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelActiveQuest = () => {
    saveTodayQuest(null);
    setCurrentQuest(null);
    setAppData(prev => ({ ...prev, todayQuest: null }));
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteQuest = (quest, durationMinutes) => {
    const outcome = recordQuestCompletion({
      quest,
      actualMinutes: durationMinutes
    });
    setAppData(outcome.updatedData);
  };

  const handleRecordCompletion = ({ quest, reflection, photo, bonusCompleted, durationMinutes }) => {
    const outcome = recordQuestCompletion({
      quest,
      reflection,
      photo,
      bonusCompleted,
      actualMinutes: durationMinutes
    });

    setAppData(outcome.updatedData);

    return {
      ...outcome,
      onDone: (targetView = 'journal') => {
        setCurrentQuest(null);
        setCurrentView('home');
        setTimeout(() => {
          if (targetView === 'journal') {
            const el = document.getElementById('journal');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 60);
      }
    };
  };

  const handleDeleteJournalEntry = (entryId) => {
    const updated = deleteJournalEntry(entryId);
    setAppData(updated);
  };

  const handleResetData = () => {
    if (window.confirm('Reset EcoQuest demo archive and streak to initial defaults?')) {
      const fresh = resetAppData();
      setAppData(fresh);
      setCurrentQuest(null);
      setCurrentView('home');
    }
  };

  return (
    <div className="editorial-app-root">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onStartQuest={() => {
          if (currentView !== 'home') {
            setCurrentView('home');
          }
          setTimeout(() => {
            const el = document.getElementById('generator');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        streak={streak}
        xp={appData.natureXP}
      />

      <main>
        {currentView === 'home' && (
          <Home
            appData={{ ...appData, streak }}
            onStartQuest={handleStartQuest}
            onNavigate={handleNavigate}
            onDeleteJournalEntry={handleDeleteJournalEntry}
          />
        )}

        {currentView === 'journal' && (
          <Journal
            journalEntries={appData.journalEntries}
            onStartQuestSetup={() => {
              handleNavigate('home');
              setTimeout(() => {
                const el = document.getElementById('generator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onDeleteEntry={handleDeleteJournalEntry}
          />
        )}

        {currentView === 'active' && currentQuest && (
          <ActiveQuest
            quest={currentQuest}
            onCompleteQuest={handleCompleteQuest}
            onContinue={handleCancelActiveQuest}
            onCancelQuest={handleCancelActiveQuest}
          />
        )}

        {currentView === 'checkin' && currentQuest && (
          <CheckIn
            quest={currentQuest}
            onRecordCompletion={handleRecordCompletion}
            onCancel={() => handleNavigate('home')}
          />
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onResetData={handleResetData}
      />
    </div>
  );
}
