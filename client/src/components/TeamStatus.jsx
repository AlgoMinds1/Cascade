import { useWorldState } from '../hooks/useWorldState.js'

const STATUS_STYLES = {
  idle: 'bg-slate-100 text-slate-600',
  deployed: 'bg-amber-100 text-amber-700',
  enroute: 'bg-blue-100 text-blue-700',
  onscene: 'bg-green-100 text-green-700',
}

export default function TeamStatus() {
  const { worldState } = useWorldState()
  const ambulances = worldState?.ambulances || []
  const teams = worldState?.rescueTeams || []

  return (
    <div className="card p-4">
      <h2 className="font-display font-semibold text-sm text-slate-700 uppercase tracking-wider mb-3">Units</h2>
      <div className="space-y-2">
        {ambulances.map(amb => (
          <div key={amb.id} className="flex items-center justify-between text-sm rounded-lg bg-slate-50 px-3 py-2">
            <span className="font-medium text-slate-800">🚑 {amb.callSign}</span>
            <span className={`pill ${STATUS_STYLES[amb.status] || STATUS_STYLES.idle}`}>
              {amb.status.toUpperCase()}
            </span>
          </div>
        ))}
        {teams.map(team => (
          <div key={team.id} className="flex items-center justify-between text-sm rounded-lg bg-slate-50 px-3 py-2">
            <div>
              <span className="font-medium text-slate-800">👥 {team.name}</span>
              {team.assignedTask && (
                <p className="text-xs text-slate-500">{team.assignedTask}</p>
              )}
            </div>
            <span className={`pill ${STATUS_STYLES[team.status] || STATUS_STYLES.idle}`}>
              {team.status.toUpperCase()}
            </span>
          </div>
        ))}
        {ambulances.length === 0 && teams.length === 0 && (
          <p className="text-xs text-slate-400">No units data</p>
        )}
      </div>
    </div>
  )
}
