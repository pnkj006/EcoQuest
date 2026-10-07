/**
 * EcoQuest - Quest Generation Service
 *
 * Current: Structured mock quest generator based on user constraints.
 * Architecture: Separated from UI, ready for future Gemma open-weight API integration.
 */

export const QUEST_TEMPLATES = [
  {
    id: 'tree-detective',
    title: 'THE TREE DETECTIVE',
    environments: ['Park', 'Nature', 'Anywhere'],
    moods: ['Curious'],
    difficulties: ['Easy', 'Medium'],
    description: 'Find three different trees. Compare their leaves, touch their bark, and discover one detail you have never noticed before.',
    steps: [
      'Find your first tree and observe its leaf shape, pattern, and veins.',
      'Compare the bark texture of two different trees.',
      'Discover one unusual natural detail hiding in plain sight.'
    ],
    bonus: 'Find an insect, bird, or other small creature living on or near one of the trees.'
  },
  {
    id: 'five-sense-walk',
    title: 'FIVE-SENSE WALK',
    environments: ['Anywhere', 'Nature', 'Park'],
    moods: ['Relaxed'],
    difficulties: ['Easy'],
    description: 'Slow down your pace and deliberately engage each of your senses with the living world around you.',
    steps: [
      'Pause and identify three distinct sounds travelling on the wind.',
      'Touch two contrasting organic surfaces: weathered stone, tree bark, or soft damp moss.',
      'Find an organic scent in the air, pine needles, or crushed fallen leaves.'
    ],
    bonus: 'Notice the subtlest natural motion currently happening in your field of view.'
  },
  {
    id: 'urban-nature-hunt',
    title: 'URBAN NATURE HUNT',
    environments: ['Urban', 'Anywhere'],
    moods: ['Curious', 'Adventurous'],
    difficulties: ['Medium'],
    description: 'Search for wild persistence thriving within the concrete, brick, and iron of human infrastructure.',
    steps: [
      'Locate a plant, fern, or wild grass sprouting out of a pavement crack or stone wall.',
      'Find a patch of colorful lichen clinging to a lamp post, curb, or masonry facade.',
      'Discover animal tracks, bird nests, or insect trails integrated into city architecture.'
    ],
    bonus: 'Find a seedling growing where nobody intended it to grow.'
  },
  {
    id: 'the-movement-loop',
    title: 'THE MOVEMENT LOOP',
    environments: ['Park', 'Nature'],
    moods: ['Active'],
    difficulties: ['Medium', 'Easy'],
    description: 'Elevate your heart rate while tracking terrain transitions, canopy shifts, and open-air rhythms.',
    steps: [
      'Walk at a brisk, intentional pace toward the highest or most open viewpoint in the area.',
      'Alternate between dirt pathways and grass verges, noting how your stride adjusts.',
      'Pause at an open clearing and complete five deep diaphragmatic breaths facing the horizon.'
    ],
    bonus: 'Complete the entire walking loop without checking or touching your phone.'
  },
  {
    id: 'unfamiliar-path',
    title: 'UNFAMILIAR PATH',
    environments: ['Nature', 'Park'],
    moods: ['Adventurous'],
    difficulties: ['Challenging', 'Medium'],
    description: 'Step off your habitual path and practice raw wilderness observation through untamed landscape.',
    steps: [
      'Choose a trail or direction you have never explored before and advance with quiet footing.',
      'Navigate by natural markers: identify the sun position, prevailing wind, and landmark ridges.',
      'Observe animal sign: look for scratch marks on tree trunks, disturbed soil, or bird warning calls.'
    ],
    bonus: 'Spot wildlife without disturbing its natural behavior or alerting it to your presence.'
  },
  {
    id: 'quiet-canopy-sanctuary',
    title: 'QUIET CANOPY SANCTUARY',
    environments: ['Nature', 'Park', 'Anywhere'],
    moods: ['Relaxed'],
    difficulties: ['Medium', 'Easy'],
    description: 'Rest your eyes from screen luminescence and recalibrate under natural canopy light.',
    steps: [
      'Locate a secluded clearing or sheltered bench shaded by mature tree crowns.',
      'Gaze upward into the branch architecture for three minutes without looking down.',
      'Trace how the sunlight filters through moving leaves to create dancing geometry on the earth.'
    ],
    bonus: 'Count five different shades of green or earth tones in your immediate vicinity.'
  },
  {
    id: 'urban-micro-safari',
    title: 'URBAN MICRO-SAFARI',
    environments: ['Urban'],
    moods: ['Curious', 'Relaxed'],
    difficulties: ['Easy'],
    description: 'Notice the overlooked ecosystems surviving in alleys, walls, and sidewalk borders.',
    steps: [
      'Examine a single square foot of soil near a street tree or planter.',
      'Document three signs of active natural life: ants, spider webs, moss spores, or fallen seeds.',
      'Follow an urban bird in flight and note where it chooses to land or roost.'
    ],
    bonus: 'Photograph a flower or resilient green shoot emerging from asphalt.'
  },
  {
    id: 'ridge-and-stride-trek',
    title: 'RIDGE AND STRIDE TREK',
    environments: ['Nature', 'Park'],
    moods: ['Active', 'Adventurous'],
    difficulties: ['Challenging'],
    description: 'A physically demanding outdoor loop focusing on cadence, altitude, and raw endurance.',
    steps: [
      'Set a continuous, unbroken walking pace toward the steepest incline in your vicinity.',
      'Maintain steady rhythmic breathing while noting temperature shifts as you ascend.',
      'Scan the 360-degree horizon from the peak and pick out the most distant natural landmark.'
    ],
    bonus: 'Complete 25 minutes of unbroken outdoor movement without sitting or stopping.'
  },
  {
    id: 'city-perimeter-scout',
    title: 'CITY PERIMETER SCOUT',
    environments: ['Urban'],
    moods: ['Active'],
    difficulties: ['Medium', 'Challenging'],
    description: 'Map the intersection between civil architecture and natural elements at a brisk stride.',
    steps: [
      'Walk a continuous four-block perimeter focusing on overhead trees and rooftop bird activity.',
      'Note three places where rain runoff has carved natural paths into the concrete.',
      'Touch stone or brick warmed by the morning sun to feel natural thermal absorption.'
    ],
    bonus: 'Identify an old tree that predates the surrounding modern buildings.'
  },
  {
    id: 'elemental-mindful-reset',
    title: 'ELEMENTAL MINDFUL RESET',
    environments: ['Anywhere'],
    moods: ['Relaxed', 'Curious'],
    difficulties: ['Easy', 'Medium'],
    description: 'An open-air mindfulness practice designed to dissipate digital fatigue and tension.',
    steps: [
      'Step outside, face the wind, and let the air cool your face and eyes for sixty seconds.',
      'Notice the feel of natural ground beneath your shoes compared to indoor flooring.',
      'Select a single stone, twig, or leaf and inspect its microscopic grain and texture.'
    ],
    bonus: 'Take ten deep breaths in cadence with the swaying of nearby branches.'
  }
];

