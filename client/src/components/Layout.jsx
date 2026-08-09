import { Outlet, NavLink } from 'react-router-dom'
import { Activity, FileWarning } from 'lucide-react'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
      <nav className="glass sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2 text-slate-900 hover:opacity-90 transition-opacity">
              <Activity className="w-5 h-5 text-emergency" />
              <span className="font-display font-bold text-lg tracking-tight">CASCADE</span>
            </NavLink>
            <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-slate-600">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-2.5 py-1 rounded-md transition-colors ${isActive ? 'text-intel bg-blue-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/70'}`
                }
              >
                Command Map
              </NavLink>
              <NavLink
                to="/design-system"
                className={({ isActive }) =>
                  `px-2.5 py-1 rounded-md transition-colors ${isActive ? 'text-intel bg-blue-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/70'}`
                }
              >
                Design System
              </NavLink>
            </div>
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
