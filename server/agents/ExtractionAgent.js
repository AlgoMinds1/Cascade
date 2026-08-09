const ENTITY_MAP = {
  'road 17': 'road-17',
  'road seventeen': 'road-17',
  'bridge 17': 'bridge-17',
  'bridge on road 17': 'bridge-17',
  'bridge seventeen': 'bridge-17',
}

export function extractEntities(rawText) {
  const lower = rawText.toLowerCase()
  let entityId = null
  let type = null

  for (const [key, id] of Object.entries(ENTITY_MAP)) {
    if (lower.includes(key)) {
      entityId = id
      break
    }
  }

  if (lower.includes('collapse') || lower.includes('blocked') || lower.includes('down') || lower.includes('flood')) {
    type = 'ROAD_BLOCKED'
  } else if (lower.includes('fire') || lower.includes('burning')) {
    type = 'FIRE'
  } else if (lower.includes('trapped') || lower.includes('rescue')) {
    type = 'RESCUE'
  }

  return {
    type,
    entityId,
    confidence: entityId ? 'high' : 'low',
    rawText
  }
}