/**
 * Parses minutes from time input
 * @param {string|number} timeInput
 * @returns {number}
 */
const parseMinutes = (timeInput) => {
  if (typeof timeInput === 'number') return timeInput;
  const match = String(timeInput).match(/\d+/);
  return match ? parseInt(match[0], 10) : 20;
};

/**
 * Generate a mock quest based on user selections
 *
 * @param {Object} params
 * @param {string|number} params.time - e.g. "10 minutes", "20 minutes", "30 minutes"
 * @param {string} params.environment - 'Park' | 'Urban' | 'Nature' | 'Anywhere'
 * @param {string} params.mood - 'Relaxed' | 'Curious' | 'Active' | 'Adventurous'
 * @param {string} params.difficulty - 'Easy' | 'Medium' | 'Challenging'
 * @returns {Object} Structured quest object
 */
export function generateQuest({
  time = '20 minutes',
  environment = 'Park',
  mood = 'Curious',
  difficulty = 'Easy'
} = {}) {
  const durationMinutes = parseMinutes(time);
  const durationString = `${durationMinutes} Minutes`;

  // Score templates based on user preferences
  const scored = QUEST_TEMPLATES.map(template => {
    let score = 0;

    // Environment matching
    if (template.environments.includes(environment)) {
      score += 4;
    } else if (template.environments.includes('Anywhere')) {
      score += 2;
    }

    // Mood matching
    if (template.moods.includes(mood)) {
      score += 3;
    }

    // Difficulty matching
    if (template.difficulties.includes(difficulty)) {
      score += 2;
    }

    return { template, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Pick top candidate
  const bestMatch = scored[0].template;

  return {
    id: `quest-${bestMatch.id}-${Date.now()}`,
    title: bestMatch.title,
    duration: durationString,
    time: durationMinutes,
    timeLabel: durationString,
    difficulty,
    environment,
    mood,
    description: bestMatch.description,
    mission: bestMatch.description,
    steps: [...bestMatch.steps],
    bonus: bestMatch.bonus,
    bonusChallenge: bestMatch.bonus,
    createdAt: new Date().toISOString()
  };
}

export default generateQuest;
