// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Decor from "./_Decor";
import profile from "../assets/profile.png";

export default function Welcome() {
  const nav = useNavigate();

  return (
    <Decor>
      <div className="screen-wrap">
        <div className="two-col">
          {/* LEFT SIDE */}
          <section style={{ padding: "var(--pad)" }}>
            <h1
              className="title"
              style={{
                fontSize: "clamp(36px, 5.2vw, 60px)",
                marginBottom: 18,
                textAlign: "center",
                width: "100%",
              }}
            >
              Welcome
            </h1>

            <div
              style={{
                fontSize: "clamp(18px, 2.4vw, 26px)",
                lineHeight: 1.25,
                color: "var(--textOnDark)",
                marginBottom: 18,
                fontWeight: 600,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Extra colourful line as requested (centered paragraph-style block) */}
              <div
                className="color-mix-line"
                style={{ fontSize: "clamp(16px, 2vw, 22px)", marginBottom: 12 }}
              >
                Welcome to Thabang Maleka’s Portfolio
              </div>
              <div
                className="color-mix-line"
                style={{ fontSize: "clamp(16px, 2vw, 22px)", marginBottom: 12 }}
              >
                Showcasing Passion, Innovation
              </div>
              <div
                className="color-mix-line"
                style={{ fontSize: "clamp(16px, 2vw, 22px)", marginBottom: 0 }}
              >
                and Today's Technology
              </div>
            </div>

            <div className="cta-row">
              <button
                className="btn-4d btn-primary"
                onClick={() => nav("/signup")}
                aria-label="Try for Free"
              >
                Try for Free
              </button>
              <button
                className="btn-4d btn-light"
                onClick={() => nav("/login")}
                aria-label="Login"
              >
                Login
              </button>
            </div>
          </section>

          {/* RIGHT SIDE: profile picture (only image, no card/background) */}
          <section
            style={{
              display: "grid",
              placeItems: "center",
              padding: "var(--pad)",
            }}
          >
            <img
              src={profile}
              alt="Profile"
              style={{
                width: "min(280px, 70vw)",
                height: "auto",
                borderRadius: 18,
              }}
            />
          </section>
        </div>
      </div>
    </Decor>
  );
}
