# 🌊 Cascade — AI-Powered Disaster Command Platform

> Real-time disaster coordination powered by multi-agent AI. Built for hackathons, deployable in crisis.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-black?logo=socket.io)](https://socket.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 🧠 What is Cascade?

Cascade is a real-time disaster response command center. When an incident is reported (flood, bridge collapse, road blockage), a pipeline of AI agents automatically:

1. **Extracts** the affected location from natural-language text (ExtractionAgent)
2. **Recomputes** ambulance routes around blocked roads (RouteAgent → OSRM)
3. **Assesses** hospital capacity impact and deploys rescue teams (ImpactAgent)
4. **Broadcasts** the updated world state to all connected dashboards via WebSocket

---

## 🗂 Project Structure

```
Cascade/
├── client/                  # Vite + React frontend
│   └── src/
│       ├── components/      # Map, panels, alerts, simulation controls
│       ├── hooks/           # useSocket, useWorldState
│       ├── pages/           # Dashboard, ReportPage
│       └── store/           # WorldContext (global state)
├── server/                  # Express + Socket.io backend
│   ├── agents/              # ExtractionAgent, RouteAgent, ImpactAgent
│   ├── routes/              # REST API (/api/report, /api/reset, /api/health)
│   └── state/               # WorldState singleton
├── start-osrm.sh            # OSRM Docker helper
└── package.json             # Root orchestrator (concurrently)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Docker (optional, for real routing via OSRM)

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/your-username/cascade.git
cd cascade

# 2. Install all dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# 3. Start both client + server
npm run dev
```

| Service | URL |
|---|---|
| Dashboard | http://localhost:5173 |
| API Server | http://localhost:3001 |
| OSRM (optional) | http://localhost:5000 |

---

## 🗺 Real Routing with OSRM (Optional)

For real route computation instead of mock waypoints:

```bash
# 1. Download your city's OSM data (example: Maharashtra, India)
wget https://download.geofabrik.de/asia/india/maharashtra-latest.osm.pbf \
     -O server/osrm-data/region.osm.pbf

# 2. Pre-process (one-time)
docker run -t -v $(pwd)/server/osrm-data:/data osrm/osrm-backend \
  osrm-extract -p /opt/car.lua /data/region.osm.pbf
docker run -t -v $(pwd)/server/osrm-data:/data osrm/osrm-backend \
  osrm-partition /data/region.osrm
docker run -t -v $(pwd)/server/osrm-data:/data osrm/osrm-backend \
  osrm-customize /data/region.osrm

# 3. Run the routing server
./start-osrm.sh
```

Then update `server/agents/RouteAgent.js` to call `http://localhost:5000` instead of the mock.

---

## 🔌 API Reference

### `POST /api/report`
Submit a natural-language incident report.

```json
// Request
{ "message": "Bridge 17 has collapsed and is blocked", "source": "citizen" }

// Response
{
  "success": true,
  "extracted": { "type": "ROAD_BLOCKED", "entityId": "bridge-17", "confidence": "high" },
  "changes": [
    { "action": "BLOCK_ROAD", "target": "bridge-17" },
    { "action": "REROUTE", "target": "amb-1" },
    { "action": "DEPLOY_TEAM", "target": "team-1" }
  ]
}
```

### `POST /api/reset`
Reset the world state to the initial seed.

### `GET /api/health`
Server health check.

---

## ⚙️ Configuration

| File | What to change |
|---|---|
| `client/src/utils/constants.js` | `MAP_CENTER` — set to your demo city coordinates |
| `server/state/WorldState.js` | Seed data — roads, hospitals, ambulances, teams |
| `server/agents/ExtractionAgent.js` | Entity name → ID mappings for your locations |
| `server/agents/RouteAgent.js` | Swap mock routes for real OSRM fetch |

---

## 🤖 Agent Pipeline

```
Citizen Report (text)
        │
        ▼
 ExtractionAgent        → identifies entity ID + event type
        │
        ├──▶ RouteAgent      → recomputes ambulance waypoints (OSRM)
        │
        └──▶ ImpactAgent     → hospital load + rescue team dispatch
                │
                ▼
         WorldState.update()
                │
                ▼
        Socket.io broadcast → all dashboards update live
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React-Leaflet |
| Backend | Node.js, Express, Socket.io |
| Routing | OSRM (Open Source Routing Machine) |
| Maps | OpenStreetMap + Leaflet |
| Fonts | Inter, Space Grotesk (Google Fonts) |

---

## 📄 License

MIT © 2024 — Built with ❤️ for disaster response hackathons.
