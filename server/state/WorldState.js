/**
 * WorldState — Singleton in-memory graph representing the disaster command world.
 */
class WorldStateClass {
  constructor() {
    this.data = this.getInitialSeed()
  }

  getInitialSeed() {
    return {
      roads: [
        {
          id: 'road-17',
          name: 'Road 17',
          type: 'road',
          status: 'open',
          coords: [[18.6410, 73.7410], [18.6450, 73.7460], [18.6475, 73.7486], [18.6530, 73.7550]]
        },
        {
          id: 'bridge-17',
          name: 'Bridge 17',
          type: 'bridge',
          status: 'open',
          coords: [[18.6450, 73.7460], [18.6475, 73.7486]]
        },
        {
          id: 'road-south',
          name: 'South Avenue',
          type: 'road',
          status: 'open',
          coords: [[18.6340, 73.7340], [18.6390, 73.7400], [18.6410, 73.7410]]
        }
      ],
      hospitals: [
        {
          id: 'hosp-a',
          name: 'City General',
          location: [18.6530, 73.7550],
          capacity: { total: 100, current: 60, incoming: 0 },
          status: 'normal'
        },
        {
          id: 'hosp-b',
          name: 'Emergency Care',
          location: [18.6340, 73.7340],
          capacity: { total: 80, current: 40, incoming: 0 },
          status: 'normal'
        }
      ],
      ambulances: [
        {
          id: 'amb-1',
          callSign: 'A1',
          location: [18.6410, 73.7410],
          status: 'enroute',
          route: {
            from: [18.6410, 73.7410],
            to: [18.6530, 73.7550],
            waypoints: [
              [18.6410, 73.7410],
              [18.6450, 73.7460],
              [18.6475, 73.7486],
              [18.6530, 73.7550]
            ],
            duration: 360,
            distance: 2700,
            rerouted: false
          }
        },
        {
          id: 'amb-2',
          callSign: 'A2',
          location: [18.6340, 73.7340],
          status: 'idle',
          route: null
        },
        {
          id: 'amb-3',
          callSign: 'A3',
          location: [18.6500, 73.7510],
          status: 'idle',
          route: null
        }
      ],
      rescueTeams: [
        {
          id: 'team-1',
          name: 'Alpha Rescue',
          location: [18.6465, 73.7475],
          status: 'idle',
          assignedTask: null
        }
      ],
      events: [
        {
          id: 'evt-init-1',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          type: 'SYSTEM_READY',
          description: 'Cascade Command Engine online • Graph routing active',
          source: 'system',
          affectedEntities: []
        },
        {
          id: 'evt-init-2',
          timestamp: new Date(Date.now() - 45000).toISOString(),
          type: 'CORRIDOR_MONITOR',
          description: 'Corridor telemetry synced: Road 17 & South Ave open',
          source: 'system',
          affectedEntities: ['road-17', 'road-south']
        },
        {
          id: 'evt-init-3',
          timestamp: new Date(Date.now() - 30000).toISOString(),
          type: 'DISPATCH',
          description: 'Ambulance A1 en route to City General • Units A2/A3 staged',
          source: 'dispatch',
          affectedEntities: ['amb-1']
        },
        {
          id: 'evt-init-4',
          timestamp: new Date(Date.now() - 15000).toISOString(),
          type: 'TRIAGE',
          description: 'City General (60% load) & Emergency Care telemetry active',
          source: 'hospital',
          affectedEntities: ['hosp-a', 'hosp-b']
        },
        {
          id: 'evt-init-5',
          timestamp: new Date().toISOString(),
          type: 'MONITOR',
          description: 'Incident ingestion stream active • Ready for field reports',
          source: 'system',
          affectedEntities: []
        }
      ]
    }
  }

  /**
   * Returns a deep-cloned snapshot of the current state
   */
  getState() {
    return JSON.parse(JSON.stringify(this.data))
  }

  /**
   * Resets world state to initial seed
   */
  reset() {
    this.data = this.getInitialSeed()
    return this.getState()
  }

