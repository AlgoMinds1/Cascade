import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Activity, FileWarning, QrCode, Zap } from 'lucide-react'
import QRCodeModal from './QRCodeModal.jsx'
import AlertBanner from './AlertBanner.jsx'
import { useWorld } from '../store/WorldContext.jsx'

export default function Layout() {
  const [showQrModal, setShowQrModal] = useState(false)
  const { simRunning, isConnected } = useWorld()

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

          <div className="flex items-center gap-2.5">
            {/* Simulation Running Pill */}
            {simRunning && (
              <span className="pill bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm animate-pulse-subtle flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                SIM RUNNING
              </span>
            )}

            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Open QR Code for Mobile Report"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <NavLink
              to="/report"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-emergency border border-red-200 hover:bg-red-100 transition-colors"
            >
              <FileWarning className="w-4 h-4" />
              Report Incident
            </NavLink>

            <span className={`pill text-[11px] font-semibold flex items-center gap-1 ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-emergency/10 text-emergency animate-pulse'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-emergency'}`} />
              {isConnected ? 'LIVE' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
      </nav>

      {/* Overlay alert banner — drops below nav */}
      <AlertBanner mode="overlay" />

      <main className="flex-1">
        <Outlet />
      </main>

      <QRCodeModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
    </div>
  )
}
