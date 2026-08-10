import { useState } from 'react'
import { Activity, AlertTriangle, Shield, Truck, Hospital, CheckCircle2, ChevronRight, RefreshCw, Send } from 'lucide-react'

export default function DesignSystem() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="pill bg-blue-100 text-intel font-semibold">FOUNDATION</span>
          <span className="pill bg-emerald-100 text-emerald-700 font-semibold">PHASE 1</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Cascade Design System & Storyboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Visual token specifications, typography, UI components, and emergency state badges.</p>
      </div>

      {/* Color Tokens */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
          Color Palette Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="card p-3 space-y-2">
            <div className="h-16 rounded-lg bg-emergency shadow-inner flex items-end p-2 text-white font-mono text-xs">#DC2626</div>
            <div>
              <p className="text-xs font-semibold text-slate-800">emergency</p>
              <p className="text-[11px] text-slate-400">Critical alerts, road block</p>
            </div>
          </div>

          <div className="card p-3 space-y-2">
            <div className="h-16 rounded-lg bg-intel shadow-inner flex items-end p-2 text-white font-mono text-xs">#2563EB</div>
            <div>
              <p className="text-xs font-semibold text-slate-800">intel / primary</p>
              <p className="text-[11px] text-slate-400">Routing, AI actions</p>
            </div>
          </div>

          <div className="card p-3 space-y-2">
            <div className="h-16 rounded-lg bg-amber-500 shadow-inner flex items-end p-2 text-white font-mono text-xs">#F59E0B</div>
            <div>
              <p className="text-xs font-semibold text-slate-800">amber / warning</p>
              <p className="text-[11px] text-slate-400">Hospital load warning</p>
            </div>
          </div>

          <div className="card p-3 space-y-2">
            <div className="h-16 rounded-lg bg-slate-800 shadow-inner flex items-end p-2 text-white font-mono text-xs">#1E293B</div>
            <div>
              <p className="text-xs font-semibold text-slate-800">slate-800</p>
              <p className="text-[11px] text-slate-400">Headings & contrast</p>
            </div>
          </div>

          <div className="card p-3 space-y-2">
            <div className="h-16 rounded-lg bg-white border border-slate-200 flex items-end p-2 text-slate-700 font-mono text-xs">#FFFFFF</div>
            <div>
              <p className="text-xs font-semibold text-slate-800">surface</p>
              <p className="text-[11px] text-slate-400">Cards & modals</p>
            </div>
          </div>

          <div className="card p-3 space-y-2">
            <div className="h-16 rounded-lg bg-slate-50 border border-slate-200 flex items-end p-2 text-slate-700 font-mono text-xs">#FAFBFC</div>
            <div>
              <p className="text-xs font-semibold text-slate-800">bg</p>
              <p className="text-[11px] text-slate-400">Page background</p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Tokens */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
          Typography
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-intel uppercase tracking-wider">Heading Font</span>
              <span className="pill bg-slate-100 text-slate-600 text-xs">Space Grotesk</span>
            </div>
            <p className="font-display text-2xl font-bold text-slate-900">
              Disaster Response Command Center
            </p>
            <p className="font-display text-lg text-slate-700">
              Real-time multi-agent routing and hospital capacity triage.
            </p>
          </div>

          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-intel uppercase tracking-wider">Body Font</span>
              <span className="pill bg-slate-100 text-slate-600 text-xs">Inter</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Incident reported at Bridge 17. Extraction agent identifies road collapse; route agent immediately recalculates emergency ingress waypoints.
            </p>
            <p className="font-mono text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
              19:24:12 UTC — STATE_CHANGE: road-17 [BLOCKED]
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
          Action Buttons & Controls
        </h2>
        <div className="card p-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <button className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" />
              Primary Action
            </button>
            <button className="btn-danger flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Emergency Reset
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-2 border border-slate-200">
              <RefreshCw className="w-4 h-4" />
              Secondary Button
            </button>
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors flex items-center gap-1.5">
              <span>Ghost Action</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-medium rounded-lg cursor-not-allowed">
              Disabled
            </button>
          </div>
        </div>
      </section>

      {/* Badges & Status Pills */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
          Status Badges & Alerts
        </h2>
        <div className="card p-6 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE CONNECTED
            </span>
            <span className="pill bg-emergency/10 text-emergency border border-red-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emergency animate-ping"></span>
              CRITICAL INCIDENT
            </span>
            <span className="pill bg-amber-50 text-amber-700 border border-amber-200">
              OVERFLOW WARNING
            </span>
            <span className="pill bg-blue-50 text-intel border border-blue-200">
              REROUTING ACTIVE
            </span>
            <span className="pill bg-purple-50 text-purple-700 border border-purple-200">
              AMBULANCE EN ROUTE
            </span>
            <span className="pill bg-slate-100 text-slate-700 border border-slate-200">
              IDLE RESCUE TEAM
            </span>
          </div>
        </div>
      </section>

      {/* Cards & Surfaces */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
          Card Surfaces & Shadows
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="card p-5 hover:shadow-md transition-shadow space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Hospital Status</span>
              <Hospital className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg">City General</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-semibold text-emerald-600">60% (60/100)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-[60%]"></div>
              </div>
            </div>
          </div>

          <div className="card p-5 hover:shadow-md transition-shadow space-y-3 border-amber-200 bg-amber-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 uppercase">Warning State</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Emergency Care</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Surge Risk</span>
                <span className="font-semibold text-amber-600">88% (70+10/80)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full w-[88%]"></div>
              </div>
            </div>
          </div>

          <div className="card p-5 hover:shadow-md transition-shadow space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Active Unit</span>
              <Truck className="w-4 h-4 text-intel" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Ambulance A1</h3>
            <p className="text-xs text-slate-500">Route recalculation completed via OSRM bypass.</p>
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">ETA</span>
              <span className="font-bold text-intel">7 mins</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
