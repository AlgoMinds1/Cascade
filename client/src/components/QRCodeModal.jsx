import { useState } from 'react'
import { QrCode, X, ExternalLink, Smartphone, Copy, Check } from 'lucide-react'

export default function QRCodeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const reportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/report`
    : 'http://localhost:5173/report'

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(reportUrl)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(reportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-sm overflow-hidden shadow-2xl border-slate-200 bg-white relative animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            <h3 className="font-display font-bold text-lg">Judge / Citizen Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4">
          <p className="text-xs text-slate-500">
            Scan this QR code with any smartphone camera to open the live incident reporting terminal.
          </p>

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm inline-block mx-auto">
            <img
              src={qrImageUrl}
              alt="Report Incident QR Code"
              className="w-48 h-48 mx-auto rounded-lg"
              loading="eager"
            />
          </div>

          {/* URL Copy Box */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="truncate flex-1 font-mono">{reportUrl}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="pt-1">
            <a
              href="/report"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-xs flex items-center justify-center gap-1.5 py-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Report Page in New Tab
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
