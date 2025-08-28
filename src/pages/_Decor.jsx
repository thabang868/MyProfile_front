// src/pages/_Decor.jsx
import React from "react";

/**
 * Decor: full-screen gradient background with animated balloons.
 * - Corners dominated by #041520
 * - Gradient mix: #041520, #70B0DC, #EAE8CF
 * - Reusable wrapper: places children above background safely
 */
export default function Decor({ children }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background gradient with darker corners */}
      <div style={styles.gradientBase} aria-hidden="true" />

      {/* Animated balloons */}
      <Balloons />

      {/* Foreground content container */}
      <div style={styles.content}>{children}</div>

      {/* Inline styles & keyframes */}
      <style>{css}</style>
    </div>
  );
}

function Balloons() {
  // Create multiple balloons with randomized delays/speeds using CSS vars
  const balloons = Array.from({ length: 18 }).map((_, i) => {
    const size = 40 + ((i * 13) % 35); // 40-75
    const left = (i * 11.73) % 100; // pseudo-random spread
    const delay = (i * 0.7) % 6; // 0-6s
    const duration = 8 + ((i * 1.3) % 10); // 8-18s
    const hue = (200 + i * 9) % 360;

    return (
      <div
        key={i}
        className="balloon"
        style={{
          "--bSize": `${size}px`,
          "--bLeft": `${left}%`,
          "--bDelay": `${delay}s`,
          "--bDur": `${duration}s`,
          "--bHue": `${hue}`,
        }}
      />
    );
  });

  return <div aria-hidden="true">{balloons}</div>;
}

const styles = {
  gradientBase: {
    position: "fixed",
    inset: 0,
    // Layered gradients:
    background: `
      radial-gradient(18vw 18vw at 0% 0%, #0d344dff 55%, transparent 56%),
      radial-gradient(22vw 22vw at 100% 0%, #264961ff 55%, transparent 56%),
      radial-gradient(20vw 20vw at 0% 100%, #2b4e65ff 55%, transparent 56%),
      radial-gradient(24vw 24vw at 100% 100%, #82a1b6ff 55%, transparent 56%),
      radial-gradient(60vw 60vw at 50% 50%, rgba(112,176,220,0.35), transparent 60%),
      linear-gradient(135deg, #041520 10%, #70B0DC 55%, #EAE8CF 100%)
    `,
  },
  content: {
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
};

const css = `
  /* Basic responsive helpers */
  :root {
    --pad: clamp(16px, 3vw, 32px);
    --cardW: min(520px, 92vw);
    --radius: 20px;
    --shadow4D: 0 8px 18px rgba(0,0,0,0.22),
                inset 0 2px 0 rgba(255,255,255,0.12),
                0 2px 6px rgba(0,0,0,0.25),
                0 18px 40px rgba(0,0,0,0.18);
    --inputBg: rgba(255,255,255,0.08);
    --border: 1px solid rgba(255,255,255,0.12);
    --textOnDark: #f7f7f5;
    --muted: #dfe7ee;
    --primary: #70B0DC;
    --accent: #EAE8CF;
    --dark: #041520;
  }

  .screen-wrap {
    width: 100%;
    display: grid;
    place-items: center;
    padding: var(--pad);
  }

  .two-col {
    width: min(1200px, 96vw);
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: clamp(16px, 3vw, 32px);
    align-items: center;
  }
  @media (max-width: 900px) {
    .two-col {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  .card-4d {
    width: var(--cardW);
    background: rgba(255,255,255,0.06);
    border: var(--border);
    backdrop-filter: blur(8px);
    border-radius: var(--radius);
    box-shadow: var(--shadow4D);
    padding: clamp(18px, 3.2vw, 28px);
    color: var(--textOnDark);
  }

  .cta-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-4d {
    appearance: none;
    border: none;
    border-radius: 16px;
    padding: 12px 18px;
    font-weight: 600;
    letter-spacing: 0.2px;
    background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.25));
    color: var(--textOnDark);
    box-shadow: var(--shadow4D);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
    border: 1px solid rgba(75, 38, 38, 0.12);
  }
  .btn-4d:hover {
    transform: translateY(-1px);
  }
  .btn-4d:active {
    transform: translateY(0px) scale(0.98);
  }

  .btn-primary {
    background: linear-gradient(180deg, rgba(112,176,220,0.9), rgba(4,21,32,0.7));
  }
  .btn-light {
    background: linear-gradient(180deg, rgba(234,232,207,0.85), rgba(4,21,32,0.4));
    color: #0b1b26;
  }

  .input-4d {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--inputBg);
    border: var(--border);
    box-shadow: var(--shadow4D);
    border-radius: 14px;
    padding: 12px 14px;
    color: var(--textOnDark);
  }
  .input-4d input {
    flex: 1;
    background: transparent;
    outline: none;
    border: none;
    color: var(--textOnDark);
    font-size: 16px;
  }
  .input-4d .ico {
    width: 22px;
    height: 22px;
    opacity: 0.9;
  }
  .stack-16 { display: grid; gap: 16px; }
  .stack-20 { display: grid; gap: 20px; }

  /* Balloons */
  .balloon {
    position: fixed;
    bottom: -80px;
    width: var(--bSize);
    height: calc(var(--bSize) * 1.25);
    left: var(--bLeft);
    border-radius: 50% 50% 45% 55% / 55% 55% 45% 45%;
    background: radial-gradient(
      circle at 35% 25%,
      rgba(255,255,255,0.7),
      hsla(var(--bHue), 60%, 65%, 0.95) 25%,
      hsla(var(--bHue), 65%, 55%, 0.95) 55%,
      hsla(var(--bHue), 70%, 45%, 0.95)
    );
    box-shadow: 0 8px 22px rgba(0,0,0,0.25), inset 0 3px 10px rgba(255,255,255,0.35);
    animation: floatUp var(--bDur) ease-in infinite;
    animation-delay: var(--bDelay);
    z-index: 1;
    opacity: 0.85;
  }
  .balloon::after {
    content: "";
    position: absolute;
    bottom: -14px;
    left: 45%;
    width: 2px;
    height: 22px;
    background: rgba(255,255,255,0.6);
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.7));
  }

  @keyframes floatUp {
    0% { transform: translateY(0) translateX(0); opacity: 0.0; }
    8% { opacity: 0.85; }
    50% { transform: translateY(-45vh) translateX(3vw); }
    100% { transform: translateY(-100vh) translateX(-2vw); opacity: 0.0; }
  }

  .title {
    color: var(--textOnDark);
    margin: 0;
    line-height: 1.1;
    letter-spacing: 0.4px;
  }
  .subtitle {
    color: var(--muted);
    margin: 0;
  }

  /* Special multi-colored text with shadows (Welcome page line) */
  .color-mix-line {
    font-weight: 700;
    line-height: 1.15;
    background: linear-gradient(90deg, #2671ff, #87CEEB, #ff3b3b);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow:
      0 1px 0 rgba(0,0,0,0.25),
      0 2px 6px rgba(38,113,255,0.25),
      0 3px 10px rgba(255,59,59,0.25);
  }
`;
