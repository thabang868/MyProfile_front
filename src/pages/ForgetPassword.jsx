// src/pages/ForgetPassword.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Decor from "./_Decor";
import { auth } from "../lib/firebase";
import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Toggle this if you want users to come back to /forget after clicking the email link.
// OFF = simplest, uses Firebase-hosted page to set a new password.
// ON  = your app handles the link (mode=oobCode), shows your "Set New Password" form.
const USE_CONTINUE_URL = false;

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

export default function ForgetPassword() {
  const nav = useNavigate();
  const q = useQuery();

  // If user came back via email link, these will be present:
  const mode = q.get("mode");           // expect "resetPassword"
  const oobCode = q.get("oobCode");     // the verification code from email

  const isResetMode = mode === "resetPassword" && !!oobCode;

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [knownEmail, setKnownEmail] = useState(""); // from verifyPasswordResetCode
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let active = true;
    // If we're in reset mode, verify the code and fetch the account email
    const verify = async () => {
      if (!isResetMode) return;
      try {
        setLoading(true);
        const emailFromCode = await verifyPasswordResetCode(auth, oobCode);
        if (active) setKnownEmail(emailFromCode);
      } catch (err) {
        console.error(err);
        setError("This reset link is invalid or expired. Please request a new one.");
      } finally {
        setLoading(false);
      }
    };
    verify();
    return () => { active = false; };
  }, [isResetMode, oobCode]);

  // Send reset email (stage 1)
  const startReset = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);

    const addr = email.trim();
    if (!addr) return setError("Please enter your email address.");

    try {
      setLoading(true);

      if (!USE_CONTINUE_URL) {
        // Minimal call — most reliable. Uses Firebase's hosted reset page.
        await sendPasswordResetEmail(auth, addr);
      } else {
        // App-handled flow — ensure your domain is under Authorized Domains.
        const actionCodeSettings = {
          url: `${window.location.origin}/forget`,
          handleCodeInApp: true,
        };
        await sendPasswordResetEmail(auth, addr, actionCodeSettings);
      }

      setSent(true);
    } catch (err) {
      console.error(err);
      const code = err?.code || "";
      const map = {
        "auth/invalid-email": "That email address is not valid.",
        "auth/user-not-found": "No account found for that email.",
        "auth/too-many-requests": "Too many attempts. Try again in a few minutes.",
        "auth/network-request-failed": "Network error. Check your internet and try again.",
        "auth/invalid-continue-uri": "The continue URL is invalid.",
        "auth/unauthorized-continue-uri":
          "This domain is not authorized. Add it in Authentication → Settings → Authorized domains.",
      };
      setError(map[code] || err?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  // Complete reset with new password (stage 2 — only used in app-handled flow)
  const completeReset = async (e) => {
    e.preventDefault();
    setError("");

    if (pwd.length < 8 || confirm.length < 8) {
      return setError("Passwords must be at least 8 characters.");
    }
    if (pwd !== confirm) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, pwd);
      alert("Password has been reset! Please log in.");
      nav("/login");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Decor>
      <div
        className="screen-wrap"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}
      >
        <div className="card-4d stack-20" style={{ width: "var(--cardW)" }}>
          <h2 className="title" style={{ fontSize: "clamp(24px, 3vw, 30px)" }}>
            {isResetMode ? "Set a new password" : "Forgot your password?"}
          </h2>

          {!isResetMode && (
            <form className="stack-20" onSubmit={startReset}>
              <p className="subtitle">
                Enter your account email and we’ll send you a reset link.
              </p>

              <Input
                icon={<MailIcon />}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && <div style={{ color: "#ffb3b3" }}>{error}</div>}
              {sent && !error && (
                <div style={{ color: "#b3ffd0" }}>
                  Reset email sent! Check your inbox (and spam).
                </div>
              )}

              <button className="btn-4d btn-primary" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </button>

              <button
                className="btn-4d btn-light"
                type="button"
                onClick={() => nav("/login")}
              >
                Back to Login
              </button>
            </form>
          )}

          {isResetMode && (
            <form className="stack-20" onSubmit={completeReset}>
              <p className="subtitle">
                {knownEmail ? (
                  <>Resetting password for <strong>{knownEmail}</strong></>
                ) : (
                  "Validating link…"
                )}
              </p>

              <Input
                icon={<LockIcon />}
                type="password"
                placeholder="New Password (min 8 chars)"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                minLength={8}
              />
              <Input
                icon={<LockIcon />}
                type="password"
                placeholder="Confirm Password (min 8 chars)"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
              />

              {error && <div style={{ color: "#ffb3b3" }}>{error}</div>}

              <div className="cta-row">
                <button className="btn-4d btn-primary" type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Confirm"}
                </button>
                <button
                  className="btn-4d btn-light"
                  type="button"
                  onClick={() => nav("/login")}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
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
