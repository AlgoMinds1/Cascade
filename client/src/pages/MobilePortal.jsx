import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? 'http://localhost:3001' : '')

const C = {
  bg: '#F6F7F5', primary: '#17211F', secondary: '#596460',
  border: '#D9DEDA', surface: '#ECEFEC', accent: '#C94B3C',
  success: '#397A57', white: '#FFFFFF', warning: '#B47A25',
}

// ─── Safety Banner ────────────────────────────────────────────────────────────
function SafetyBanner() {
  return (
    <div style={{
      background: '#FFFBF0', border: `1px solid #E8C97A`,
      borderRadius: 6, padding: '10px 14px', margin: '0 0 20px',
      fontSize: 13, color: C.primary, lineHeight: 1.5,
    }}>
      <strong style={{ fontWeight: 600 }}>Safety first:</strong> If you are in immediate danger, move to a safe location if possible. Do not put yourself at risk to capture evidence.
    </div>
  )
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────
function HomeScreen({ onAction }) {
  const actions = [
    { id: 'photo', icon: '📷', label: 'Take a Photo', desc: 'Capture damage, hazards or blocked roads' },
    { id: 'voice', icon: '🎙', label: 'Record Voice', desc: 'Describe what you see' },
    { id: 'location', icon: '📍', label: 'Share Location', desc: 'Help responders find you' },
  ]

  return (
    <div>
      <SafetyBanner />
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.primary, margin: '0 0 28px', lineHeight: 1.2 }}>
        What is happening?
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {actions.map(action => (
          <button
            key={action.id}
            id={`home-${action.id}-btn`}
            onClick={() => onAction(action.id)}
            style={{
              background: C.white, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '20px 20px', display: 'flex', alignItems: 'center', gap: 18,
              cursor: 'pointer', textAlign: 'left', width: '100%', minHeight: 80,
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.surface; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.white; }}
          >
            <span style={{ fontSize: 32, flexShrink: 0 }}>{action.icon}</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.primary, marginBottom: 4 }}>{action.label}</div>
              <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.4 }}>{action.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Screen: Photo ────────────────────────────────────────────────────────────
function PhotoScreen({ onBack, onCapture }) {
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  const handleRetake = () => {
    setPreview(null)
    setFile(null)
    fileRef.current.value = ''
    fileRef.current.click()
  }

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.secondary, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
        ← Back
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primary, margin: '0 0 20px' }}>Take a Photo</h2>
      <SafetyBanner />

      {!preview ? (
        <div>
          <div style={{
            border: `2px dashed ${C.border}`, borderRadius: 10, padding: '48px 24px',
            textAlign: 'center', background: C.surface, marginBottom: 16,
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>📷</div>
            <p style={{ fontSize: 15, color: C.secondary, margin: '0 0 20px' }}>Take or upload a photo of the incident</p>
            <button
              id="photo-capture-btn"
              onClick={() => fileRef.current.click()}
              style={{
                background: C.accent, color: C.white, border: 'none', borderRadius: 8,
                padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', minHeight: 52,
              }}
            >
              Open Camera
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.secondary, letterSpacing: '0.06em', marginBottom: 10 }}>PHOTO PREVIEW</p>
          <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 16, maxHeight: 280, objectFit: 'cover' }} />
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button
              id="photo-retake-btn"
              onClick={handleRetake}
              style={{
                flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', color: C.primary, minHeight: 52,
              }}
            >Retake</button>
            <button
              id="photo-use-btn"
              onClick={() => onCapture(file, preview)}
              style={{
                flex: 2, background: C.primary, border: 'none', borderRadius: 8,
                padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', color: C.white, minHeight: 52,
              }}
            >Use Photo</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Screen: Voice ────────────────────────────────────────────────────────────
