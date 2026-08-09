export const fmtTime = (iso) => {
  if (!iso) return '--:--'
  const d = new Date(iso)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export const fmtCoords = (lat, lon) => `${lat.toFixed(4)}, ${lon.toFixed(4)}`
