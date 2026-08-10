import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useWorld } from '../store/WorldContext.jsx'

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? 'http://localhost:3001' : '')

const QUICK_PROMPTS = [
  "Bridge on Road 17 has collapsed and is completely blocked",
  "Road 17 is flooded and impassable for ambulances",
  "Major fire breakout spotted near South Avenue",
  "Road seventeen bridge is damaged and closed"
]

export default function ReportPage() {
  const { updateState } = useWorld()
  const [text, setText] = useState('')
  const [source, setSource] = useState('citizen')
  const [status, setStatus] = useState('idle')
  const [extractedResult, setExtractedResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!text.trim() || status === 'sending') return

    setStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), source })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        if (data.state) updateState(data.state)
        setExtractedResult(data.extracted)
        setStatus('sent')
        setTimeout(() => {
          navigate('/')
        }, 2200)
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Failed to process report. Try mentioning "Road 17" or "Bridge 17".')
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('Network error: Ensure the Cascade server is running on port 3001.')
    }
  }

  const handleSelectPrompt = (prompt) => {
    setText(prompt)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="w-full max-w-lg card overflow-hidden shadow-xl border border-slate-200">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white relative">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/80 text-xs font-medium hover:text-white mb-3 transition-colors px-2 py-1 rounded bg-black/10 hover:bg-black/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Map
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl tracking-tight">Citizen & Judge Field Report</h1>
                <p className="text-white/80 text-xs mt-0.5">Automated AI natural-language extraction pipeline</p>
              </div>
            </div>
            <span className="pill bg-white/20 text-white text-[11px] border border-white/30 animate-pulse">
              ● LIVE TERMINAL
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {status === 'sent' ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">Report Received by Command!</h2>
                <p className="text-sm text-slate-500 mt-1">Multi-agent extraction & rerouting cascade initiated.</p>
              </div>

              {extractedResult && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-left text-xs space-y-1 font-mono max-w-sm mx-auto">
                  <div className="text-intel font-bold">ExtractionAgent Result:</div>
                  <div>Event Type: <span className="font-semibold text-slate-800">{extractedResult.type}</span></div>
                  <div>Target Entity: <span className="font-semibold text-slate-800">{extractedResult.entityId}</span></div>
                  <div>Confidence: <span className="font-semibold text-emerald-600">{extractedResult.confidence.toUpperCase()}</span></div>
                </div>
              )}

              <p className="text-xs text-slate-400">Redirecting to live command dashboard…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Source Selector */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-intel" /> Source Origin:
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSource('judge')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      source === 'judge' ? 'bg-intel text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Judge
                  </button>
                  <button
                    type="button"
                    onClick={() => setSource('citizen')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      source === 'citizen' ? 'bg-intel text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Citizen
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe Incident in Natural Language
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe what happened (e.g., 'Bridge on Road 17 has collapsed and is blocked')..."
                  className="w-full h-28 p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-sm transition-all shadow-inner placeholder:text-slate-400"
                />
              </div>

              {/* Quick Sample Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> One-Tap Demo Presets:
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPrompt(prompt)}
                      className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200 text-slate-600 transition-colors truncate"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                id="report-submit-btn"
                disabled={status === 'sending' || !text.trim()}
                className="w-full btn-danger py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? 'Transmitting to Command Center…' : 'SEND REPORT'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
