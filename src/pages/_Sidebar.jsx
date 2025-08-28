// src/pages/_Sidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import profile2 from "../assets/Profile2.jpg"; // <-- place Profile2.png in src/assets/

export default function Sidebar() {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const popRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <aside className="ba-sidebar">
      <div className="ba-brand">Thabang<span>Admin</span></div>

      {/* NAV: moved slightly UP and compact button sizes */}
      <nav className="ba-nav">
        <SideLink to="/home" label="My Portfolio" icon={<SquaresIcon />} />
        <SideLink to="/agent" label="My Agent" icon={<RobotIcon />} />
        <SideLink to="/dashboard" label="My Dashboard" icon={<ChartIcon />} />
  <SideLink to="/resume" label=" Calculator" icon={<CalcIcon />} />
      </nav>

      {/* Profile button + popover */}
      <div className="ba-profile-wrap" ref={popRef}>
        <button
          className="ba-profile-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Profile menu"
          title="Profile"
        >
          <div
            className="ba-profile-img"
            style={{
              backgroundImage: profile2 ? `url(${profile2})` : "none",
            }}
          />
        </button>

        {/* Popover */}
        <div className={`ba-pop ${menuOpen ? "open" : ""}`} style={{ transformOrigin: "top center" }}>
          <button
            className="ba-pop-item"
            onClick={() => {
              setMenuOpen(false);
              nav("/login");
            }}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>

         
        </div>
      </div>

      <style>{sidebarCss}</style>
    </aside>
  );
}

function SideLink({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => "ba-link " + (isActive ? "active" : "")}
    >
      <span className="ico">{icon}</span>
      <span className="lbl">{label}</span>
    </NavLink>
  );
}

/* Icons */
const SquaresIcon = () => (
  <svg viewBox="0 0 24 24" className="svg" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" />
    <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" />
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" />
    <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" />
  </svg>
);
const RobotIcon = () => (
  <svg viewBox="0 0 24 24" className="svg" fill="none" aria-hidden="true">
    <rect x="4" y="7" width="16" height="10" rx="2" stroke="currentColor" />
    <circle cx="9" cy="12" r="1.5" fill="currentColor" />
    <circle cx="15" cy="12" r="1.5" fill="currentColor" />
    <path d="M12 7V4" stroke="currentColor" />
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 24 24" className="svg" fill="none" aria-hidden="true">
    <path d="M4 19h16" stroke="currentColor" />
    <rect x="6" y="11" width="3" height="6" fill="currentColor" rx="1" />
    <rect x="11" y="8" width="3" height="9" fill="currentColor" rx="1" />
    <rect x="16" y="5" width="3" height="12" fill="currentColor" rx="1" />
  </svg>
);
const DocIcon = () => (
  <svg viewBox="0 0 24 24" className="svg" fill="none" aria-hidden="true">
    <path d="M6 3h8l4 4v14H6z" stroke="currentColor" />
    <path d="M14 3v5h5" stroke="currentColor" />
  </svg>
);
const CalcIcon = () => (
  <svg viewBox="0 0 24 24" className="svg" fill="none" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" />
    <rect x="6" y="4" width="12" height="4" rx="1" fill="currentColor" />
    <rect x="6.5" y="10" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="10.5" y="10" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="14.5" y="10" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="6.5" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="10.5" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="14.5" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" className="svg" fill="none" aria-hidden="true">
    <path d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" stroke="currentColor" />
    <path d="M14 16l4-4-4-4M18 12H9" stroke="currentColor" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="svg" fill="none" aria-hidden="true">
    <path d="M6 2h12v20H6z" stroke="currentColor" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
);

/* --- Styles: nav moved up & compact buttons --- */
const sidebarCss = `
  .ba-sidebar {
    width: 268px;
    min-width: 268px;
    height: 100vh;
    position: sticky;
    top: 0;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 12px 12px; /* slightly less top padding to nudge content up */
    box-sizing: border-box;
    color: #eaf2f7;
    background:
      radial-gradient(1100px 700px at -20% -20%, rgba(255,255,255,0.06), transparent 40%),
      linear-gradient(180deg, #0f2230 0%, #1a3341 55%, #233f4a 100%);
    border-right: 1px solid rgba(255,255,255,0.08);
  }

  .ba-brand {
    font-weight: 800;
    letter-spacing: .3px;
    font-size: 16px;            /* slightly smaller brand */
    padding: 4px 8px 8px 8px;    /* reduced bottom padding so nav sits higher */
    color: #8fe3ff;
  }
  .ba-brand span { color: #cfe8ff; font-weight: 700; }

  /* NAV moved a touch up and made more compact */
  .ba-nav {
    display: grid;
    gap: 6px;
    margin-top: -6px;            /* nudge up a little */
  }

  /* Smaller buttons */
  .ba-link {
    display: grid;
    grid-template-columns: 20px 1fr; /* smaller icon column */
    align-items: center;
    gap: 10px;
    padding: 9px 12px;           /* reduced from 12px 14px */
    border-radius: 10px;         /* was 12px */
    color: #dbe7ef;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.05);
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.15));
    box-shadow: 0 6px 14px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06);
    transition: transform .12s ease, background .12s ease, color .12s ease;
  }
  .ba-link:hover { transform: translateY(-1px); color: #fff; }
  .ba-link.active {
    color: #fff;
    background: linear-gradient(180deg, rgba(80,180,210,0.30), rgba(0,0,0,0.23));
    border-color: rgba(128,200,230,0.25);
    box-shadow: 0 8px 18px rgba(0,0,0,0.22), inset 0 2px 0 rgba(255,255,255,0.08);
  }
  .ba-link .svg { width: 18px; height: 18px; } /* smaller icons */
  .ba-link .lbl { font-size: 14px; }           /* slightly smaller text */

  .ba-profile-wrap { position: relative; display: grid; place-items: center; padding-bottom: 8px; }
  .ba-profile-btn {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.25));
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 8px 22px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.14);
    cursor: pointer; position: relative; overflow: hidden;
  }
  .ba-profile-img {
    width: 100%; height: 100%;
    background-size: cover; background-position: center; border-radius: 50%;
    filter: saturate(1.05) contrast(1.05);
  }

  .ba-pop {
    position: absolute;
    bottom: 70px;
    left: 12px;
    right: 12px;
    background: rgba(19,37,48,0.98);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.35);
    transform: scaleY(0.6);
    opacity: 0;
    pointer-events: none;
    transition: transform .16s ease, opacity .16s ease;
    padding: 10px;
  }
  .ba-pop.open { transform: scaleY(1); opacity: 1; pointer-events: auto; }

  .ba-pop-item {
    width: 100%;
    display: grid; grid-template-columns: 20px 1fr; gap: 10px;
    align-items: center; padding: 9px 11px; border-radius: 10px;
    background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2));
    color: #e8f1f7; border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
  }
  .ba-pop-item:hover { background: linear-gradient(180deg, rgba(120,200,220,0.18), rgba(0,0,0,0.25)); }
  .ba-pop-item .svg { width: 16px; height: 16px; }



  @media (max-width: 980px) {
    .ba-sidebar { width: 92px; min-width: 92px; padding: 12px 10px; }
    .ba-brand { font-size: 13px; text-align: center; padding: 2px 6px 6px 6px; }
    .ba-nav { margin-top: -4px; }
    .ba-link { grid-template-columns: 1fr; justify-items: center; padding: 8px 10px; }
    .ba-link .lbl { display: none; }
  }
`;
