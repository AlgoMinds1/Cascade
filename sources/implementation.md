Agent Zero — MVP Implementation Plan
Stack: React (Vite) + Node/Express + Socket.io + Leaflet + OSRM (Docker)Theme: Light mode with emergency-response visual languageFonts: Inter (body) + Space Grotesk (headings) — both Google Fonts, tech-forward but readablePalette: Off-white surfaces #FAFBFC, deep slate text #1E293B, emergency red #DC2626, intelligence blue #2563EB, warning amber #F59E0B
PHASE 1: Foundation & Design System (Hours 0–3)
Goal: A working project shell with the visual identity locked.Setup Tasks:
Scaffold with npm create vite@latest agent-zero -- --template react (JavaScript, not TypeScript)
Install dependencies: tailwindcss, postcss, autoprefixer, react-router-dom, socket.io-client, leaflet, react-leaflet, lucide-react
Initialize Tailwind with custom config:
Extend colors: emergency: #DC2626, intel: #2563EB, amber: #F59E0B, surface: #FFFFFF, bg: #FAFBFC
Extend fontFamily: sans: ['Inter', 'sans-serif'], display: ['Space Grotesk', 'sans-serif']
Add Google Fonts link in index.html
src/ components/ # Reusable UI pages/ # Dashboard, ReportPage hooks/ # useSocket, useWorldState store/ # Global context (no Redux, keep it light) utils/ # Formatters, constants assets/ # Icons, marker SVGsserver/ index.js # Express entry state/ # World state graph agents/ # Extraction, Route, Impact logic
Build the global layout shell:
Fixed top navigation bar (glassmorphism: bg-white/80 backdrop-blur-md border-b)
Main content area with subtle gradient background (bg-gradient-to-br from-slate-50 to-blue-50/30)
Sidebar on the right (collapsible) for logs and alerts
Create a DesignSystem storyboard page to verify: buttons (primary with gradient bg-gradient-to-r from-blue-600 to-blue-500), alert badges, cards with soft shadows (shadow-sm hover:shadow-md transition)

Checkpoint: Run npm run dev. See a blank but beautifully styled app shell with correct fonts and colors.Critical Rule: Do not build any feature logic yet. Only shells and styles.
PHASE 2: Map Core & Geospatial Layer (Hours 3–6)
Goal: A live Leaflet map with custom markers and OSRM talking.Frontend Tasks:
Build MapContainer component filling the main view
Configure Leaflet with OpenStreetMap tiles (free, no key)
Create custom SVG markers:
Ambulance: blue pulse icon
Hospital: white H on red circle
Bridge: gray arch icon
Road segment: thin polyline
Add a dummy marker layer with 3 ambulances, 2 hospitals, 1 bridge, and road polylines connecting them
Implement fitBounds so all markers are visible on load

Backend Tasks:
Initialize Express server with CORS
Install osrm locally via Docker: docker run -p 5000:5000 -v $(pwd)/data:/data osrm/osrm-backend osrm-routed /data/your-city.osrm
Download a small city extract from Geofabrik beforehand (pick your demo city, ~10-50MB)
Create a test endpoint POST /api/route that accepts {coordinates: [[lon,lat], [lon,lat]]} and returns OSRM's driving route
Verify: hitting the endpoint from the frontend draws a blue polyline on the map

Checkpoint: Map shows the city. Calling the backend draws a real computed route between two points. OSRM is fully local.Critical Rule: Do not proceed until a real OSRM route renders on your map. This is the technical anchor.
PHASE 3: World State Engine (Hours 6–10)
Goal: A live in-memory graph that represents the disaster world.Backend Tasks:
Create server/state/WorldState.js — a singleton class:
roads: array of {id, name, coords[], status: 'open'|'blocked', type: 'bridge'|'road'}
hospitals: array of {id, name, location, capacity: {total, current, incoming}, status}
ambulances: array of {id, callSign, location, route: {from, to, waypoints}, status: 'idle'|'enroute'|'atscene'}
rescueTeams: array of {id, name, location, assignedTask, status}
events: array of {id, timestamp, type, description, source, affectedEntities[]}
Implement methods:
blockRoad(roadId) → sets status, triggers propagate()
propagate() → iterates affected entities and emits update
getState() → returns full serializable snapshot
Integrate Socket.io:
On client connect, emit full state
On every state mutation, broadcast state:updated to all clients
Seed the world with your demo scenario data:
Road 17 with Bridge at specific coordinates
Hospital A and B with capacity numbers
Ambulance A1 enroute to Hospital A via Road 17

