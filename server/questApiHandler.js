/**
 * EcoQuest - Server-side Gemma 4 API Handler
 *
 * Model: gemma-4-26b-a4b-it
 * Handles: POST /api/generate-quest
 * Security: GEMINI_API_KEY is read strictly server-side and never exposed to the client.
 */

import fs from 'fs';
import path from 'path';

const GEMMA_MODEL = 'gemma-4-26b-a4b-it';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Loads GEMINI_API_KEY from environment or local .env file
 */
function getApiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    return process.env.GEMINI_API_KEY.trim();
  }

  // Try reading local .env file if not set in process.env
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('GEMINI_API_KEY=')) {
          const key = trimmed.slice('GEMINI_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
          if (key && key !== 'your_api_key_here') {
            return key;
          }
        }
      }
    }
  } catch (err) {
    // Silently ignore file reading errors
  }

  return null;
}

/**
 * Validates request parameters
 */
function validateQuestParams(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid JSON request body' };
  }

  const timeNum = parseInt(body.time, 10);
  if (isNaN(timeNum) || timeNum <= 0) {
    return { valid: false, error: 'Invalid time value. Expected number of minutes.' };
  }

  const validEnvironments = ['park', 'urban', 'nature', 'anywhere'];
  const envNormalized = String(body.environment || '').trim().toLowerCase();
  if (!validEnvironments.includes(envNormalized)) {
    return { valid: false, error: 'Invalid environment. Expected park, urban, nature, or anywhere.' };
  }

  const validMoods = ['relaxed', 'curious', 'active', 'adventurous'];
  const moodNormalized = String(body.mood || '').trim().toLowerCase();
  if (!validMoods.includes(moodNormalized)) {
    return { valid: false, error: 'Invalid mood. Expected relaxed, curious, active, or adventurous.' };
  }

  const validDifficulties = ['easy', 'medium', 'challenging'];
  const diffNormalized = String(body.difficulty || '').trim().toLowerCase();
  if (!validDifficulties.includes(diffNormalized)) {
    return { valid: false, error: 'Invalid difficulty. Expected easy, medium, or challenging.' };
  }

  return {
    valid: true,
    data: {
      time: timeNum,
      environment: envNormalized.charAt(0).toUpperCase() + envNormalized.slice(1),
      mood: moodNormalized.charAt(0).toUpperCase() + moodNormalized.slice(1),
      difficulty: diffNormalized.charAt(0).toUpperCase() + diffNormalized.slice(1)
    }
  };
}

/**
 * Extracts and parses JSON from model response
 */
function extractJsonFromText(rawText) {
  if (!rawText) return null;
  const trimmed = rawText.trim();
  // Strip markdown code fences if present (e.g. ```json ... ```)
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonString = codeBlockMatch ? codeBlockMatch[1].trim() : trimmed;
  return JSON.parse(jsonString);
}

/**
 * Sanitizes quest output into exact required schema without extra fields or emojis
 */
function sanitizeQuestOutput(rawQuest, fallbackData) {
  const stripEmojis = (str) => String(str || '').replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]/g, '').trim();

  const title = stripEmojis(rawQuest.title || 'OUTDOOR EXPLORATION').toUpperCase();
  const duration = parseInt(rawQuest.duration || fallbackData.time, 10) || fallbackData.time;
  const difficulty = stripEmojis(rawQuest.difficulty || fallbackData.difficulty);
  const environment = stripEmojis(rawQuest.environment || fallbackData.environment);
  const description = stripEmojis(rawQuest.description || '');

  let rawSteps = Array.isArray(rawQuest.steps) ? rawQuest.steps : [];
  if (rawSteps.length === 0) {
    rawSteps = [
      'Begin walking at an intentional pace and observe your immediate surroundings.',
      'Identify two distinct natural patterns or textures along your route.',
      'Find one unusual organic detail hiding in plain sight.'
    ];
  }
  const steps = rawSteps.map(s => stripEmojis(s)).slice(0, 5);
  const bonus = stripEmojis(rawQuest.bonus || rawQuest.bonusChallenge || 'Observe a small creature or plant without disturbing it.');

  // Strict output schema: exactly 7 fields, no extra keys
  return {
    title,
    duration,
    difficulty,
    environment,
    description,
    steps,
    bonus
  };
}

/**
 * Calls Gemma 4 via the Gemini API
 */
async function callGemma4(apiKey, questParams) {
  const endpoint = `${GEMINI_API_BASE}/${GEMMA_MODEL}:generateContent?key=${apiKey}`;

  const systemInstruction = `You are the EcoQuest outdoor quest designer.

Create short, safe, realistic outdoor quests that encourage people to spend time observing and interacting with their surroundings.

The quest must be possible without special equipment.

Never require dangerous activities, entering restricted/private property, approaching wildlife, climbing dangerous structures, crossing roads unsafely, or disturbing animals/plants.

Respect the user's requested duration, environment, mood, and difficulty.

The quest should encourage observation, movement, curiosity, and real-world exploration.

Return ONLY valid JSON matching the requested schema.

Do not include markdown.
Do not include emojis.`;

  const userPrompt = `${systemInstruction}

USER SELECTIONS:
- Duration: ${questParams.time} minutes
- Environment: ${questParams.environment}
- Mood: ${questParams.mood}
- Difficulty: ${questParams.difficulty}

REQUIRED JSON SCHEMA:
{
  "title": "Short title",
  "duration": ${questParams.time},
  "difficulty": "${questParams.difficulty}",
  "environment": "${questParams.environment}",
  "description": "One or two sentence overview of the quest.",
  "steps": [
    "Step 1 instruction",
    "Step 2 instruction",
    "Step 3 instruction"
  ],
  "bonus": "Short optional bonus challenge"
}

OUTPUT JSON ONLY:`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: userPrompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`API returned status ${response.status}: ${errorBody.slice(0, 160)}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const responsePart = parts.find(p => !p.thought && p.text) || parts[parts.length - 1];
  const textOutput = responsePart?.text;

  if (!textOutput) {
    throw new Error('Empty response from model');
  }

  const parsed = extractJsonFromText(textOutput);
  return sanitizeQuestOutput(parsed, questParams);
}

/**
 * Main request handler for POST /api/generate-quest
 */
export async function handleGenerateQuestRequest(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  // Parse request body
  let bodyBuffer = '';
  req.on('data', chunk => {
    bodyBuffer += chunk;
  });

  req.on('end', async () => {
    try {
      let body;
      try {
        body = JSON.parse(bodyBuffer || '{}');
      } catch (parseErr) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON request format.' }));
        return;
      }

      // Validate input parameters
      const validation = validateQuestParams(body);
      if (!validation.valid) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: validation.error }));
        return;
      }

      const apiKey = getApiKey();
      if (!apiKey) {
        console.warn('[EcoQuest Server] GEMINI_API_KEY is not configured in .env or environment.');
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          error: 'Something went wrong while creating your quest. Please try again.'
        }));
        return;
      }

      console.log(`[EcoQuest Server] Generating quest with Gemma 4 (${GEMMA_MODEL}) for:`, validation.data);
      const quest = await callGemma4(apiKey, validation.data);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(quest));
    } catch (err) {
      // Log sanitized error message server-side without secrets
      console.error('[EcoQuest Server] Gemma generation failed:', err.message);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'Something went wrong while creating your quest. Please try again.'
      }));
    }
  });
}
