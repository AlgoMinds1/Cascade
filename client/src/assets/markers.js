import L from 'leaflet'

/**
 * Custom SVG Icons for Cascade map entities
 */

// Pulsing Ambulance Marker
export const ambulanceIcon = L.divIcon({
  className: 'custom-ambulance-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
      <div class="w-7 h-7 rounded-full bg-intel text-white flex items-center justify-center shadow-lg border-2 border-white">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h1"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <path d="M9 17h6"></path>
          <circle cx="17" cy="17" r="2"></circle>
        </svg>
      </div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
})

// Hospital Marker (White H on Red Circle)
export const hospitalIcon = L.divIcon({
  className: 'custom-hospital-icon',
  html: `
    <div class="w-7 h-7 rounded-full bg-emergency text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white font-display">
      H
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
})

// Hospital Marker Warning State
export const hospitalWarningIcon = L.divIcon({
  className: 'custom-hospital-warning-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <span class="absolute w-8 h-8 rounded-full bg-amber-500/40 animate-ping"></span>
      <div class="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white font-display">
        H
      </div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
})

// Bridge Marker (Open)
export const bridgeIcon = L.divIcon({
  className: 'custom-bridge-icon',
  html: `
    <div class="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-md border-2 border-white">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19V9a8 8 0 0 1 16 0v10"></path>
        <path d="M4 14h16"></path>
        <path d="M2 19h20"></path>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
})

// Bridge Marker (Blocked / Collapsed)
export const bridgeBlockedIcon = L.divIcon({
  className: 'custom-bridge-blocked-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <span class="absolute w-8 h-8 rounded-full bg-red-600/40 animate-ping"></span>
      <div class="w-7 h-7 rounded-full bg-emergency text-white flex items-center justify-center shadow-lg border-2 border-white">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
})

// Rescue Team Marker
export const teamIcon = L.divIcon({
  className: 'custom-team-icon',
  html: `
    <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
})
