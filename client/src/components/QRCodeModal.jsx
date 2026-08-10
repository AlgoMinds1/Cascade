import { useState, useEffect, useRef } from 'react'
import { QrCode, X, ExternalLink, Smartphone, Copy, Check, CheckCircle2 } from 'lucide-react'
import { useWorld } from '../store/WorldContext.jsx'

export default function QRCodeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false)
  const [reportReceived, setReportReceived] = useState(false)
  const { alerts } = useWorld()
  const prevAlertCountRef = useRef(0)
  const autoCloseRef = useRef(null)

  // Auto-close when a new alert arrives while modal is open (= judge submitted a report)
  useEffect(() => {
    if (!isOpen) {
      prevAlertCountRef.current = alerts.length
      setReportReceived(false)
      return
    }

    if (alerts.length > prevAlertCountRef.current) {
      // New alert arrived — flash "Report Received!" then auto-close
      setReportReceived(true)
      autoCloseRef.current = setTimeout(() => {
        onClose()
        setReportReceived(false)
      }, 1800)
    }

    prevAlertCountRef.current = alerts.length

    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
    }
  }, [alerts.length, isOpen, onClose])

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) setReportReceived(false)
  }, [isOpen])

  if (!isOpen) return null

  const reportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/report`
    : 'http://localhost:5173/report'

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(reportUrl)}&color=1a1a2e&bgcolor=ffffff&qzone=2`

  const handleCopy = () => {
    navigator.clipboard.writeText(reportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card w-full max-w-sm overflow-hidden shadow-2xl border-slate-200 bg-white relative animate-fade-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base leading-tight">Scan to Report</h3>
              <p className="text-white/50 text-[11px]">Judge / Citizen incident terminal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4 relative">

          {/* Report received overlay */}
          {reportReceived && (
            <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center gap-3 rounded-b-xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
              </div>
              <div>
                <p className="font-display font-bold text-lg text-slate-900">Report Received!</p>
                <p className="text-sm text-slate-500 mt-0.5">Multi-agent cascade triggered</p>
              </div>
              <p className="text-xs text-slate-400">Closing in a moment…</p>
            </div>
          )}

          <p className="text-xs text-slate-500 leading-relaxed">
            Scan with any smartphone camera to open the live incident reporting terminal. Submissions appear <strong className="text-slate-700">instantly</strong> on the command map.
          </p>

          {/* QR Code */}
          <div className="p-4 bg-white rounded-xl border-2 border-slate-100 shadow-inner inline-block mx-auto">
            <img
              src={qrImageUrl}
              alt="Report Incident QR Code"
              className="w-48 h-48 mx-auto rounded-lg"
              loading="eager"
            />
          </div>

          {/* Live indicator */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-600">LIVE — modal auto-closes on submission</span>
          </div>

          {/* URL Copy */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="truncate flex-1 font-mono text-[11px]">{reportUrl}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors flex-shrink-0"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <a
            href="/report"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-xs flex items-center justify-center gap-1.5 py-2.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Report Page in New Tab
          </a>
        </div>
      </div>
    </div>
  )
}
