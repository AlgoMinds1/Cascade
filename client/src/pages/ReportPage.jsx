import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertTriangle, Send, ArrowLeft } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ReportPage() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setStatus('sending')
    try {
      const res = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, source: 'citizen' })
      })
      if (res.ok) {
        setStatus('sent')
        setTimeout(() => navigate('/'), 1800)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="w-full max-w-md card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-orange-500 p-6 text-white">
          <Link to="/" className="flex items-center gap-1 text-white/70 text-sm hover:text-white mb-4 transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to command
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="font-display font-bold text-xl">Report Incident</h1>
          </div>
          <p className="text-white/80 text-sm">Your report is processed immediately by the command center AI.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {status === 'sent' ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-green-700">Report received!</p>
              <p className="text-sm text-slate-500 mt-1">Redirecting to command center…</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">What's happening?</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Bridge 17 has collapsed, Road 17 is blocked..."
                  className="w-full h-32 p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-sm"
                />
              </div>
              <button
                type="submit"
                id="report-submit-btn"
                disabled={status === 'sending' || !text.trim()}
                className="w-full btn-danger flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? 'Sending to command…' : 'Send Report'}
              </button>
              {status === 'error' && (
                <p className="text-sm text-red-600 text-center">Failed to send — is the server running?</p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  )
}
