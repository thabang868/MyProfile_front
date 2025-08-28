// src/pages/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Decor from "./_Decor";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

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

export default function SignUp() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // (not stored by default; you can store in Firestore later)
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (pwd.length < 8 || confirm.length < 8) return alert("Passwords must be at least 8 characters.");
    if (pwd !== confirm) return alert("Passwords do not match.");
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), pwd);
      alert("Account created! Please login.");
      nav("/login");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Decor>
      <div className="screen-wrap">
        <form className="card-4d stack-20" onSubmit={onSubmit} style={{ width: "var(--cardW)" }}>
          <h2 className="title" style={{ fontSize: "clamp(26px, 3vw, 34px)" }}>Create Account</h2>

          <div className="stack-16">
            <Input icon={<MailIcon />} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input icon={<PhoneIcon />} type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input icon={<LockIcon />} type="password" placeholder="Password (min 8 chars)" value={pwd} onChange={(e) => setPwd(e.target.value)} minLength={8} />
            <Input icon={<LockIcon />} type="password" placeholder="Confirm Password (min 8 chars)" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} />
          </div>

          <button className="btn-4d btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
          <button type="button" className="btn-4d btn-light" onClick={() => nav("/login")}>
            Back to Login
          </button>
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
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="ico">
    <path d="M6 2h12v20H6z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="ico">
    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