Frontend Tasks:
Create useSocket hook: connects to backend, maintains worldState in React state
Create useWorldState hook: derives computed values (affected zones, active alerts)
Build EntityLayer component: reads worldState and renders all markers dynamically

Checkpoint: Changing a road status in Postman instantly updates the map markers (e.g., bridge turns red). All entities render from live state.
PHASE 4: Extraction Agent & Input Layer (Hours 10–14)
Goal: Turn a raw report into a structured world-state mutation.Backend Tasks:
Build server/agents/ExtractionAgent.js:
Input: raw string (e.g., "Bridge on Road 17 collapsed")
Logic: Simple keyword matching (no ML for MVP):
Scan for "bridge", "road", "collapsed", "blocked", "fire", "trapped"
Regex extract "Road \d+" or "Bridge"
Map to known entity IDs via a lookup dictionary
Output: {type: 'ROAD_BLOCKED', entityId: 'road-17', confidence: 'high', rawText}
Build POST /api/report endpoint:
Accepts {message, source: 'judge'|'simulation'}
Runs ExtractionAgent
If extraction succeeds → calls worldState.blockRoad(entityId) → triggers Socket broadcast
Returns {success, extracted, stateChanges}
Build POST /api/reset endpoint: restores world to initial seed state (essential for repeated demos)

