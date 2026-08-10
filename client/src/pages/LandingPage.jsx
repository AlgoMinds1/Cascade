import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  Mic,
  MapPin,
  AlertTriangle,
  Ambulance,
  Hospital,
  TrendingUp,
  ArrowUp,
  Package,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react'

// ─── Color constants ──────────────────────────────────────────────────────────
const C = {
  bg: '#F6F7F5',
  primary: '#17211F',
  secondary: '#596460',
  border: '#D9DEDA',
  surface: '#ECEFEC',
  accent: '#C94B3C',
  warning: '#B47A25',
  success: '#397A57',
  white: '#FFFFFF',
}

// ─── Operational SVG Visualization ───────────────────────────────────────────
function OperationalViz() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % 5
      setStep(i)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const updates = [
    { label: 'Bridge Collapsed', color: C.accent, Icon: AlertTriangle },
    { label: 'Ambulance Route Changed', color: C.warning, Icon: Ambulance },
    { label: 'Evacuation Route Updated', color: C.primary, Icon: TrendingUp },
    { label: 'Hospital Load Recalculated', color: C.success, Icon: Hospital },
    { label: 'Rescue Priority Changed', color: C.accent, Icon: ArrowUp },
  ]

  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      overflow: 'hidden',
      width: '100%',
    }}>
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.success, display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: C.primary }}>LIVE WORLD STATE — CASCADE</span>
        </div>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: C.secondary, background: C.white, padding: '2px 6px', borderRadius: 4, border: `1px solid ${C.border}` }}>
          SIM: ACTIVE
        </span>
      </div>

      <div style={{ padding: 20 }}>
        <svg width="100%" viewBox="0 0 480 200" style={{ display: 'block', borderRadius: 6, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }}>
          <style>{`
            @keyframes pathFlow {
              from { stroke-dashoffset: 20; }
              to { stroke-dashoffset: 0; }
            }
            .animated-path {
              animation: pathFlow 1.2s linear infinite;
            }
          `}</style>

          {/* Base Canvas */}
          <rect width="480" height="200" fill={C.bg} />

          {/* Horizontal Roads */}
          <rect x="0" y="62" width="480" height="16" fill="#E5E9E6" />
          <rect x="0" y="142" width="480" height="16" fill="#E5E9E6" />

          {/* Vertical Roads */}
          <rect x="112" y="0" width="16" height="200" fill="#E5E9E6" />
          <rect x="232" y="0" width="16" height="200" fill="#E5E9E6" />
          <rect x="352" y="0" width="16" height="200" fill="#E5E9E6" />

          {/* Lane Centerlines */}
          <line x1="0" y1="70" x2="480" y2="70" stroke="#D3D8D5" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="0" y1="150" x2="480" y2="150" stroke="#D3D8D5" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="120" y1="0" x2="120" y2="200" stroke="#D3D8D5" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="240" y1="0" x2="240" y2="200" stroke="#D3D8D5" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="360" y1="0" x2="360" y2="200" stroke="#D3D8D5" strokeWidth="1" strokeDasharray="4,4" />

          {/* Top Row City Blocks (y=14..54) */}
          <rect x="24" y="14" width="80" height="40" rx="4" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="136" y="14" width="88" height="40" rx="4" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="256" y="14" width="88" height="40" rx="4" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="376" y="14" width="80" height="40" rx="4" fill={C.surface} stroke={C.border} strokeWidth="1" />

          {/* Bottom Row City Blocks (y=86..134) */}
          <rect x="24" y="86" width="80" height="48" rx="4" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="136" y="86" width="88" height="48" rx="4" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="376" y="86" width="80" height="48" rx="4" fill={C.surface} stroke={C.border} strokeWidth="1" />

          {/* Hospital Block */}
          <rect x="256" y="86" width="88" height="48" rx="4" fill={step >= 4 ? '#E6F4EA' : '#EEF7F2'} stroke={C.success} strokeWidth={step >= 4 ? '2' : '1.5'} />
          <text x="300" y="106" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.success} fontFamily="IBM Plex Sans, sans-serif">H</text>
          <text x="300" y="120" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.success} fontFamily="IBM Plex Sans, sans-serif">HOSPITAL</text>
          {step >= 4 && (
            <text x="300" y="130" textAnchor="middle" fontSize="7" fontWeight="700" fill={C.success} fontFamily="IBM Plex Sans, sans-serif">LOAD: RECALCULATED</text>
          )}
          {/* Hospital Entrance Indicator */}
          <rect x="248" y="104" width="8" height="12" rx="2" fill={C.success} />

          {/* Street Name Labels */}
          <text x="180" y="73" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.secondary} fontFamily="IBM Plex Sans, sans-serif" opacity="0.8">MAIN AVE</text>
          <text x="180" y="153" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.secondary} fontFamily="IBM Plex Sans, sans-serif" opacity="0.8">SOUTH AVE</text>
          <text x="120" y="10" textAnchor="middle" fontSize="7" fontWeight="600" fill={C.secondary} fontFamily="IBM Plex Sans, sans-serif" opacity="0.7">1ST AVE</text>
          <text x="240" y="10" textAnchor="middle" fontSize="7" fontWeight="600" fill={C.secondary} fontFamily="IBM Plex Sans, sans-serif" opacity="0.7">CENTRAL AVE</text>
          <text x="360" y="10" textAnchor="middle" fontSize="7" fontWeight="600" fill={C.secondary} fontFamily="IBM Plex Sans, sans-serif" opacity="0.7">EAST AVE</text>

          {/* Evacuation Zone Highlight (Step 3+) */}
          {step >= 3 && (
            <g>
              <rect x="132" y="10" width="96" height="48" rx="4" fill={C.accent} fillOpacity="0.08" stroke={C.accent} strokeWidth="1.5" strokeDasharray="4,3" />
              <text x="180" y="24" textAnchor="middle" fontSize="7" fontWeight="700" fill={C.accent} fontFamily="IBM Plex Sans, sans-serif">EVACUATION ZONE</text>
            </g>
          )}

          {/* Road Closure on Central Ave */}
          {step >= 1 ? (
            <g>
              <line x1="240" y1="45" x2="240" y2="95" stroke={C.accent} strokeWidth="4" strokeDasharray="4,3" />
              <rect x="219" y="62.5" width="42" height="15" rx="3" fill={C.accent} />
              <text x="240" y="73.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="white" fontFamily="IBM Plex Sans, sans-serif">CLOSED</text>
            </g>
          ) : (
            <line x1="240" y1="45" x2="240" y2="95" stroke={C.border} strokeWidth="3" opacity="0.5" />
          )}

          {/* Ambulance Routes */}
          {step >= 2 ? (
            <g>
              <path
                className="animated-path"
                d="M 55 70 L 112 70 Q 120 70 120 78 L 120 142 Q 120 150 128 150 L 232 150 Q 240 150 240 142 L 240 114 Q 240 110 248 110 L 256 110"
                stroke={C.warning}
                strokeWidth="3"
                strokeDasharray="6,4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g transform="translate(42, 61)">
                <rect width="26" height="18" rx="4" fill={C.warning} />
                <rect x="18" y="3" width="5" height="12" fill="#FFFFFF" opacity="0.8" rx="1" />
                <path d="M7 9h6M10 6v6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          ) : (
            <g>
              <path
                d="M 55 70 L 232 70 Q 240 70 240 78 L 240 110 L 256 110"
                stroke={C.secondary}
                strokeWidth="2"
                strokeDasharray="4,3"
                fill="none"
                opacity="0.5"
              />
              <g transform="translate(42, 61)">
                <rect width="26" height="18" rx="4" fill={C.secondary} opacity="0.7" />
                <rect x="18" y="3" width="5" height="12" fill="#FFFFFF" opacity="0.8" rx="1" />
                <path d="M7 9h6M10 6v6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* Step 0 Banner */}
          {step === 0 && (
            <g>
              <rect x="175" y="58" width="130" height="24" rx="4" fill={C.accent} />
              <text x="240" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="white" fontFamily="IBM Plex Sans, sans-serif">BRIDGE COLLAPSED</text>
            </g>
          )}
        </svg>

        <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          {updates.slice(0, step + 1).map((u, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              borderRadius: 4,
              background: i === step ? C.surface : 'transparent',
              opacity: i === step ? 1 : 0.45,
              transition: 'all 0.3s',
            }}>
              <u.Icon style={{ width: 14, height: 14, flexShrink: 0, color: i === step ? u.color : C.secondary }} />
              <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? u.color : C.secondary }}>
                {u.label}
              </span>
              {i === 0 && step > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 10, color: C.secondary, fontWeight: 600, letterSpacing: '0.04em' }}>
                  UPDATED
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav style={{
      background: C.white,
      borderBottom: `1px solid ${C.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: "'IBM Plex Sans', sans-serif",
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', color: C.primary }}>CASCADE</span>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: C.secondary }}>DISASTER INTELLIGENCE SYSTEM</span>
        </Link>

        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="hidden md:flex">
          {[['Platform', '#platform'], ['How It Works', '#how-it-works'], ['Capabilities', '#capabilities'], ['Safety', '#safety']].map(([label, href]) => (
            <a key={label} href={href} style={{
              fontSize: 14, fontWeight: 500, color: C.secondary, textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = C.primary}
            onMouseLeave={e => e.target.style.color = C.secondary}
            >{label}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="hidden md:flex">
          <Link to="/operator" style={{
            fontSize: 13, fontWeight: 500, color: C.secondary, textDecoration: 'none',
            padding: '8px 16px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.white,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.secondary; }}
          >Operator Login</Link>
          <Link to="/report" style={{
            fontSize: 13, fontWeight: 600, color: C.white, textDecoration: 'none',
            padding: '8px 16px', borderRadius: 6, background: C.accent, border: `1px solid ${C.accent}`,
            boxShadow: '0 2px 6px rgba(201, 75, 60, 0.2)', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >Report an Incident</Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: C.primary }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen
              ? <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              : <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            }
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div style={{
          background: C.white, borderTop: `1px solid ${C.border}`,
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {[['Platform', '#platform'], ['How It Works', '#how-it-works'], ['Capabilities', '#capabilities'], ['Safety', '#safety']].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMobileOpen(false)} style={{
              fontSize: 15, fontWeight: 500, color: C.primary, textDecoration: 'none', padding: '6px 0',
            }}>{label}</a>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/operator" onClick={() => setMobileOpen(false)} style={{
              fontSize: 14, fontWeight: 500, color: C.secondary, textDecoration: 'none',
              padding: '10px 16px', border: `1px solid ${C.border}`, borderRadius: 6, textAlign: 'center',
            }}>Operator Login</Link>
            <Link to="/report" onClick={() => setMobileOpen(false)} style={{
              fontSize: 14, fontWeight: 600, color: C.white, textDecoration: 'none',
              padding: '10px 16px', background: C.accent, borderRadius: 6, textAlign: 'center',
            }}>Report an Incident</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="platform" style={{
      position: 'relative',
      background: C.white,
      backgroundImage: `linear-gradient(to bottom, rgba(246, 247, 245, 0.55), rgba(255, 255, 255, 0.92)), url('/disaster_map_bg.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderBottom: `1px solid ${C.border}`,
      padding: '72px 24px 80px',
      overflow: 'hidden',
    }}>
      {/* Tactical overlay pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        opacity: 0.25,
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 48,
        alignItems: 'center',
      }}>
        {/* Left Column */}
        <div style={{ maxWidth: 640 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: C.secondary,
            padding: '5px 12px', border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 24,
            background: C.surface, display: 'inline-block', boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}>MULTI-AGENT EMERGENCY INTELLIGENCE</span>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.08,
            color: C.primary, letterSpacing: '-0.025em', margin: '0 0 24px', marginTop: 12,
          }}>
            When disaster changes,<br />the plan changes with it.
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.6, color: C.secondary,
            margin: '0 0 36px', maxWidth: 540,
          }}>
            Cascade transforms fragmented voice messages, images, maps and incomplete reports into a continuously updating disaster world model.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
            <Link to="/report" id="hero-report-btn" style={{
              fontSize: 15, fontWeight: 600, color: C.white, textDecoration: 'none',
              padding: '14px 28px', borderRadius: 6, background: C.accent, display: 'inline-block',
              boxShadow: '0 4px 14px rgba(201, 75, 60, 0.25)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Report an Incident</Link>

            <Link to="/operator" id="hero-operator-btn" style={{
              fontSize: 15, fontWeight: 500, color: C.primary, textDecoration: 'none',
              padding: '14px 28px', borderRadius: 6, background: C.white, border: `1px solid ${C.border}`,
              display: 'inline-block', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.primary}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >Enter Command Center</Link>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            {['AI-assisted', 'Evidence-driven', 'Human-approved'].map((t, i) => (
              <span key={t} style={{ fontSize: 12, color: C.secondary, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                {i > 0 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.border, display: 'inline-block' }} />}
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Visualization Card */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: 520,
            boxShadow: '0 20px 45px -10px rgba(23, 33, 31, 0.14), 0 0 0 1px rgba(217, 222, 218, 0.8)',
            borderRadius: 12,
            background: C.white,
          }}>
            <OperationalViz />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function ProblemSection() {
  const quotes = [
    { text: "There's a fire near the school.", source: "Citizen, 14:32" },
    { text: "Bridge might be damaged.", source: "Field Officer, 14:38" },
    { text: "My mother is trapped.", source: "Citizen, 14:41" },
    { text: "Road 17 is blocked.", source: "Driver, 14:45" },
  ]

  return (
    <section style={{
      position: 'relative',
      padding: '80px 24px',
      background: C.bg,
      backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 640, marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.02em', color: C.primary, margin: '0 0 20px' }}>
            Disasters don't arrive as clean datasets.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: C.secondary, margin: 0 }}>
            Emergency information is fragmented, incomplete, contradictory, unstructured and constantly changing. No single report tells the full story.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 40 }}>
          {quotes.map((q, i) => (
            <div key={i} style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '20px 20px 16px',
              boxShadow: '0 4px 12px rgba(23,33,31,0.03)',
            }}>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: C.primary, margin: '0 0 12px', fontStyle: 'italic' }}>"{q.text}"</p>
              <span style={{ fontSize: 11, color: C.secondary, fontWeight: 600 }}>{q.source}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {['Fragmented', 'Incomplete', 'Contradictory', 'Unstructured', 'Constantly changing'].map(t => (
            <span key={t} style={{
              fontSize: 12, fontWeight: 600, color: C.accent, background: '#FDF2F1',
              border: '1px solid #F0C6C3', padding: '4px 12px', borderRadius: 4, letterSpacing: '0.02em',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}>{t}</span>
          ))}
        </div>

        <div style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: '24px 28px',
          borderLeft: `4px solid ${C.accent}`,
          boxShadow: '0 6px 18px rgba(23,33,31,0.04)',
          maxWidth: 680,
        }}>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: C.primary, fontWeight: 600, margin: 0,
          }}>
            Cascade connects these reports into a living operational picture instead of treating them as isolated incidents.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { label: 'VOICE / IMAGE / LOCATION', desc: 'Field reports from citizens and responders' },
    { label: 'UNDERSTAND', desc: 'AI extracts structured facts from raw input' },
    { label: 'VERIFY', desc: 'Cross-reference with existing world state' },
    { label: 'UPDATE WORLD STATE', desc: 'Confirmed facts update the live model' },
    { label: 'SIMULATE IMPACT', desc: 'Propagate consequences across systems' },
    { label: 'RECOMMEND RESPONSE', desc: 'Generate actionable intelligence' },
  ]

  return (
    <section id="how-it-works" style={{ padding: '80px 24px', background: C.white, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 520, marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: C.secondary, display: 'block', marginBottom: 10 }}>HOW IT WORKS</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, lineHeight: 1.14, letterSpacing: '-0.02em', color: C.primary, margin: 0 }}>
            From chaotic reports to coordinated action.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              background: i === 0 ? '#FDF2F1' : C.white,
              border: `1px solid ${i === 0 ? '#F0C6C3' : C.border}`,
              borderRadius: 8,
              padding: '20px 16px',
              boxShadow: '0 4px 12px rgba(23,33,31,0.03)',
              position: 'relative',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i === 0 ? C.accent : C.primary,
                color: C.white, fontSize: 12, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>{i + 1}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: i === 0 ? C.accent : C.primary, marginBottom: 6, lineHeight: 1.3 }}>{step.label}</div>
              <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.4 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Multi-Agent ──────────────────────────────────────────────────────────────