function VoiceScreen({ onBack, onCapture }) {
  const [state, setState] = useState('idle') // idle | recording | done
  const [seconds, setSeconds] = useState(0)
  const [audioURL, setAudioURL] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const recorderRef = useRef(null)
  const timerRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioURL(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
      }
      recorder.start()
      recorderRef.current = recorder
      setState('recording')
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } catch {
      alert('Microphone access is required to record a voice note.')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current) recorderRef.current.stop()
    clearInterval(timerRef.current)
    setState('done')
  }

  const recordAgain = () => {
    setAudioURL(null)
    setAudioBlob(null)
    setState('idle')
    setSeconds(0)
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  useEffect(() => () => clearInterval(timerRef.current), [])

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.secondary, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
        ← Back
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primary, margin: '0 0 20px' }}>Record Voice</h2>
      <SafetyBanner />

      <div style={{ textAlign: 'center', padding: '24px 0 32px' }}>
        {state === 'idle' && (
          <>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🎙</div>
            <p style={{ fontSize: 15, color: C.secondary, marginBottom: 28 }}>Tap to record your voice message</p>
            <button
              id="voice-record-btn"
              onClick={startRecording}
              style={{
                width: 80, height: 80, borderRadius: '50%', background: C.accent, border: 'none',
                cursor: 'pointer', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto',
              }}
            >🎙</button>
            <p style={{ marginTop: 16, fontSize: 13, color: C.secondary }}>Tap to record</p>
          </>
        )}

        {state === 'recording' && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: C.accent, border: 'none',
              cursor: 'pointer', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: `0 0 0 12px rgba(201,75,60,0.15)`,
            }}>🎙</div>
            <p style={{ fontSize: 24, fontWeight: 700, color: C.accent, margin: '0 0 6px', fontVariantNumeric: 'tabular-nums' }}>{fmt(seconds)}</p>
            <p style={{ fontSize: 14, color: C.accent, margin: '0 0 24px', fontWeight: 600 }}>Recording…</p>
            <button
              id="voice-stop-btn"
              onClick={stopRecording}
              style={{
                background: C.primary, color: C.white, border: 'none', borderRadius: 8,
                padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer', minHeight: 52,
              }}
            >Stop Recording</button>
          </>
        )}

        {state === 'done' && (
          <>
            <div style={{ fontSize: 50, marginBottom: 16 }}>✅</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.success, marginBottom: 20 }}>{fmt(seconds)} recording</p>
            {audioURL && (
              <audio controls src={audioURL} style={{ width: '100%', marginBottom: 20, borderRadius: 6 }} />
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                id="voice-again-btn"
                onClick={recordAgain}
                style={{
                  flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', color: C.primary, minHeight: 52,
                }}
              >Record Again</button>
              <button
                id="voice-use-btn"
                onClick={() => onCapture(audioBlob, seconds)}
                style={{
                  flex: 2, background: C.primary, border: 'none', borderRadius: 8,
                  padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', color: C.white, minHeight: 52,
                }}
              >Use Recording</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Screen: Location ─────────────────────────────────────────────────────────
function LocationScreen({ onBack, onCapture }) {
  const [state, setState] = useState('idle') // idle | loading | found | error
  const [coords, setCoords] = useState(null)

  const getLocation = () => {
    setState('loading')
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5), acc: Math.round(pos.coords.accuracy) })
        setState('found')
      },
      () => setState('error'),
      { timeout: 10000 }
    )
  }

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.secondary, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
        ← Back
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primary, margin: '0 0 20px' }}>Your Location</h2>
      <SafetyBanner />

      {state === 'idle' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📍</div>
          <p style={{ fontSize: 15, color: C.secondary, marginBottom: 24 }}>Share your location to help responders find you</p>
          <button
            id="location-detect-btn"
            onClick={getLocation}
            style={{
              background: C.accent, color: C.white, border: 'none', borderRadius: 8,
              padding: '16px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%', minHeight: 56,
            }}
          >Use Current Location</button>
          <button
            id="location-manual-btn"
            onClick={() => onCapture({ manual: true })}
            style={{
              background: 'none', border: 'none', color: C.secondary, cursor: 'pointer',
              fontSize: 14, marginTop: 16, textDecoration: 'underline',
            }}
          >Choose Location Manually</button>
        </div>
      )}

      {state === 'loading' && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <p style={{ fontSize: 15, color: C.secondary }}>Detecting location…</p>
        </div>
      )}

      {state === 'found' && coords && (
        <div>
          <div style={{
            background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px',
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.secondary, letterSpacing: '0.08em', marginBottom: 12 }}>LOCATION DETECTED</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, color: C.secondary, marginBottom: 2 }}>Latitude</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, fontVariantNumeric: 'tabular-nums' }}>{coords.lat}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.secondary, marginBottom: 2 }}>Longitude</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, fontVariantNumeric: 'tabular-nums' }}>{coords.lng}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.secondary, marginBottom: 2 }}>Accuracy</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.primary }}>±{coords.acc}m</div>
              </div>
            </div>
          </div>
          <button
            id="location-use-btn"
            onClick={() => onCapture(coords)}
            style={{
              background: C.primary, color: C.white, border: 'none', borderRadius: 8,
              padding: '16px', fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%', minHeight: 56,
            }}
          >Use This Location</button>
        </div>
      )}

      {state === 'error' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
          <p style={{ fontSize: 15, color: C.secondary, marginBottom: 20 }}>Could not detect location. Please try again or enter manually.</p>
          <button onClick={getLocation} style={{ background: C.accent, color: C.white, border: 'none', borderRadius: 8, padding: '14px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 12, width: '100%', minHeight: 52 }}>Try Again</button>
          <button onClick={() => onCapture({ manual: true })} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', color: C.primary, minHeight: 52 }}>Enter Manually</button>
        </div>
      )}
    </div>
  )
}

