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
          coords: [[19.0700, 72.8700], [19.0800, 72.8800]]
        },
        {
          id: 'bridge-17',
          name: 'Bridge 17',
          type: 'bridge',
          status: 'open',
          coords: [[19.0740, 72.8740], [19.0760, 72.8760]]
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
      events: []
    }
  }

  getState() {
    return JSON.parse(JSON.stringify(this.data))
  }

  reset() {
    this.data = this.getInitialSeed()
    return this.getState()
  }

  blockRoad(roadId) {
    const road = this.data.roads.find(r => r.id === roadId)
    if (road) {
      road.status = 'blocked'
      this.addEvent('ROAD_BLOCKED', `${road.name} is now blocked`, [roadId])
    }
    return this.getState()
  }

  addEvent(type, description, affectedEntities = []) {
    this.data.events.unshift({
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      affectedEntities
    })
    // Keep max 50
    if (this.data.events.length > 50) {
      this.data.events = this.data.events.slice(0, 50)
    }
  }

  updateAmbulanceRoute(ambId, route) {
    const amb = this.data.ambulances.find(a => a.id === ambId)
    if (amb) {
      amb.route = route
      amb.status = 'enroute'
    }
  }

  updateHospitalStatus(hospId, incomingDelta, status) {
    const hosp = this.data.hospitals.find(h => h.id === hospId)
    if (hosp) {
      hosp.capacity.incoming = Math.max(0, hosp.capacity.incoming + incomingDelta)
      if (status) hosp.status = status
    }
  }

  assignTeam(teamId, task) {
    const team = this.data.rescueTeams.find(t => t.id === teamId)
    if (team) {
      team.status = 'deployed'
      team.assignedTask = task
    }
  }
}

export const WorldState = new WorldStateClass()
