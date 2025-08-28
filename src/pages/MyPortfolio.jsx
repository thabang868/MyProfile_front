// src/pages/MyPortfolio.jsx
import React from "react";

export default function MyPortfolio() {
  return (
    <div className="ba-grid cols-2">
      <section className="ba-card">
        <h3 className="ba-title">My Portfolio</h3>
        <p style={{ margin: 0, color: "#cfe0ec" }}>
          Showcase your projects, case studies, and achievements here.
        </p>
      </section>

      <section className="ba-card">
        <h3 className="ba-title">Highlights</h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#cfe0ec" }}>
          <li>Project A — AI Chatbot</li>
          <li>Project B — Azure Data Pipeline</li>
          <li>Project C — Analytics Dashboard</li>
        </ul>
      </section>
    </div>
  );
}