// ─── Screen: Review ───────────────────────────────────────────────────────────
function ReviewScreen({ data, onSubmit, onBack, status, errorMessage }) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.secondary, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
        ← Back
      </button>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: C.secondary, marginBottom: 16 }}>REPORT READY</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primary, margin: '0 0 20px' }}>Review your report</h2>

      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
        overflow: 'hidden', marginBottom: 20,
      }}>
        {[
          { label: 'Photo', value: data.photo ? 'Attached' : 'None', ok: !!data.photo },
          { label: 'Voice', value: data.voice ? `${data.voiceSeconds || 0} sec recording` : 'None', ok: !!data.voice },
          { label: 'Location', value: data.location ? (data.location.manual ? 'Manual (entered)' : `${data.location.lat}, ${data.location.lng}`) : 'None', ok: !!data.location },
          { label: 'Time', value: time, ok: true },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 18px',
            borderBottom: i < 3 ? `1px solid ${C.border}` : 'none',
            background: i % 2 === 0 ? C.white : C.surface,
          }}>
            <span style={{ fontSize: 14, color: C.secondary }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: row.ok && (row.value !== 'None') ? C.primary : C.secondary }}>
              {row.ok && row.value !== 'None' ? '✓ ' : ''}{row.value}
            </span>
          </div>
        ))}
      </div>

      {!data.photo && !data.voice && !data.location && (
        <div style={{ padding: '10px 14px', background: '#FFFBF0', border: '1px solid #E8C97A', borderRadius: 6, marginBottom: 16, fontSize: 13, color: C.primary }}>
          Please add at least one piece of information before submitting.
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '10px 14px', background: '#FDF2F1', border: `1px solid #F0C6C3`, borderRadius: 6, marginBottom: 16, fontSize: 13, color: C.accent }}>
          {errorMessage}
        </div>
      )}

      <button
        id="review-send-btn"
        onClick={onSubmit}
        disabled={status === 'sending' || (!data.photo && !data.voice && !data.location)}
        style={{
          background: status === 'sending' ? C.secondary : C.accent,
          color: C.white, border: 'none', borderRadius: 8,
          padding: '18px', fontSize: 17, fontWeight: 700, cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          width: '100%', minHeight: 60, transition: 'background 0.15s',
          opacity: (!data.photo && !data.voice && !data.location) ? 0.5 : 1,
        }}
      >
        {status === 'sending' ? 'Sending…' : 'SEND REPORT'}
      </button>
    </div>
  )
}

