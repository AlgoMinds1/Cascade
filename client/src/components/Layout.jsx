import { Outlet, NavLink } from 'react-router-dom'
import { Activity, FileWarning } from 'lucide-react'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
      <nav className="glass sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emergency" />
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">CASCADE</span>
          </div>
          <div className="flex items-center gap-3">
            <NavLink
              to="/report"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-emergency border border-red-200 hover:bg-red-100 transition-colors"
            >
              <FileWarning className="w-4 h-4" />
              Report Incident
            </NavLink>
            <span className="pill bg-emergency/10 text-emergency animate-pulse">● LIVE COMMAND</span>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
