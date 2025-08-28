// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import resumePdf from "../assets/Maleka_T_Resume.pdf"; // PDF asset (kept in repo)

export default function Home() {
  // If you keep the file in /public instead, replace with: const resumePdf = "/Maleka_T_Resume.pdf";
  // Strategy: do NOT place the PDF URL into any href/src until the user authenticates.
  // Instead fetch the asset on demand and create an in-memory blob URL that is used
  // for the iframe and downloads. This provides a client-side gate. Note: because
  // the file remains in the build, a determined user could still request the static
  // asset directly by its built URL outside this UI. See the note at the end of the file.

  const [authenticated, setAuthenticated] = useState(false);
  const [blobUrl, setBlobUrl] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const pdfFetchRef = useRef(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationTimerRef = useRef(null);

  // Create blob URL only after correct password is supplied
  useEffect(() => {
    return () => {
      // cleanup blob URL if created
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      if (pdfFetchRef.current && pdfFetchRef.current.cancel) pdfFetchRef.current.cancel();
  if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    };
  }, [blobUrl]);

  const pdfUrl = authenticated ? blobUrl : "";

  // Unlock helper that accepts a password string (allows programmatic unlocking)
  const unlockWith = async (pw) => {
    setError("");
    const expected = "WelcomeFriend"; // required password
    if (pw === expected) {
      try {
        const res = await fetch(resumePdf, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch resume');
        const ab = await res.arrayBuffer();
        const blob = new Blob([ab], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setAuthenticated(true);
  // show success celebration briefly
  setShowCelebration(true);
  if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
  celebrationTimerRef.current = setTimeout(() => setShowCelebration(false), 6000);
        setShowPrompt(false);
        setPassword("");
      } catch (e) {
        setError('Unable to load resume.');
      }
    } else {
      setError('Incorrect password');
    }
  };

  // Handle submit of password prompt (uses unlockWith)
  const handleUnlock = async (ev) => {
    ev && ev.preventDefault && ev.preventDefault();
    await unlockWith(password);
  };
  
  // Open resume in new tab using the in-memory blob URL (only available when authenticated)
  const openInNewTab = () => {
    if (authenticated && blobUrl) {
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowPrompt(true);
    }
  };

  // Trigger a download of the in-memory blob (only when authenticated)
  const downloadResume = () => {
    if (authenticated && blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      setShowPrompt(true);
    }
  };
  // Open resume in new tab using the in-memory blob URL (only available when authenticated)

  return (
    <>
      <div className="ba-grid cols-2">
        {/* Resume viewer (scrolls inside the frame) */}
        <section className="ba-card resume-card">
          <div className="resume-toolbar">
            <h3 className="ba-title" style={{ margin: 0 }}>Resume</h3>
            <div className="resume-actions">
              <button className="btn-mini" onClick={() => { openInNewTab(); }} aria-pressed={authenticated}>Open in New Tab</button>
              <button className="btn-mini" onClick={() => { downloadResume(); }} aria-pressed={authenticated}>Download PDF</button>
              <button className="btn-mini" onClick={() => setShowPrompt(true)} style={{opacity: authenticated ? 0.7 : 1}}>Enter Password</button>
            </div>
          </div>

          <div className="resume-frame-wrap">
            {/* Primary: iframe PDF viewer */}
            <iframe
              className={"resume-frame " + (authenticated ? '' : 'blurred')}
              src={pdfUrl || undefined}
              title="Thabang Maleka Resume"
              sandbox={authenticated ? undefined : 'allow-scripts'}
            />

            {/* Blocking overlay while locked: prevents context menu / clicks on iframe */}
            {!authenticated && (
              <div className="resume-lock-overlay" role="dialog" aria-modal="true">
                <div className="lock-inner">
                  <div style={{fontSize:28, marginBottom:8}}>🔒</div>
                  <div style={{fontWeight:700, marginBottom:6}}>Protected resume</div>
                  <div style={{fontSize:13, marginBottom:12}}>Enter password to view or download the resume.</div>
                  <button className="btn-mini" onClick={() => setShowPrompt(true)}>Enter Password</button>
                </div>
              </div>
            )}

            {/* Fallback if browser blocks iframe PDF */}
            <div className="resume-fallback">
              <p>Your browser can’t display the PDF here.</p>
              <p>
                <a href={pdfUrl} target="_blank" rel="noreferrer">Open the resume</a> or{" "}
                <a href={resumePdf} download>download the PDF</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Side panels: Nice Resume & Quality */}
        <section className="ba-card">
          <p style={{ textAlign: "center", fontStyle: "italic", marginTop: 0 }}>
            Outside of my professional life, I enjoy playing soccer, which strengthens my teamwork and discipline, traveling to explore new perspectives and cultures, and coding as both a career and a hobby, where I find joy in solving problems creatively. My ultimate goal is to use innovation to make a lasting difference in people’s lives and contribute to shaping a smarter digital future.
          </p>

          <p style={{ textAlign: "center", fontStyle: "italic", margin: "6px 0 10px" }}>
            <strong><em>Driven by innovation, powered by passion.
            Building solutions that inspire and make an impact.</em></strong>
          </p>

          {/* Live 4D calendar + time */}
          <div className="fourd-wrap">
            <div className="fourd-scene">
              <Calendar />
              <Clock />
            </div>
          </div>
        </section>

      </div>

  {/* Page-local styles for the resume viewer */}
  <style>{css}</style>
  {/* Password prompt modal (rendered at top-level of this component) */}
  {showPrompt && (
    <div className="pw-modal" role="dialog" aria-modal="true" aria-label="Resume password prompt">
      <form className="pw-box" onSubmit={handleUnlock}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <strong>Enter password</strong>
          <button type="button" className="btn-mini" onClick={() => { setShowPrompt(false); setError(''); }}>✕</button>
        </div>
        <div style={{marginTop:10, fontSize:13, color:'#bfe7f8'}}>Provide the resume password to view or download.</div>
        <input className="pw-input" autoFocus value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        {error && <div style={{color:'#ffb3b3', marginBottom:8}}>{error}</div>}
        <div className="pw-actions">
          <button type="button" className="btn-mini" onClick={() => { setShowPrompt(false); setError(''); }}>Cancel</button>
          <button type="submit" className="btn-mini">Unlock</button>
        </div>
      </form>
    </div>
  )}
  {/* Celebration overlay: balloons + success banner */}
  {showCelebration && (
    <div className="celebration-overlay" aria-hidden={!showCelebration}>
      <div className="celebration-message">
        <div className="celebration-title">Unlocked ✓</div>
        <div className="celebration-sub">Resume unlocked successfully</div>
      </div>
      <div className="balloon-set">
        {["#ff6b6b","#ffd93d","#6bf7c1","#6ba8ff","#d36bff","#ff9fb3","#8affc1","#ffd1a6"].map((c,i) => (
          <div key={i} className="balloon" style={{background:c, left: 6 + i*11 + '%', animationDelay: (i*260) + 'ms'}} />
        ))}
      </div>
    </div>
  )}
    </>
  );
}

const css = `
  /* Make the resume viewer large and scrollable */
  .resume-card {
    display: grid;
    grid-template-rows: auto 1fr;
    height: calc(100vh - 120px); /* tall area; adjust if needed */
    min-height: 640px;
  }

  .resume-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .resume-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn-mini {
    display: inline-block;
    padding: 6px 10px;
    font-size: 13px;
    border-radius: 8px;
    text-decoration: none;
    color: #e9f5ff;
    border: 1px solid rgba(128,200,230,0.25);
    background: linear-gradient(180deg, rgba(120,200,220,0.25), rgba(0,0,0,0.2));
    box-shadow: 0 6px 14px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .btn-mini:hover { color: #fff; }

  .resume-frame-wrap {
    position: relative;
    height: 100%;
    overflow: hidden; /* hide double scrollbars around the frame */
    border-radius: 12px;
  }

  .resume-frame {
    width: 100%;
    height: 100%;
    border: none;
    background: #0e1b24;
    /* The PDF itself scrolls inside the iframe */
  }

  .resume-frame.blurred {
    filter: blur(8px) grayscale(0.12) brightness(0.88);
    pointer-events: none; /* prevent interaction until unlocked */
    transform: scale(1.02);
  }

  .resume-lock-overlay {
    position: absolute;
    inset: 0;
    display:flex;
    align-items:center;
    justify-content:center;
    background: linear-gradient(180deg, rgba(4,8,12,0.35), rgba(4,8,12,0.6));
    backdrop-filter: blur(2px);
    z-index: 6;
    border-radius: 12px;
  }

  .resume-lock-overlay .lock-inner {
    background: linear-gradient(180deg, rgba(12,22,28,0.98), rgba(10,16,20,0.95));
    padding: 18px;
    border-radius: 10px;
    color: #e7f6ff;
    text-align:center;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
    border: 1px solid rgba(150,200,230,0.06);
    min-width: 240px;
  }

  /* Simple modal prompt styles (re-used) */
  .pw-modal {
    position: fixed;
    inset: 0;
    display:flex;
    align-items:center;
    justify-content:center;
    z-index: 40;
    background: rgba(2,6,10,0.45);
  }

  .pw-box {
    background: linear-gradient(180deg, rgba(8,14,18,0.98), rgba(6,10,12,0.98));
    padding: 18px;
    border-radius: 12px;
    width: 360px;
    color: #dff4ff;
    border: 1px solid rgba(140,200,230,0.06);
  }

  .pw-input { width:100%; padding:8px 10px; margin-top:8px; margin-bottom:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); color: #e6fbff }

  .pw-actions { display:flex; gap:8px; justify-content:flex-end; }

  .resume-fallback {
    display: none; /* shown only if iframe fails (kept for accessibility) */
    position: absolute;
    inset: 0;
    padding: 16px;
    color: #dbe7ef;
  }

  .bullet {
    margin: 0;
    padding-left: 18px;
    color: #cfe0ec;
    line-height: 1.45;
  }

  @media (max-width: 900px) {
    .resume-card { height: calc(100vh - 180px); }
  }
  /* 4D-style calendar + clock */
  .fourd-wrap {
    perspective: 1200px;
    display: flex;
    justify-content: center;
    margin-top: 18px;
  }

  .fourd-scene {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 16px;
    transform-style: preserve-3d;
    align-items: start;
  }

  .calendar-card, .clock-card {
    background: linear-gradient(135deg, rgba(10,20,30,0.9), rgba(20,36,46,0.85));
    border-radius: 14px;
    padding: 14px;
    color: #d9eef9;
    box-shadow: 0 20px 40px rgba(2,8,12,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
    transform: rotateX(12deg) translateZ(0);
    border: 1px solid rgba(140,200,230,0.08);
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    margin-top: 12px;
  }

  .cal-day {
    padding: 8px 6px;
    text-align: center;
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06));
    font-size: 13px;
    color: #cfe8f6;
  }

  .cal-day.header { font-weight: 700; opacity: 0.8; font-size: 12px; color: #9fd4ee; }
  .cal-day.today {
    background: linear-gradient(180deg, rgba(90,200,255,0.18), rgba(40,120,160,0.18));
    color: #002633;
    box-shadow: 0 6px 18px rgba(20,120,160,0.25), inset 0 1px 0 rgba(255,255,255,0.06);
    font-weight: 700;
  }

  .calendar-nav {
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:8px;
  }

  .nav-btn {
    background: rgba(255,255,255,0.03);
    color: #cfe8f6;
    border: 1px solid rgba(255,255,255,0.03);
    padding:6px 8px;
    border-radius:8px;
    cursor:pointer;
  }

  .clock-card { width: 220px; text-align: center; }
  .clock-time { font-size: 28px; font-weight: 700; letter-spacing: 1px; }
  .clock-date { font-size: 12px; margin-top: 6px; color: #bfe0f6; }

  @media (max-width: 820px) {
    .fourd-scene { grid-template-columns: 1fr; }
    .clock-card { width: 100%; }
  }
`;

// Small, self-contained calendar and clock components so this page remains portable
function Calendar() {
  const [now, setNow] = useState(new Date());
  const [offset, setOffset] = useState(0); // month offset from current

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 60); // update every minute
    return () => clearInterval(t);
  }, []);

  const display = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = display.getFullYear();
  const month = display.getMonth();

  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="calendar-card" role="region" aria-label="Calendar">
      <div className="calendar-nav">
        <button className="nav-btn" onClick={() => setOffset(o => o - 1)} aria-label="Previous month">◀</button>
        <div style={{fontWeight:700}}>{display.toLocaleString(undefined, { month: 'long' })} {year}</div>
        <button className="nav-btn" onClick={() => setOffset(o => o + 1)} aria-label="Next month">▶</button>
      </div>

      <div className="calendar-grid" style={{marginTop:10}}>
        {weekdays.map(w => <div key={w} className="cal-day header">{w}</div>)}
        {cells.map((d, i) => {
          const classes = ['cal-day'];
          if (isSameDay(d, new Date())) classes.push('today');
          return <div key={i} className={classes.join(' ')}>{d ? d.getDate() : ''}</div>
        })}
      </div>
    </div>
  );
}

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = t.toLocaleDateString();

  return (
    <div className="clock-card" role="timer" aria-live="polite">
      <div style={{display:'flex',justifyContent:'center'}}>
        <div className="clock-time">{timeStr}</div>
      </div>
      <div className="clock-date">{dateStr}</div>
    </div>
  );
}

// Quiz4D component: a stylish, 3D/4D-looking puzzle that reveals the password
// Quiz removed: showing Calendar and Clock in 4D-style square instead

