/**
 * ExtractionAgent — NLP entity extractor for unstructured incident reports.
 */

// Entity name to ID lookup dictionary
const ENTITY_DICTIONARY = {
  // Bridges
  'bridge 17': 'bridge-17',
  'bridge on road 17': 'bridge-17',
  'road 17 bridge': 'bridge-17',
  'bridge seventeen': 'bridge-17',
  'main bridge': 'bridge-17',
  'the bridge': 'bridge-17',

  // Roads
  'road 17': 'road-17',
  'road seventeen': 'road-17',
  'route 17': 'road-17',
  'highway 17': 'road-17',
  'south avenue': 'road-south',
  'south ave': 'road-south',
  'south road': 'road-south',

  // Hospitals
  'city general': 'hosp-a',
  'city general hospital': 'hosp-a',
  'hospital a': 'hosp-a',
  'emergency care': 'hosp-b',
  'emergency care hospital': 'hosp-b',
  'hospital b': 'hosp-b',

  // Rescue Teams
  'alpha rescue': 'team-1',
  'alpha team': 'team-1',
  'rescue team 1': 'team-1'
}

// Regex extractors for dynamic entity syntax
const REGEX_PATTERNS = [
  {
    regex: /(?:bridge)\s*(?:on\s+road\s*)?(\d+|seventeen)/i,
    resolver: (match) => {
      const num = match[1].toLowerCase()
      if (num === '17' || num === 'seventeen') return 'bridge-17'
      return `bridge-${num}`
    }
  },
  {
    regex: /(?:road|route|highway|hwy)\s*(\d+|seventeen)/i,
    resolver: (match) => {
      const num = match[1].toLowerCase()
      if (num === '17' || num === 'seventeen') return 'road-17'
      return `road-${num}`
    }
  },
  {
    regex: /south\s*(?:avenue|ave|rd|road)/i,
    resolver: () => 'road-south'
  }
]

// Event classification keywords
const EVENT_KEYWORDS = {
  ROAD_BLOCKED: [
    'collapse', 'collapsed', 'collapsing', 'broken',
    'blocked', 'blockage', 'blocking', 'obstruction',
    'flood', 'flooded', 'flooding', 'underwater', 'submerged',
    'down', 'hazard', 'impassable', 'closed', 'crack', 'cracked'
  ],
  FIRE: [
    'fire', 'burning', 'blaze', 'smoke', 'explosion', 'wildfire'
  ],
  RESCUE: [
    'trapped', 'buried', 'injured', 'casualty', 'casualties',
    'rescue', 'evacuate', 'evacuation', 'stranded', 'survivors'
  ],
  MEDICAL_SURGE: [
    'overflow', 'overwhelmed', 'mass casualty', 'surge', 'incoming patients'
  ]
}

/**
 * Parses raw text report and extracts structured entity and event information
 * @param {string} rawText Natural language incident message
 * @returns {Object} Extracted entity, type, confidence, and metadata
 */
export function extractEntities(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      type: 'UNKNOWN',
      entityId: null,
      confidence: 'none',
      rawText: ''
    }
  }

  const clean = rawText.trim()
  const lower = clean.toLowerCase()

  let entityId = null
  let matchedKeyword = null
  let eventType = null
  const matchedTokens = []

  // 1. Direct dictionary match (Priority 1: specific phrases like "bridge on road 17")
  // Sort dictionary keys by length descending to match longest phrases first
  const sortedKeys = Object.keys(ENTITY_DICTIONARY).sort((a, b) => b.length - a.length)
  for (const key of sortedKeys) {
    if (lower.includes(key)) {
      entityId = ENTITY_DICTIONARY[key]
      matchedTokens.push(key)
      break
    }
  }

  // 2. Regex fallback if dictionary match was not found
  if (!entityId) {
    for (const pattern of REGEX_PATTERNS) {
      const match = lower.match(pattern.regex)
      if (match) {
        entityId = pattern.resolver(match)
        matchedTokens.push(match[0])
        break
      }
    }
  }

  // 3. Event Type Classification
  for (const [type, keywords] of Object.entries(EVENT_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        eventType = type
        matchedKeyword = kw
        matchedTokens.push(kw)
        break
      }
    }
    if (eventType) break
  }

  // Default event type if road or bridge entity is found but no specific event word is detected
  if (!eventType && entityId) {
    eventType = 'ROAD_BLOCKED'
  }

  // Calculate extraction confidence
  let confidence = 'low'
  if (entityId && eventType && matchedTokens.length >= 2) {
    confidence = 'high'
  } else if (entityId || eventType) {
    confidence = 'medium'
  }

  return {
    type: eventType || 'GENERAL_INCIDENT',
    entityId,
    confidence,
    matchedTokens,
    matchedKeyword,
    rawText: clean,
    timestamp: new Date().toISOString()
  }
}
