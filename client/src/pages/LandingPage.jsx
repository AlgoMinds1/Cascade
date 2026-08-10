import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
    { label: 'Bridge Collapsed', color: C.accent, icon: '⚠' },
    { label: 'Ambulance Route Changed', color: C.warning, icon: '🚑' },
    { label: 'Evacuation Route Updated', color: C.primary, icon: '↗' },
    { label: 'Hospital Load Recalculated', color: C.success, icon: '🏥' },
    { label: 'Rescue Priority Changed', color: C.accent, icon: '⬆' },
  ]

  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      overflow: 'hidden',
      maxWidth: 520,
      width: '100%',
      marginTop: 40,
    }}>
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.success, display: 'inline-block' }} />
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: C.secondary }}>LIVE WORLD STATE — CASCADE</span>
      </div>

      <div style={{ padding: 20 }}>
        <svg width="100%" viewBox="0 0 480 200" style={{ display: 'block', borderRadius: 4 }}>
          <rect width="480" height="200" fill={C.bg} />
          <rect x="40" y="20" width="80" height="50" rx="2" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="160" y="20" width="60" height="50" rx="2" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="260" y="20" width="80" height="50" rx="2" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="380" y="20" width="60" height="50" rx="2" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="40" y="130" width="80" height="50" rx="2" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="160" y="130" width="60" height="50" rx="2" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="380" y="130" width="60" height="50" rx="2" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="260" y="130" width="80" height="50" rx="2" fill="#EEF7F2" stroke={C.success} strokeWidth="1.5" />
          <text x="300" y="152" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.success} fontFamily="IBM Plex Sans, sans-serif">H</text>
          <text x="300" y="168" textAnchor="middle" fontSize="9" fill={C.success} fontFamily="IBM Plex Sans, sans-serif">HOSPITAL</text>
          <rect x="0" y="85" width="480" height="14" fill="#E8EAE8" />
          <rect x="130" y="0" width="14" height="200" fill="#E8EAE8" />
          <rect x="245" y="0" width="14" height="200" fill="#E8EAE8" />
          <rect x="360" y="0" width="14" height="200" fill="#E8EAE8" />
          <text x="240" y="97" textAnchor="middle" fontSize="8" fill={C.secondary} fontFamily="IBM Plex Sans, sans-serif">MAIN AVE</text>
          {step >= 1 ? (
            <>
              <line x1="245" y1="60" x2="245" y2="110" stroke={C.accent} strokeWidth="4" strokeDasharray="5,3" />
              <rect x="230" y="75" width="28" height="14" rx="2" fill={C.accent} />
              <text x="244" y="85" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="white" fontFamily="IBM Plex Sans, sans-serif">CLOSED</text>
            </>
          ) : (
            <line x1="245" y1="60" x2="245" y2="110" stroke={C.border} strokeWidth="4" />
          )}
          {step >= 2 ? (
            <g>
              <path d="M80 92 L130 92 L130 155 L245 155" stroke={C.warning} strokeWidth="2" strokeDasharray="6,3" fill="none" />
              <rect x="60" y="82" width="22" height="16" rx="2" fill={C.warning} />
              <text x="71" y="93" textAnchor="middle" fontSize="10" fill="white" fontFamily="IBM Plex Sans, sans-serif">🚑</text>
            </g>
          ) : (
            <g>
              <path d="M60 92 L260 92" stroke={C.secondary} strokeWidth="2" strokeDasharray="4,3" fill="none" opacity="0.4" />
              <rect x="60" y="82" width="22" height="16" rx="2" fill={C.secondary} opacity="0.5" />
            </g>
          )}
          {step >= 3 && (
            <rect x="148" y="8" width="86" height="72" rx="3" fill={C.accent} fillOpacity="0.08" stroke={C.accent} strokeWidth="1.5" strokeDasharray="5,3" />
          )}
          {step === 0 && (
            <g>
              <rect x="200" y="60" width="82" height="22" rx="3" fill={C.accent} />
              <text x="241" y="75" textAnchor="middle" fontSize="9" fontWeight="700" fill="white" fontFamily="IBM Plex Sans, sans-serif">BRIDGE COLLAPSED</text>
            </g>
          )}
        </svg>

        <div style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          {updates.slice(0, step + 1).map((u, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 0',
              opacity: i === step ? 1 : 0.4,
              transition: 'opacity 0.3s',
            }}>
              <span style={{ fontSize: 13 }}>{u.icon}</span>
              <span style={{ fontSize: 11, fontWeight: i === step ? 600 : 400, color: i === step ? u.color : C.secondary }}>
                {u.label}
              </span>
              {i === 0 && step > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 10, color: C.secondary, fontWeight: 500 }}>
                  WORLD STATE UPDATED
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
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.04em', color: C.primary }}>CASCADE</span>
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', color: C.secondary }}>DISASTER INTELLIGENCE SYSTEM</span>
        </Link>

        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="hidden md:flex">
          {[['Platform', '#platform'], ['How It Works', '#how-it-works'], ['Capabilities', '#capabilities'], ['Safety', '#safety']].map(([label, href]) => (
            <a key={label} href={href} style={{
              fontSize: 14, fontWeight: 500, color: C.secondary, textDecoration: 'none',
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
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.secondary; }}
          >Operator Login</Link>
          <Link to="/report" style={{
            fontSize: 13, fontWeight: 600, color: C.white, textDecoration: 'none',
            padding: '8px 16px', borderRadius: 6, background: C.accent, border: `1px solid ${C.accent}`,
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
      background: C.white, borderBottom: `1px solid ${C.border}`,
      padding: '72px 24px 64px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 680 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: C.secondary,
            padding: '4px 10px', border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 28,
            background: C.surface, display: 'inline-block',
          }}>MULTI-AGENT EMERGENCY INTELLIGENCE</span>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 700, lineHeight: 1.08,
            color: C.primary, letterSpacing: '-0.02em', margin: '0 0 24px', marginTop: 16,
          }}>
            When disaster changes,<br />the plan changes with it.
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.6, color: C.secondary,
            margin: '0 0 40px', maxWidth: 560,
          }}>
            Cascade transforms fragmented voice messages, images, maps and incomplete reports into a continuously updating disaster world model.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/report" id="hero-report-btn" style={{
              fontSize: 15, fontWeight: 600, color: C.white, textDecoration: 'none',
              padding: '14px 28px', borderRadius: 6, background: C.accent, display: 'inline-block',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Report an Incident</Link>

            <Link to="/operator" id="hero-operator-btn" style={{
              fontSize: 15, fontWeight: 500, color: C.primary, textDecoration: 'none',
              padding: '14px 28px', borderRadius: 6, background: C.white, border: `1px solid ${C.border}`,
              display: 'inline-block',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.primary}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >Enter Command Center</Link>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {['AI-assisted', 'Evidence-driven', 'Human-approved'].map((t, i) => (
              <span key={t} style={{ fontSize: 12, color: C.secondary, display: 'flex', alignItems: 'center', gap: 5 }}>
                {i > 0 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.border, display: 'inline-block' }} />}
                {t}
              </span>
            ))}
          </div>
        </div>

        <OperationalViz />
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
    <section style={{ padding: '80px 24px', background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 640, marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.02em', color: C.primary, margin: '0 0 20px' }}>
            Disasters don't arrive as clean datasets.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: C.secondary, margin: 0 }}>
            Emergency information is fragmented, incomplete, contradictory, unstructured and constantly changing. No single report tells the full story.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14, marginBottom: 40 }}>
          {quotes.map((q, i) => (
            <div key={i} style={{
              background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: '18px 18px 14px',
            }}>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: C.primary, margin: '0 0 10px', fontStyle: 'italic' }}>"{q.text}"</p>
              <span style={{ fontSize: 11, color: C.secondary, fontWeight: 500 }}>{q.source}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {['Fragmented', 'Incomplete', 'Contradictory', 'Unstructured', 'Constantly changing'].map(t => (
            <span key={t} style={{
              fontSize: 12, fontWeight: 600, color: C.accent, background: '#FDF2F1',
              border: '1px solid #F0C6C3', padding: '4px 12px', borderRadius: 4, letterSpacing: '0.02em',
            }}>{t}</span>
          ))}
        </div>

        <p style={{
          fontSize: 18, lineHeight: 1.6, color: C.primary, fontWeight: 500, maxWidth: 640,
          borderLeft: `3px solid ${C.accent}`, paddingLeft: 20, margin: 0,
        }}>
          Cascade connects these reports into a living operational picture instead of treating them as isolated incidents.
        </p>
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'stretch' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 160,
                padding: '20px 16px',
                background: i === 0 ? '#FDF2F1' : C.surface,
                border: `1px solid ${i === 0 ? '#F0C6C3' : C.border}`,
                borderRadius: 6,
                minHeight: 120,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: i === 0 ? C.accent : C.secondary,
                  color: C.white, fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                }}>{i + 1}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: i === 0 ? C.accent : C.primary, marginBottom: 6, lineHeight: 1.3 }}>{step.label}</div>
                <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.4 }}>{step.desc}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ padding: '0 6px', color: C.border, fontSize: 16, flexShrink: 0 }}>→</div>
              )}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, flex: '1 1 300px' }}>
            {agents.map((agent, i) => (
              <div key={i} style={{
                padding: '12px 14px', background: C.white, border: `1px solid ${C.border}`,
                borderRadius: 6, fontSize: 13, fontWeight: 500, color: C.primary,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, display: 'inline-block', flexShrink: 0 }} />
                {agent}
              </div>
            ))}
          </div>

          <div style={{
            flex: '0 0 200px', background: C.primary, color: C.white,
            borderRadius: 8, padding: '28px 20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>CONTINUOUSLY UPDATING</div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>LIVE DISASTER<br />WORLD MODEL</div>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>LIVE</span>
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
    { label: 'Ambulance Route', value: 'Rerouted', icon: '🚑' },
    { label: 'Evacuation Zone', value: 'Updated', icon: '↗' },
    { label: 'Hospital Load', value: 'Recalculated', icon: '🏥' },
    { label: 'Rescue Priority', value: 'Changed', icon: '⬆' },
    { label: 'Supply Route', value: 'Redirected', icon: '📦' },
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
            flex: '0 0 200px', background: '#FDF2F1', border: '1px solid #F0C6C3',
            borderRadius: 8, padding: '24px 20px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: C.accent, marginBottom: 10 }}>EVENT</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.primary, lineHeight: 1.25 }}>BRIDGE<br />COLLAPSED</div>
            <div style={{ marginTop: 16, width: 36, height: 2, background: C.accent }} />
          </div>

          <div style={{ color: C.border, fontSize: 22, display: 'flex', alignItems: 'center', padding: '28px 0' }}>→</div>

          <div style={{ flex: '1 1 280px' }}>
            {impacts.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 16px',
                background: i % 2 === 0 ? C.surface : C.white,
                border: `1px solid ${C.border}`,
                borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                borderRadius: i === 0 ? '6px 6px 0 0' : i === impacts.length - 1 ? '0 0 6px 6px' : 0,
              }}>
                <span style={{ fontSize: 14, color: C.primary, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
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
    <section style={{ padding: '80px 24px', background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
                { icon: '📷', label: 'Take a Photo', desc: 'Capture damage, hazards or blocked roads' },
                { icon: '🎙', label: 'Record Voice', desc: 'Describe what you see' },
                { icon: '📍', label: 'Share Location', desc: 'Help responders find you' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 22, width: 36, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: C.secondary }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/report" id="field-report-btn" style={{
              fontSize: 14, fontWeight: 600, color: C.white, textDecoration: 'none',
              padding: '12px 24px', borderRadius: 6, background: C.accent, display: 'inline-block',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Open Field Reporter →</Link>
          </div>

          {/* Phone mockup */}
          <div style={{ flex: '0 0 200px', margin: '0 auto' }}>
            <div style={{
              width: 200, background: C.primary, borderRadius: 28,
              padding: 7, boxShadow: '0 24px 48px rgba(23,33,31,0.16)',
            }}>
              <div style={{ background: C.bg, borderRadius: 22, overflow: 'hidden', minHeight: 360, padding: '22px 14px' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: C.primary }}>CASCADE</div>
                  <div style={{ fontSize: 9, color: C.secondary, marginBottom: 4 }}>Emergency Reporting</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', background: '#EEF7F2', border: `1px solid ${C.border}`, borderRadius: 10 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.success, display: 'inline-block' }} />
                    <span style={{ fontSize: 8, color: C.success, fontWeight: 600 }}>Location available</span>
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, textAlign: 'center', marginBottom: 20 }}>What is happening?</div>
                {[
                  { icon: '📷', label: 'Take a Photo' },
                  { icon: '🎙', label: 'Record Voice' },
                  { icon: '📍', label: 'Share Location' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: C.white, border: `1px solid ${C.border}`, borderRadius: 7,
                    padding: '11px 10px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.primary }}>{item.label}</div>
                  </div>
                ))}
                <p style={{
                  fontSize: 9, color: C.secondary, lineHeight: 1.4, marginTop: 12,
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 1, background: C.border }}>
          {principles.map((p, i) => (
            <div key={i} style={{ background: C.white, padding: '28px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: C.secondary, marginBottom: 12 }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.primary, marginBottom: 10 }}>{p.title}</div>
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
    <section style={{ padding: '80px 24px', background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.primary, margin: '0 auto 18px', maxWidth: 600 }}>
          Build a clearer picture when everything is changing.
        </h2>
        <p style={{ fontSize: 17, color: C.secondary, lineHeight: 1.65, margin: '0 auto 36px', maxWidth: 500 }}>
          Connect reports, evidence, infrastructure and response intelligence into one continuously updating operational picture.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/report" id="cta-report-btn" style={{
            fontSize: 15, fontWeight: 600, color: C.white, textDecoration: 'none',
            padding: '14px 28px', borderRadius: 6, background: C.accent, display: 'inline-block',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >Report an Incident</Link>
          <Link to="/operator" id="cta-operator-btn" style={{
            fontSize: 15, fontWeight: 500, color: C.primary, textDecoration: 'none',
            padding: '14px 28px', borderRadius: 6, background: C.white, border: `1px solid ${C.border}`,
            display: 'inline-block',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.primary}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >Enter Command Center</Link>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.primary, color: C.white, padding: '40px 24px' }}>
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
