# EcoQuest

> "Turn screen time into outside time."

## Overview

EcoQuest is an AI-powered outdoor habit-building web application that encourages users to spend meaningful time outside through personalized outdoor quests. Designed with a calm, editorial visual aesthetic, it offers structured, mindful micro-adventures that replace passive screen scrolling with active real-world engagement.

## Problem

Modern digital life leads to excessive screen time, digital fatigue, and disconnection from physical environments. While many people desire to spend more time outdoors, they often lack a simple, structured system to convert good intentions into accessible, real-world exploration without requiring elaborate planning or outdoor gear.

## Solution

EcoQuest bridges intention and action by generating personalized outdoor quests based on four user constraints:
- Time: 10, 20, or 30 minutes
- Environment: Park, Urban, Nature, or Anywhere
- Mood: Relaxed, Curious, Active, or Adventurous
- Difficulty: Easy, Medium, or Challenging

Using Google Gemma 4 via the Gemini API, EcoQuest crafts mindful outdoor prompts tailored to the user's available time and immediate landscape.

The complete quest lifecycle:
Preferences -> AI Quest -> Start Quest -> Timer -> Complete -> XP -> Streak -> Journal

## Features

- AI-generated outdoor quests using Google Gemma 4 (`gemma-4-26b-a4b-it`)
- Personalized quest generation based on duration, location type, mood, and difficulty
- Multiple time durations (10, 20, and 30 minutes)
- Environment selection (Park, Urban, Nature, Anywhere)
- Mood selection (Relaxed, Curious, Active, Adventurous)
- Difficulty selection (Easy, Medium, Challenging)
- Active quest countdown timer with pause, resume, and completion triggers
- Quest completion tracking with duration-based rewards (10m = 10 XP, 20m = 20 XP, 30m = 30 XP)
- Outdoor time tracking accumulating total minutes spent unplugged
- Nature streak tracking with calendar-day deduplication
- Automatic field note creation in the Nature Journal upon quest completion
- In-place Journal entry deletion with confirmation
- Browser localStorage persistence across page reloads
- Responsive, editorial nature-inspired user interface without third-party component bloat

## Tech Stack

- React
- Vite
- JavaScript (ES Modules)
- Google Gemma 4 (`gemma-4-26b-a4b-it`)
- Google Gemini API
- Browser localStorage
- Pure CSS design system

## How It Works

Architecture overview:

```
React frontend (Vite)
       |
       v
POST /api/generate-quest
       |
       v
Server-side Gemini API call
       |
       v
Google Gemma 4 (gemma-4-26b-a4b-it)
       |
       v
Structured quest JSON validation
       |
       v
React quest display & active timer
```

The Gemini API key is managed strictly on the server side via standard environment variables and local `.env` configuration. It is never prefixed with `VITE_` and is never exposed to client-side browser bundles.

## Project Structure

```
EcoQuest/
├── public/
│   └── hero-landscape.jpg       # Static hero photograph
├── server/
│   └── questApiHandler.js       # Gemma 4 API handler, validation, and schema sanitizer
├── src/
│   ├── assets/                  # Bundled visual assets
│   ├── components/
│   │   ├── ActiveQuest.jsx      # Countdown timer & quest presence mode
│   │   ├── CheckIn.jsx          # Reflection and completion modal
│   │   ├── FeaturedQuest.jsx    # Curated showcase quest
│   │   ├── Footer.jsx           # Minimalist editorial footer
│   │   ├── Header.jsx           # Floating navigation with streak and XP indicators
│   │   ├── Home.jsx             # Editorial homepage and stats overview
│   │   ├── Journal.jsx          # Standalone archive view
│   │   ├── JournalSection.jsx   # Nature journal timeline and delete controls
│   │   ├── QuestGenerator.jsx   # Preference selectors and Gemma generation trigger
│   │   └── StreakSection.jsx    # Weekly nature streak calendar strip
│   ├── services/
│   │   ├── ai.js                # AI service abstractions
│   │   └── questGenerator.js    # Offline fallback quest templates
│   ├── utils/
│   │   ├── storage.js           # LocalStorage synchronization, XP, and journal persistence
│   │   └── streak.js            # Daily streak calculation and calendar deduplication
│   ├── App.css                  # Custom editorial stylesheet and design tokens
│   ├── App.jsx                  # Root state container and view router
│   └── main.jsx                 # Application entrypoint
├── .env.example                 # Example environment template
├── .gitignore                   # Ignored files (node_modules, dist, .env)
├── index.html                   # HTML template with Google web fonts
├── package.json                 # Project dependencies and npm scripts
├── server.js                    # Standalone lightweight Node.js API server
└── vite.config.js               # Vite configuration with embedded dev API middleware
```

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/pnkj006/EcoQuest.git
cd EcoQuest
npm install
```

Configure environment variables:

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

A Gemini API key can be obtained from Google AI Studio (https://aistudio.google.com/).

Start the development server:

```bash
npm run dev
```

The app will be accessible at `http://localhost:5173/`.

Build for production:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

## Environment Variables

- `GEMINI_API_KEY`: Google Gemini API key used by the backend to access `gemma-4-26b-a4b-it`. Never expose this key to client-side bundles or commit it to version control.

## Safety

EcoQuest operates on an honor-system model and does not claim to physically verify that a user stepped outdoors. Generated quests are instructed never to prompt dangerous activities, entering private or restricted property, unsafe road crossings, climbing hazardous structures, approaching wildlife, or disturbing animals and plants. Users should remain mindful of their surroundings and prioritize safety at all times.

## Data & Privacy

All user progress, completed quest records, active streaks, and journal entries are stored locally within the user's browser via `localStorage`. EcoQuest does not employ cookies, tracker scripts, user authentication, or external databases.

## Future Improvements

- Richer quest history and filtering by environment or mood
- Optional location-aware quest customization using device coordinates
- Weather-aware quest recommendations based on real-time local conditions
- Enhanced progress analytics and weekly habit visualizations
- Optional cloud synchronization and multi-device account backup

## Hacktoberfest

EcoQuest was created as a Hacktoberfest project focused on fostering healthier relationships with technology, reducing sedentary screen time, and encouraging exploration of the natural world.

## License

This repository does not currently have a license file attached. A license may be added in a future release.
