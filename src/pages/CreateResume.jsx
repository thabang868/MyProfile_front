// src/pages/CreateResume.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { create, all } from "mathjs";

/**
 * ==== ENV KEYS (client) ====
 * Uses either Vite (VITE_*) or CRA (REACT_APP_*) prefixes.
 * TIP: for security, proxy these calls via your backend in production.
 */
const ENV =
  (typeof import.meta !== "undefined" && import.meta.env) || // Vite
  (typeof process !== "undefined" && process.env) || {};

const WA_INSTANT =
  ENV.VITE_WOLFRAMALPHA_INSTANT_CALCULATOR_API_KEY ||
  ENV.REACT_APP_WOLFRAMALPHA_INSTANT_CALCULATOR_API_KEY ||
  ENV.WOLFRAMALPHA_INSTANT_CALCULATOR_API_KEY ||
  "";

const WA_LLM =
  ENV.VITE_WOLFRAMALPHA_LLM_API_KEY ||
  ENV.REACT_APP_WOLFRAMALPHA_LLM_API_KEY ||
  ENV.WOLFRAMALPHA_LLM_API_KEY ||
  "";

const GEMINI =
  ENV.VITE_GEMINI_API_KEY ||
  ENV.REACT_APP_GEMINI_API_KEY ||
  ENV.GEMINI_API_KEY ||
  "";

/** ==== mathjs instance with a tiny helper for degrees ==== */
const math = create(all, {});
// Convert degrees to radians for trig when in DEG mode
math.import(
  {
    deg: (x) => (typeof x === "number" ? (x * Math.PI) / 180 : math.multiply(x, Math.PI / 180)),
  },
  { override: true }
);