Frontend Tasks:
Build /report page (the judge's phone page):
Big centered card with gradient header (bg-gradient-to-br from-red-500 to-orange-500)
Large textarea with placeholder: "Describe the incident..."
Big submit button: "SEND REPORT"
Success animation: checkmark + "Report received by Command"
Auto-redirect back or show confirmation
Generate a QR code pointing to https://your-ngrok-url/report (use a free QR generator, hardcode for now, swap URL at demo time)

Checkpoint: Typing "Bridge on Road 17 collapsed" on the report page and submitting it changes the bridge marker to red on the main dashboard within 1 second.
PHASE 5: Route & Impact Agent (Hours 14–19)
Goal: Real cascade computation when the world changes.Backend Tasks:
Build server/agents/RouteAgent.js:
Listens for road-block events
Finds all ambulances with routes intersecting the blocked road
For each affected ambulance:
Call OSRM with new waypoints (avoiding blocked segment)
Update ambulance route in WorldState
Log event: "Ambulance A1 rerouted due to Road 17 blockage"
Build server/agents/ImpactAgent.js:
On bridge collapse:
Identify nearest hospital to the incident zone
Increase hospital.incoming count
If (current + incoming) / total > 0.85, set hospital.status = 'overflow_warning'
Calculate ETA impact: compare old route duration vs new route duration
Auto-reassign nearest idle rescue team:
Find closest idle team to incident
Set assignedTask = 'bridge_assessment', status = 'deployed'

Frontend Tasks:
Build RouteLayer component:
Renders old route as faded gray dashed line with red X midpoint
Renders new route as animated blue glowing polyline (use Leaflet dashArray animation or CSS filter)
Ambulance marker smoothly moves along new route (use setInterval + L.Marker.setLatLng)
Build HospitalCard component (right sidebar):
Horizontal capacity bar: green → yellow → red gradient based on load
Animated alert banner when status changes to overflow_warning
Build TeamStatus component:
List of rescue teams with color-coded status pills
Auto-scroll to highlight newly assigned team

Checkpoint: Submitting the bridge report triggers this exact sequence within 3 seconds:
Bridge turns red
Old route grays out, new route draws in blue
Hospital bar shifts, amber alert appears
Rescue team card flashes "DEPLOYED"

PHASE 6: Dashboard & Real-time Visualization (Hours 19–24)
Goal: The command center looks like a winning hackathon project.Frontend Tasks:
Build main Dashboard page layout:
Left 65%: Full-height MapContainer with all layers
Right 35%: Scrollable sidebar with sections:
Live Alerts: Sticky top, red/amber badges, auto-stacking
Hospital Status: Cards with gradient capacity bars
Active Units: Ambulance list with ETA timers
Event Log: Reverse-chronological feed, monospace timestamps
Add global alert banner at top of screen:
When critical event fires, drops down with bg-gradient-to-r from-red-600 to-red-500 text-white
Text: "CRITICAL: Bridge collapse on Road 17 — Cascading reroutes active"
Auto-dismiss after 8 seconds or manual close
Add a "Simulation Mode" toggle button:
When ON, plays pre-loaded reports every 3 seconds from a JSON array
Visual indicator: "SIMULATION RUNNING" pill in header
Polish map interactions:
Fly-to animation on affected zone when event fires (map.flyTo)
Pulse animation on newly blocked entities (CSS animation on marker)
Darken non-affected areas slightly to focus attention (Leaflet tile filter or overlay)

Visual Polish (No holding back):
Cards: bg-white rounded-xl border border-slate-200 shadow-sm
Gradients on active elements: buttons, alert banners, active team cards
Subtle background mesh gradient on empty states
Smooth transitions: transition-all duration-500 ease-out

Checkpoint: The dashboard feels alive. Toggling simulation mode shows a time-lapse of the disaster evolving. Every state change has a visual counterpart.
PHASE 7: Demo Choreography & Polish (Hours 24–28)
Goal: The 90-second demo is bulletproof and beautiful.Tasks:
Create simulationData.json with exactly 12 synthetic reports:
Report 1: "Fire near Oak Street School"
Report 2: "Road 17 bridge looks damaged"
... Report 7: "Bridge on Road 17 has collapsed" (THE TRIGGER)
... through Report 12: various follow-ups
Each with delaySeconds from previous
Build SimulationController component:
Play/Pause/Reset buttons
Progress bar showing which report is active
When played, sequentially calls POST /api/report with each message
Pre-compute the "Bridge Collapse" scenario:
Test it 20 times. Fix any timing issues.
Ensure the cascade completes in under 4 seconds end-to-end
Build the Judge Interaction flow:
Main dashboard displays a large QR code in a modal: "SCAN TO REPORT INCIDENT"
On scan, judge opens /report, submits text
Main screen immediately reacts (WebSocket)
Close modal automatically on first report received
Add a "Reset World" button (calls POST /api/reset) for instant demo recovery
Add keyboard shortcuts for your own control:
R = Reset
S = Start Simulation
Space = Pause

Performance Hardening:
Memoize all map layers with React.memo to prevent re-renders
Throttle Socket.io updates to 200ms if many fire rapidly
Ensure OSRM container is warm (query it once on startup)

Checkpoint: You can run the full demo arc in under 90 seconds without touching code. Reset → Simulate → Reset → Judge QR submit → Reset.
PHASE 8: Integration, Fallbacks & Deployment Prep (Hours 28–32)
Goal: It works on stage, on bad WiFi, under pressure.Tasks:
ngrok Setup:
Install ngrok, authenticate
Create startup script: ngrok http 5173 --url your-static-domain (use free static domain if available)
Test QR code → phone → submit → update flow on cellular data (not WiFi)
Fallback Assets:
Record a 20-second screen capture of the exact judge-submit flow
Save as fallback-demo.mp4 in /public
If live fails, click "Show Fallback" button that plays the video seamlessly
Build & Deploy:
npm run build the React app
Serve static files from Express (app.use(express.static('dist')))
Single command startup: npm run start (launches Express + serves UI)
Verify OSRM Docker is running before Node starts (add check in server startup)
Final Testing Checklist:
[ ] Bridge report → all 4 cascade steps visible in <4s
[ ] Simulation plays through all 12 reports without crash
[ ] Reset returns world to exact initial state
[ ] Map renders correctly at 1920×1080 (projector resolution)
[ ] Mobile /report page works on both iOS Safari and Android Chrome
[ ] App works without internet (OSM tiles may need cache or offline fallback — test this!)
[ ] No console errors in browser
[ ] No npm audit critical issues (judge may ask)

Final Deliverable: A single repository. One command (npm run dev for dev, npm start for demo). OSRM in Docker. ngrok for tunneling. It works offline except for the tunnel.
Execution Rules (Read Before Starting)
Do not skip Phase 2. If OSRM doesn't compute real routes, nothing downstream works. Nail it first.
Do not add a database. In-memory state only. Reset via re-seeding.
Do not build authentication. Waste of time for a hackathon demo.
Do not use TypeScript. Stick to JavaScript to avoid type-debugging rabbit holes.
Do not build more than 3 agents. Extraction, Route, Impact. World State is the engine, not an agent.
If a feature takes >45 minutes, cut it. The fallback video exists for a reason.
Test the demo arc end-to-end after EVERY phase. Do not accumulate 3 phases of untested code.

Font CDN (add to index.html):HTML
Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`  `
This plan is designed so that Phase 5 is your "wow" moment — everything before builds toward it, everything after polishes it. Start now.