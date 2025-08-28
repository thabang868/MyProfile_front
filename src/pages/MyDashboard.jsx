// src/pages/MyDashboard.jsx
import React from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MyDashboard() {
  // ===== Skills (from resume) =====
  const skillsData = [
    { name: "FastAPI", level: 80 },
    { name: "Python", level: 90 },
    { name: "React", level: 85 },
    { name: "Azure", level: 70 },
    { name: "SQL Server", level: 75 },
    { name: "Machine Learning", level: 65 },
    { name: "Power BI", level: 60 },
  ];

  // ===== Improvement over time =====
  const improvementData = [
    { year: "2019", score: 40 },
    { year: "2020", score: 50 },
    { year: "2021", score: 60 },
    { year: "2022", score: 70 },
    { year: "2023", score: 75 },
    { year: "2024", score: 85 },
    { year: "2025", score: 95 },
  ];

  // ===== Visits pie chart =====
  const visitsData = [
    { name: "Gauteng", value: 60 },
    { name: "Jane Furse", value: 10 },
    { name: "Midrand", value: 20 },
    { name: "KwaMhlanga", value: 5 },
    { name: "Atlain Mall", value: 5 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9932CC"];

  return (
    <div className="ba-grid cols-2" style={{ gap: "15px" }}>
      {/* ========== Weather Map ========== */}
      <section className="ba-card" style={{ padding: "10px" }}>
        <h3 className="ba-title" style={{ fontSize: "16px", marginBottom: "8px" }}>
          Weather Map
        </h3>
        <MapContainer
          center={[-26.2, 28.0]}
          zoom={6}
          style={{ height: "220px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[-25.7479, 28.2293]}>
            <Popup>Pretoria - 28°C</Popup>
          </Marker>
          <Marker position={[-26.2041, 28.0473]}>
            <Popup>Johannesburg - 25°C</Popup>
          </Marker>
        </MapContainer>
      </section>

      {/* ========== Skills Bar Chart ========== */}
      <section className="ba-card" style={{ padding: "10px" }}>
        <h3 className="ba-title" style={{ fontSize: "16px", marginBottom: "8px" }}>
          Skills
        </h3>
        <BarChart width={300} height={200} data={skillsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={10} />
          <YAxis fontSize={10} />
          <ReTooltip />
          <Bar dataKey="level" fill="#8884d8" />
        </BarChart>
      </section>

      {/* ========== Improvement Over Time (Line) ========== */}
      <section className="ba-card" style={{ padding: "10px" }}>
        <h3 className="ba-title" style={{ fontSize: "16px", marginBottom: "8px" }}>
          Improvement Over Time
        </h3>
        <LineChart width={300} height={200} data={improvementData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" fontSize={10} />
          <YAxis fontSize={10} />
          <ReTooltip />
          <Line type="monotone" dataKey="score" stroke="#ff7300" />
        </LineChart>
      </section>

      {/* ========== Visits Pie (legend vertical on right) ========== */}
      <section
        className="ba-card"
        style={{ padding: "10px", display: "flex", flexDirection: "column" }}
      >
        <h3 className="ba-title" style={{ fontSize: "16px", marginBottom: "8px" }}>
          Visits
        </h3>

        {/* Keep the chart compact; legend sits vertically on the right */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PieChart width={360} height={220}>
            <Pie
              data={visitsData}
              cx="35%"          // push pie to the left to make space for the legend
              cy="50%"
              outerRadius={70}
              label
              dataKey="value"
            >
              {visitsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ReTooltip />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value, entry, index) => {
                const pct = visitsData[index]?.value ?? 0;
                return `${value} — ${pct}%`;
              }}
            />
          </PieChart>
        </div>
      </section>
    </div>
  );
}
