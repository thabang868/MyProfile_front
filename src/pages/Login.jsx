// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Decor from "./_Decor";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Input({ icon, type = "text", placeholder, value, onChange, ...rest }) {
  return (
    <label className="input-4d">
      <span className="ico" aria-hidden="true">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
        required
      />
    </label>
  );
}

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (pwd.length < 8) return alert("Password must be at least 8 characters.");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), pwd);
      nav("/home");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Decor>
      <div
        className="screen-wrap"
        style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
      >
        <form className="card-4d stack-20" onSubmit={onSubmit} style={{ width: "var(--cardW)" }}>
          <h2 className="title" style={{ fontSize: "clamp(26px, 3vw, 34px)" }}>User Login</h2>

          <div className="stack-16">
            <Input
              icon={<MailIcon />}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={<LockIcon />}
              type="password"
              placeholder="Password (min 8 chars)"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              minLength={8}
            />
          </div>

          <div className="stack-16">
            <button className="btn-4d btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            <button
              type="button"
              className="btn-4d btn-light"
              onClick={() => nav("/forget")}
            >
              Forgot Password?
            </button>

            <button
              type="button"
              className="btn-4d btn-secondary"
              onClick={() => nav("/signup")}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </Decor>
  );
}

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="ico">
    <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="ico">
    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