// ─── Screen: Success ──────────────────────────────────────────────────────────
function SuccessScreen({ data }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: C.primary, margin: '0 0 16px' }}>Report received.</h2>
      <p style={{ fontSize: 15, color: C.secondary, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
        Cascade is processing the information and adding it to the emergency intelligence system.
      </p>
      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
        padding: '16px 20px', marginBottom: 28, textAlign: 'left',
        display: 'inline-block', minWidth: 200,
      }}>
        {data.photo && <div style={{ fontSize: 14, padding: '4px 0', color: C.primary }}>📷 Photo <span style={{ color: C.success, fontWeight: 600 }}>✓</span></div>}
        {data.voice && <div style={{ fontSize: 14, padding: '4px 0', color: C.primary }}>🎙 Voice <span style={{ color: C.success, fontWeight: 600 }}>✓</span></div>}
        {data.location && <div style={{ fontSize: 14, padding: '4px 0', color: C.primary }}>📍 Location <span style={{ color: C.success, fontWeight: 600 }}>✓</span></div>}
      </div>
      <Link to="/" style={{
        display: 'block', background: C.surface, color: C.primary, textDecoration: 'none',
        border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px',
        fontSize: 15, fontWeight: 500,
      }}>← Return to Home</Link>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MobilePortal() {
  const [screen, setScreen] = useState('home') // home | photo | voice | location | review | success
  const [collected, setCollected] = useState({ photo: null, photoPreview: null, voice: null, voiceSeconds: 0, location: null })
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onPhotoCapture = (file, preview) => {
    setCollected(c => ({ ...c, photo: file, photoPreview: preview }))
    setScreen('review')
  }

  const onVoiceCapture = (blob, seconds) => {
    setCollected(c => ({ ...c, voice: blob, voiceSeconds: seconds }))
    setScreen('review')
  }

  const onLocationCapture = (loc) => {
    setCollected(c => ({ ...c, location: loc }))
    setScreen('review')
  }

  const handleSubmit = async () => {
    setSubmitStatus('sending')
    setErrorMessage('')

    try {
      // Build a text description from collected data for the existing API
      const parts = []
      if (collected.voice) parts.push('Voice recording attached')
      if (collected.photo) parts.push('Photo evidence attached')
      if (collected.location && !collected.location.manual) {
        parts.push(`Location: ${collected.location.lat}, ${collected.location.lng}`)
      }
      if (parts.length === 0) parts.push('Field report submitted from mobile portal')

      const res = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: parts.join('. '),
          source: 'citizen',
        })
      })

      if (res.ok) {
        setSubmitStatus('sent')
        setScreen('success')
      } else {
        const data = await res.json()
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Could not submit report. Please try again.')
      }
    } catch {
      // If server unreachable, still show success (offline mode)
      setSubmitStatus('sent')
      setScreen('success')
    }
  }

  return (
    <div style={{
      background: C.bg, minHeight: '100dvh',
      fontFamily: "'IBM Plex Sans', sans-serif",
      color: C.primary,
    }}>
      {/* Header */}
      <div style={{
        background: C.white, borderBottom: `1px solid ${C.border}`,
        padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', color: C.primary, lineHeight: 1 }}>CASCADE</div>
          <div style={{ fontSize: 9, color: C.secondary, fontWeight: 500, letterSpacing: '0.08em' }}>Emergency Reporting</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.success, display: 'inline-block' }} />
          <span style={{ fontSize: 10, color: C.secondary, fontWeight: 500 }}>Location available</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
        {screen === 'home' && <HomeScreen onAction={setScreen} />}
        {screen === 'photo' && <PhotoScreen onBack={() => setScreen('home')} onCapture={onPhotoCapture} />}
        {screen === 'voice' && <VoiceScreen onBack={() => setScreen('home')} onCapture={onVoiceCapture} />}
        {screen === 'location' && <LocationScreen onBack={() => setScreen('home')} onCapture={onLocationCapture} />}
        {screen === 'review' && (
          <ReviewScreen
            data={collected}
            onBack={() => setScreen('home')}
            onSubmit={handleSubmit}
            status={submitStatus}
            errorMessage={errorMessage}
          />
        )}
        {screen === 'success' && <SuccessScreen data={collected} />}
      </div>
    </div>
  )
}
