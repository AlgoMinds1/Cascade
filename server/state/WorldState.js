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
          coords: [[19.0700, 72.8700], [19.0740, 72.8740], [19.0760, 72.8760], [19.0820, 72.8890]]
        },
        {
          id: 'bridge-17',
          name: 'Bridge 17',
          type: 'bridge',
          status: 'open',
          coords: [[19.0740, 72.8740], [19.0760, 72.8760]]
        },
        {
          id: 'road-south',
          name: 'South Avenue',
          type: 'road',
          status: 'open',
          coords: [[19.0610, 72.8610], [19.0680, 72.8750], [19.0700, 72.8700]]
        }
      ],
      hospitals: [
        {
          id: 'hosp-a',
          name: 'City General',
          location: [19.0820, 72.8890],
          capacity: { total: 100, current: 60, incoming: 0 },
          status: 'normal'
        },
        {
          id: 'hosp-b',
          name: 'Emergency Care',
          location: [19.0610, 72.8610],
          capacity: { total: 80, current: 40, incoming: 0 },
          status: 'normal'
        }
      ],
      ambulances: [
        {
          id: 'amb-1',
          callSign: 'A1',
          location: [19.0700, 72.8700],
          status: 'enroute',
          route: {
            from: [19.0700, 72.8700],
            to: [19.0820, 72.8890],
            waypoints: [
              [19.0700, 72.8700],
              [19.0740, 72.8740],
              [19.0760, 72.8760],
              [19.0820, 72.8890]
            ],
            duration: 360,
            distance: 2700,
            rerouted: false
          }
        },
        {
          id: 'amb-2',
          callSign: 'A2',
          location: [19.0610, 72.8610],
          status: 'idle',
          route: null
        },
        {
          id: 'amb-3',
          callSign: 'A3',
          location: [19.0780, 72.8850],
          status: 'idle',
          route: null
        }
      ],
      rescueTeams: [
        {
          id: 'team-1',
          name: 'Alpha Rescue',
          location: [19.0750, 72.8750],
          status: 'idle',
          assignedTask: null
        }
      ],
      events: [
        {
          id: 'evt-init',
          timestamp: new Date().toISOString(),
          type: 'SYSTEM_READY',
          description: 'Cascade Command World State Engine initialized.',
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
        `${road.name} (${road.type}) is now BLOCKED.`,
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
        `${road.name} is now OPEN for traffic.`,
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
        `Ambulance ${amb.callSign} rerouted via bypass (ETA: ${Math.round(route.duration / 60)}m).`,
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
        `${hosp.name} load updated to ${loadPercent}% (${totalOccupied}/${hosp.capacity.total}).`,
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
        `Rescue Team ${team.name} deployed to ${task}.`,
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