  /**
   * Blocks a road or bridge by ID and triggers propagation
   */
  blockRoad(roadId, source = 'system') {
    const road = this.data.roads.find(r => r.id === roadId)
    if (road) {
      road.status = 'blocked'
      this.addEvent(
        'ROAD_BLOCKED',
        `${road.name} (${road.type}) blocked • Traffic suspended`,
        source,
        [roadId]
      )
      return this.propagate(roadId)
    }
    return { affectedEntities: [], state: this.getState() }
  }

  /**
   * Unblocks a road or bridge by ID
   */
  unblockRoad(roadId, source = 'system') {
    const road = this.data.roads.find(r => r.id === roadId)
    if (road) {
      road.status = 'open'
      this.addEvent(
        'ROAD_OPENED',
        `${road.name} reopened • Normal flow restored`,
        source,
        [roadId]
      )
    }
    return this.getState()
  }

  /**
   * Propagation engine: analyzes state graph and identifies affected entities
   */
  propagate(entityId) {
    const affectedAmbulances = []
    const affectedHospitals = []
    const affectedTeams = []

    // 1. Ambulances with active routes intersecting or leading across entity
    for (const amb of this.data.ambulances) {
      if (amb.status === 'enroute' && amb.route) {
        affectedAmbulances.push(amb.id)
      }
    }

    // 2. Identify nearest hospital
    if (this.data.hospitals.length > 0) {
      affectedHospitals.push(this.data.hospitals[0].id)
    }

    // 3. Identify idle rescue teams
    for (const team of this.data.rescueTeams) {
      if (team.status === 'idle') {
        affectedTeams.push(team.id)
      }
    }

    return {
      entityId,
      affectedAmbulances,
      affectedHospitals,
      affectedTeams,
      state: this.getState()
    }
  }

  /**
   * Appends an event to the chronological feed (caps at 50)
   */
  addEvent(type, description, source = 'system', affectedEntities = []) {
    this.data.events.unshift({
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      source,
      affectedEntities
    })

    if (this.data.events.length > 50) {
      this.data.events = this.data.events.slice(0, 50)
    }
  }

  /**
   * Updates an ambulance route
   */
  updateAmbulanceRoute(ambId, route) {
    const amb = this.data.ambulances.find(a => a.id === ambId)
    if (amb) {
      amb.route = route
      amb.status = 'enroute'
      this.addEvent(
        'REROUTE',
        `Ambulance ${amb.callSign} rerouted via bypass (ETA: ${Math.round(route.duration / 60)}m)`,
        'system',
        [ambId]
      )
    }
  }

  /**
   * Updates hospital incoming patient count and overflow warning status
   */
  updateHospitalStatus(hospId, incomingDelta = 0, status = null) {
    const hosp = this.data.hospitals.find(h => h.id === hospId)
    if (hosp) {
      hosp.capacity.incoming = Math.max(0, hosp.capacity.incoming + incomingDelta)
      if (status) hosp.status = status

      const totalOccupied = hosp.capacity.current + hosp.capacity.incoming
      const loadPercent = Math.round((totalOccupied / hosp.capacity.total) * 100)

      this.addEvent(
        'HOSPITAL_UPDATE',
        `${hosp.name} triage: ${totalOccupied}/${hosp.capacity.total} beds (${loadPercent}% load)`,
        'system',
        [hospId]
      )
    }
  }

  /**
   * Deploys a rescue team to a task
   */
  assignTeam(teamId, task) {
    const team = this.data.rescueTeams.find(t => t.id === teamId)
    if (team) {
      team.status = 'deployed'
      team.assignedTask = task
      this.addEvent(
        'TEAM_DEPLOYED',
        `Team ${team.name} deployed to ${task}`,
        'system',
        [teamId]
      )
    }
  }

  getRoad(id) {
    return this.data.roads.find(r => r.id === id)
  }

  getHospital(id) {
    return this.data.hospitals.find(h => h.id === id)
  }

  getAmbulance(id) {
    return this.data.ambulances.find(a => a.id === id)
  }

  getRescueTeam(id) {
    return this.data.rescueTeams.find(t => t.id === id)
  }
}

export const WorldState = new WorldStateClass()