export default function CreateResume() {
  const [angleMode, setAngleMode] = useState("DEG"); // DEG | RAD
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Ready");
  const [history, setHistory] = useState([]); // [{ q, a }] — always keep ONLY latest entry
  const lastAns = useRef("");

  // keyboard input
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onEquals();
      } else if (e.key === "Backspace") {
        setExpr((s) => s.slice(0, -1));
      } else {
        const allowed =
          "0123456789.+-*/()^!%".includes(e.key) ||
          ["i"].includes(e.key); // allow basic typing; advanced via buttons
        if (allowed) setExpr((s) => s + e.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const buttons = useMemo(
    () => [
      // Row 1
      { t: "AC", kind: "op" },
      { t: "DEL", kind: "op" },
      { t: "(", v: "(" },
      { t: ")", v: ")" },
      { t: "x²", kind: "fn", fn: (s) => s + "^2" },
      { t: "√", kind: "fn", fn: (s) => s + "sqrt(" },
      { t: "x^y", v: "^" },

      // Row 2
      { t: "7" }, { t: "8" }, { t: "9" }, { t: "÷", v: "/" },
      { t: "sin", kind: "fn", fn: (s) => s + "sin(" },
      { t: "cos", kind: "fn", fn: (s) => s + "cos(" },
      { t: "tan", kind: "fn", fn: (s) => s + "tan(" },

      // Row 3
      { t: "4" }, { t: "5" }, { t: "6" }, { t: "×", v: "*" },
      { t: "ln", kind: "fn", fn: (s) => s + "ln(" },
      { t: "log", kind: "fn", fn: (s) => s + "log10(" }, // base-10
      { t: "!", v: "!" },

      // Row 4
      { t: "1" }, { t: "2" }, { t: "3" }, { t: "−", v: "-" },
      { t: "π", v: "pi" }, { t: "e", v: "e" }, { t: "i", v: "i" },

      // Row 5
      { t: "0", v: "0", span: 2 }, { t: ".", v: "." },
      { t: "+", v: "+" }, { t: "Ans", kind: "fn", fn: (s) => s + (lastAns.current || "0") },
      { t: "=", kind: "eq", span: 2 },
    ],
    []
  );

  const onPress = async (b) => {
    setStatus("Ready");
    if (b.t === "AC") {
      setExpr(""); setResult(""); return;
    }
    if (b.t === "DEL") {
      setExpr((s) => s.slice(0, -1)); return;
    }
    if (b.kind === "eq") {
      await onEquals();
      return;
    }
    if (b.kind === "fn" && b.fn) {
      setExpr((s) => b.fn(s)); return;
    }
    setExpr((s) => s + (b.v ?? b.t));
  };

  const closeParens = (s) => {
    let bal = 0;
    for (const ch of s) {
      if (ch === "(") bal++;
      else if (ch === ")") bal = Math.max(0, bal - 1);
    }
    return s + ")".repeat(bal);
  };

  const preprocess = (s) => {
    let t = s;

    // Replace visual operators
    t = t.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

    // If DEG mode, wrap trig inputs with deg()
    if (angleMode === "DEG") {
      t = t.replace(/\bsin\(/g, "sin(deg(");
      t = t.replace(/\bcos\(/g, "cos(deg(");
      t = t.replace(/\btan\(/g, "tan(deg(");
      t = t.replace(/\basin\(/g, "asin("); // inverses return radians; leave as-is
      t = t.replace(/\bacos\(/g, "acos(");
      t = t.replace(/\batan\(/g, "atan(");
    }

    // Replace Ans token if typed
    t = t.replace(/\bAns\b/g, lastAns.current || "0");

    // Balance parentheses
    t = closeParens(t);

    return t;
  };

  const localEvaluate = (raw) => {
    const prepared = preprocess(raw);
    // mathjs has: ln(x) == log(x), log10(x) added via button
    math.import({ ln: (x) => math.log(x) }, { override: true });

    const value = math.evaluate(prepared);
    // Nicely formatted string result
    return math.format(value, { precision: 14 });
  };

  /** ==== FALLBACK CHAIN ====
   * 1) Local mathjs
   * 2) Wolfram|Alpha Instant  (short answer)
   * 3) Gemini 1.5 Flash (concise numeric result)
   * 4) Wolfram|Alpha LLM  (best-effort final resort)
   */
  const onEquals = async () => {
    const q = expr.trim();
    if (!q) return;

    // Try LOCAL
    try {
      setStatus("Calculating (local) …");
      const out = localEvaluate(q);
      commitResult(q, out, "Done");
      return;
    } catch (e) {
      // continue
    }

    // Try W|A Instant
    if (WA_INSTANT) {
      try {
        setStatus("Calculating with Wolfram|Alpha Instant …");
        const res = await fetch(
          `https://api.wolframalpha.com/v1/result?i=${encodeURIComponent(q)}&appid=${WA_INSTANT}`
        );
        const text = await res.text();
        if (res.ok && text && !/^Wolfram\|Alpha/.test(text) && !/no short answer/i.test(text)) {
          commitResult(q, text, "Done (W|A Instant)");
          return;
        }
      } catch {}
    }

    // Try GEMINI
    if (GEMINI) {
      try {
        setStatus("Calculating with Gemini …");
        const endpoint =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
          GEMINI;
        const body = {
          contents: [
            {
              parts: [
                {
                  text:
                    "Return ONLY the final numeric/symbolic result (no steps, no text). " +
                    "If units are involved, simplify. Problem: " +
                    q,
                },
              ],
            },
          ],
        };
        const r = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const j = await r.json();
        const text =
          j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          j?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "";
        if (text) {
          commitResult(q, text, "Done (Gemini)");
          return;
        }
      } catch {}
    }

    // Try W|A LLM (best effort)
    if (WA_LLM) {
      try {
        setStatus("Calculating with Wolfram|Alpha LLM …");
        // NOTE: This endpoint may change; treat as best-effort last resort.
        const url =
          "https://api.wolframalpha.com/v1/llm-api?input=" +
          encodeURIComponent(q) +
          "&appid=" +
          WA_LLM;
        const r = await fetch(url);
        const t = await r.text();
        if (t) {
          commitResult(q, t, "Done (W|A LLM)");
          return;
        }
      } catch {}
    }

    setResult("Error: unable to compute.");
    setStatus("Failed");
  };

  // ALWAYS keep only the latest calculation in history.
  const commitResult = (q, answer, statusText) => {
    setResult(answer);
    lastAns.current = answer;
    setHistory([{ q, a: answer }]); // replace history with the current item only
    setStatus(statusText);
  };

  return (
    <div className="ba-card" style={{ padding: 16 }}>
      <h3 className="ba-title">Scientific Calculator</h3>

      {/* Top bar with mode toggle */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#9bb5c9", fontSize: 12 }}>Mode:</span>
        <button
          onClick={() => setAngleMode((m) => (m === "DEG" ? "RAD" : "DEG"))}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #29455c",
            background: "#0d2233",
            color: "#eaf4ff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {angleMode}
        </button>
        <span style={{ marginLeft: "auto", color: "#9bb5c9", fontSize: 12 }}>{status}</span>
      </div>

      {/* Display */}
      <div
        style={{
          background: "#0b1b28",
          color: "#cfe0ec",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}
      >
        <div style={{ fontSize: 18, minHeight: 24, wordWrap: "anywhere" }}>
          {expr || " "}
        </div>
        <div
          style={{
            marginTop: 6,
            paddingTop: 6,
            borderTop: "1px solid #203444",
            fontSize: 20,
            wordWrap: "anywhere",
          }}
        >
          {result}
        </div>
      </div>

      {/* Keypad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
        }}
      >
        {buttons.map((b, idx) => (
          <button
            key={idx}
            onClick={() => onPress(b)}
            style={{
              gridColumn: b.span ? `span ${b.span}` : "span 1",
              padding: "12px 10px",
              borderRadius: 10,
              border: "1px solid #29455c",
              background: b.kind === "eq" ? "#2b6cb0" : "#0d2233",
              color: "#eaf4ff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
            className="btn"
          >
            {b.t}
          </button>
        ))}
      </div>

      {/* Manual input + Solve */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="Type an expression, e.g. (1/4-3/4*i)^4 or sin(45)"
          style={{
            flex: 1,
            background: "#081723",
            border: "1px solid #29455c",
            color: "#cfe0ec",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 14,
          }}
        />
        <button
          onClick={onEquals}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #2b6cb0",
            background: "#2b6cb0",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Solve
        </button>
      </div>

      {/* History (only latest item is shown) */}
      <div style={{ marginTop: 14 }}>
        <div style={{ color: "#9bb5c9", fontSize: 12, marginBottom: 6 }}>History (latest)</div>
        <div
          style={{
            maxHeight: 150,
            overflow: "auto",
            background: "#081723",
            border: "1px solid #29455c",
            borderRadius: 10,
            padding: 10,
          }}
        >
          {history.length === 0 ? (
            <div style={{ color: "#7c97aa", fontSize: 12 }}>No calculations yet.</div>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  alignItems: "baseline",
                  marginBottom: 6,
                  color: "#cfe0ec",
                }}
              >
                <div style={{ opacity: 0.8 }}>{h.q}</div>
                <div style={{ fontWeight: 700 }}>{h.a}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <p style={{ marginTop: 10, color: "#88a7bd", fontSize: 12 }}>
        Supports complex numbers (<code>i</code>), factorial <code>!</code>, powers <code>^</code>,
        roots <code>sqrt(</code>, trigonometry (<code>{angleMode}</code>), <code>ln</code>,
        <code>log10</code>, constants <code>pi</code> and <code>e</code>, and previous answer via
        <code>Ans</code> button. Press <kbd>Enter</kbd> to solve.
      </p>
    </div>
  );
}
