/**
 * EcoQuest - AI Service Layer
 *
 * Current: Directs to questGenerator.js
 * Future: Easily replaceable with Gemma open-weight API integration.
 */

import { generateQuest as generatorGenerateQuest } from './questGenerator.js';

export async function generateQuest(params) {
  return generatorGenerateQuest(params);
}

export default generateQuest;
