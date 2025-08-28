// src/pages/_DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Decor from "./_Decor";
import Sidebar from "./_Sidebar";

export default function DashboardLayout() {
  return (
    <Decor>
      <div className="ba-shell">
        <Sidebar />
        <main className="ba-main">
          <Outlet />
        </main>
      </div>

      <style>{shellCss}</style>
    </Decor>
  );
}

const shellCss = `
  .ba-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: auto 1fr;
  }
  .ba-main {
    min-height: 100vh;
    padding: clamp(14px, 2vw, 22px);
  }

  /* Card style reminiscent of the reference (glass + dark teal) */
  .ba-card {
    background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.35));
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px;
    padding: 16px;
    color: #e9f1f5;
    box-shadow: 0 14px 36px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .ba-grid {
    display: grid;
    gap: 16px;
  }
  @media (min-width: 900px) {
    .ba-grid.cols-2 { grid-template-columns: 1fr 1fr; }
    .ba-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
  }

  .ba-title {
    margin: 0 0 10px 0;
    font-size: clamp(18px, 2.2vw, 22px);
    color: #dfeaf3;
    letter-spacing: .2px;
  }
`;