function MultiAgentSection() {
  const agents = [
    'Vision Agent', 'Geospatial Agent', 'Verification Agent', 'Resource Agent',
    'Medical Triage Agent', 'Communications Agent', 'Route Agent', 'Contradiction Agent',
  ]

  return (
    <section id="capabilities" style={{ padding: '80px 24px', background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 480, marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: C.secondary, display: 'block', marginBottom: 10 }}>MULTI-AGENT INTELLIGENCE</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, lineHeight: 1.14, letterSpacing: '-0.02em', color: C.primary, margin: 0 }}>
            A swarm built for one mission.
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, flex: '1 1 300px' }}>
            {agents.map((agent, i) => (
              <div key={i} style={{
                padding: '14px 16px', background: C.white, border: `1px solid ${C.border}`,
                borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.primary,
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.success, display: 'inline-block', flexShrink: 0 }} />
                {agent}
              </div>
            ))}
          </div>

          <div style={{
            flex: '0 0 240px', background: C.primary, color: C.white,
            borderRadius: 10, padding: '32px 24px', textAlign: 'center',
            boxShadow: '0 16px 36px rgba(23, 33, 31, 0.2)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>CONTINUOUSLY UPDATING</div>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35 }}>LIVE DISASTER<br />WORLD MODEL</div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Core Differentiator ──────────────────────────────────────────────────────
function CoreDifferentiatorSection() {
  const impacts = [
    { label: 'Ambulance Route', value: 'Rerouted', Icon: Ambulance },
    { label: 'Evacuation Zone', value: 'Updated', Icon: TrendingUp },
    { label: 'Hospital Load', value: 'Recalculated', Icon: Hospital },
    { label: 'Rescue Priority', value: 'Changed', Icon: ArrowUp },
    { label: 'Supply Route', value: 'Redirected', Icon: Package },
  ]

  return (
    <section style={{ padding: '80px 24px', background: C.white, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 600, marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.primary, margin: '0 0 4px' }}>
            Don't just ask what happened.
          </h2>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.accent, margin: '0 0 20px' }}>
            Ask what changes if it's true.
          </h2>
          <p style={{ fontSize: 16, color: C.secondary, lineHeight: 1.6, margin: 0 }}>
            Every confirmed report cascades through the operational model, automatically updating every dependent system.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            flex: '0 0 220px', background: '#FDF2F1', border: '1px solid #F0C6C3',
            borderRadius: 10, padding: '28px 24px', boxShadow: '0 6px 18px rgba(201, 75, 60, 0.06)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: C.accent, marginBottom: 10 }}>EVENT</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.primary, lineHeight: 1.25 }}>BRIDGE<br />COLLAPSED</div>
            <div style={{ marginTop: 16, width: 36, height: 3, background: C.accent, borderRadius: 2 }} />
          </div>

          <div style={{ color: C.secondary, display: 'flex', alignItems: 'center', padding: '28px 0' }}>
            <ArrowRight style={{ width: 24, height: 24 }} />
          </div>

          <div style={{ flex: '1 1 280px', boxShadow: '0 6px 20px rgba(23, 33, 31, 0.04)', borderRadius: 8, overflow: 'hidden' }}>
            {impacts.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px',
                background: i % 2 === 0 ? C.surface : C.white,
                borderBottom: i < impacts.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <span style={{ fontSize: 14, color: C.primary, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <item.Icon style={{ width: 16, height: 16, color: C.secondary }} />
                  {item.label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.04em' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Field Reporting ──────────────────────────────────────────────────────────
function FieldReportingSection() {
  return (
    <section style={{
      position: 'relative',
      padding: '80px 24px',
      background: C.bg,
      backgroundImage: `linear-gradient(to bottom, rgba(246, 247, 245, 0.7), rgba(246, 247, 245, 0.9)), url('/disaster_map_bg.png')`,
      backgroundSize: 'cover',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', maxWidth: 480 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: C.secondary, display: 'block', marginBottom: 10 }}>FIELD REPORTING</span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, lineHeight: 1.14, letterSpacing: '-0.02em', color: C.primary, margin: '0 0 18px' }}>
              The command center starts with people on the ground.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: C.secondary, margin: '0 0 28px' }}>
              Anyone at the scene can quickly send evidence to Cascade using their phone. No account required. No complicated forms.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {[
                { Icon: Camera, label: 'Take a Photo', desc: 'Capture damage, hazards or blocked roads' },
                { Icon: Mic, label: 'Record Voice', desc: 'Describe what you see' },
                { Icon: MapPin, label: 'Share Location', desc: 'Help responders find you' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                    <item.Icon style={{ width: 22, height: 22, color: C.primary }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: C.secondary }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/report" id="field-report-btn" style={{
              fontSize: 14, fontWeight: 600, color: C.white, textDecoration: 'none',
              padding: '12px 24px', borderRadius: 6, background: C.accent, display: 'inline-flex',
              alignItems: 'center', gap: 8, transition: 'opacity 0.15s',
              boxShadow: '0 4px 12px rgba(201, 75, 60, 0.22)',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Open Field Reporter <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>

          {/* Phone mockup */}
          <div style={{ flex: '0 0 220px', margin: '0 auto' }}>
            <div style={{
              width: 220, background: C.primary, borderRadius: 32,
              padding: 8, boxShadow: '0 28px 56px -12px rgba(23, 33, 31, 0.25)',
            }}>
              <div style={{ background: C.bg, borderRadius: 26, overflow: 'hidden', minHeight: 380, padding: '24px 16px' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: C.primary }}>CASCADE</div>
                  <div style={{ fontSize: 9, color: C.secondary, marginBottom: 4 }}>Emergency Reporting</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', background: '#EEF7F2', border: `1px solid ${C.border}`, borderRadius: 10 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.success, display: 'inline-block' }} />
                    <span style={{ fontSize: 8, color: C.success, fontWeight: 600 }}>Location available</span>
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, textAlign: 'center', marginBottom: 20 }}>What is happening?</div>
                {[
                  { Icon: Camera, label: 'Take a Photo' },
                  { Icon: Mic, label: 'Record Voice' },
                  { Icon: MapPin, label: 'Share Location' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: '12px 10px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}>
                    <item.Icon style={{ width: 16, height: 16, color: C.primary }} />
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.primary }}>{item.label}</div>
                  </div>
                ))}
                <p style={{
                  fontSize: 9, color: C.secondary, lineHeight: 1.4, marginTop: 14,
                  padding: '6px 8px', background: C.surface, borderRadius: 5, textAlign: 'center',
                }}>
                  If in immediate danger, move to a safe location first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Safety / Trust ───────────────────────────────────────────────────────────
function SafetySection() {
  const principles = [
    { title: 'Evidence', desc: 'Recommendations are connected to verifiable field reports, drone images, and geospatial data. Nothing is asserted without a source.' },
    { title: 'Uncertainty', desc: 'Conflicting or incomplete reports remain visible. Cascade does not hide ambiguity or force premature conclusions.' },
    { title: 'Human Control', desc: 'Critical operational decisions remain under human authority. The system recommends; commanders decide.' },
  ]

  return (
    <section id="safety" style={{ padding: '80px 24px', background: C.white, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 520, marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: C.secondary, display: 'block', marginBottom: 10 }}>SAFETY</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, lineHeight: 1.14, letterSpacing: '-0.02em', color: C.primary, margin: '0 0 16px' }}>
            AI recommends. Humans decide.
          </h2>
          <p style={{ fontSize: 16, color: C.secondary, lineHeight: 1.65, margin: 0 }}>
            Cascade is a decision-support system. It amplifies the clarity and speed of emergency response, but operational authority always remains with human commanders.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {principles.map((p, i) => (
            <div key={i} style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '28px 24px',
              boxShadow: '0 4px 12px rgba(23,33,31,0.03)',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: C.secondary, marginBottom: 12 }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.primary, marginBottom: 10 }}>{p.title}</div>
              <p style={{ fontSize: 14, color: C.secondary, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section style={{
      position: 'relative',
      padding: '96px 24px',
      background: C.primary,
      backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
      color: C.white,
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.white, margin: '0 auto 18px', maxWidth: 600 }}>
          Build a clearer picture when everything is changing.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: '0 auto 36px', maxWidth: 500 }}>
          Connect reports, evidence, infrastructure and response intelligence into one continuously updating operational picture.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/report" id="cta-report-btn" style={{
            fontSize: 15, fontWeight: 600, color: C.white, textDecoration: 'none',
            padding: '14px 28px', borderRadius: 6, background: C.accent, display: 'inline-block',
            boxShadow: '0 4px 14px rgba(201, 75, 60, 0.3)', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >Report an Incident</Link>
          <Link to="/operator" id="cta-operator-btn" style={{
            fontSize: 15, fontWeight: 500, color: C.white, textDecoration: 'none',
            padding: '14px 28px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
            display: 'inline-block', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.white}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
          >Enter Command Center</Link>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#111817', color: C.white, padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 28, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>CASCADE</div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.38)' }}>DISASTER INTELLIGENCE SYSTEM</div>
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            {[['Platform', '#platform'], ['How It Works', '#how-it-works'], ['Safety', '#safety']].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l}</a>
            ))}
            <Link to="/report" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Report an Incident</Link>
            <Link to="/operator" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Operator Login</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>AI-assisted emergency intelligence • Human-approved operations</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>Cascade System © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{
      background: C.bg, color: C.primary,
      fontFamily: "'IBM Plex Sans', sans-serif", overflowX: 'hidden',
    }}>
      <Nav />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <MultiAgentSection />
      <CoreDifferentiatorSection />
      <FieldReportingSection />
      <SafetySection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}
