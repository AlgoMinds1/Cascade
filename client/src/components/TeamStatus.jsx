import { Shield, Truck, AlertCircle, CheckCircle, Users } from 'lucide-react'
import { useWorldState } from '../hooks/useWorldState.js'

export default function TeamStatus() {
  const { worldState } = useWorldState()
  const ambulances = worldState?.ambulances || []
  const teams = worldState?.rescueTeams || []

  return (
    <div className="card p-4 space-y-3.5 shadow-soft border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-intel" />
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">
            Emergency Units & Dispatch
          </h2>
        </div>
        <span className="pill bg-blue-50 text-intel text-[11px] font-semibold">
          {ambulances.length + teams.length} Units Active
        </span>
      </div>

      {/* Units List */}
      <div className="space-y-2.5">
        {/* Rescue Teams */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Rescue & Assessment Teams
          </span>
          {teams.map(team => {
            const isDeployed = team.status === 'deployed'

            return (
              <div
                key={team.id}
                className={`flex items-center justify-between text-xs rounded-xl p-2.5 border transition-all duration-500 ${
                  isDeployed
                    ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/40 shadow-sm animate-pulse-subtle'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isDeployed ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{team.name}</span>
                    {team.assignedTask ? (
                      <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
                        Task: {team.assignedTask}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-0.5">Standby at station</p>
                    )}
                  </div>
                </div>

                <span
                  className={`pill text-[10px] font-bold uppercase tracking-wider ${
                    isDeployed
                      ? 'bg-amber-500 text-white shadow-sm animate-bounce-short'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {team.status.toUpperCase()}
                </span>
              </div>
            )
          })}
        </div>

        {/* Ambulances */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Active Ambulances
          </span>
          {ambulances.map(amb => {
            const isEnroute = amb.status === 'enroute'
            const isRerouted = amb.route?.rerouted

            return (
              <div
                key={amb.id}
                className={`flex items-center justify-between text-xs rounded-xl p-2.5 border transition-all duration-300 ${
                  isRerouted
                    ? 'bg-blue-50/90 border-blue-300 ring-1 ring-blue-400/30'
                    : isEnroute
                    ? 'bg-blue-50/40 border-blue-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isEnroute ? 'bg-intel text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Unit {amb.callSign}</span>
                    {amb.route?.duration && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        ETA: <span className="font-semibold text-slate-700">{Math.round(amb.route.duration / 60)}m</span>
                        {isRerouted && <span className="text-red-500 font-semibold ml-1"> (Bypass active)</span>}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <span
                    className={`pill text-[10px] font-bold uppercase tracking-wider ${
                      isEnroute ? 'bg-intel text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {amb.status.toUpperCase()}
                  </span>
                  {isRerouted && (
                    <span className="text-[9px] font-bold text-intel bg-blue-100/80 px-1.5 py-0.5 rounded">
                      REROUTED
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
