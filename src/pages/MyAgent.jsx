// src/pages/MyAgent.jsx
import React, { useEffect, useRef, useState } from "react";
import "./MyAgent.css";

const FAQ_ITEMS = [
  "What is the password to unlock the resume?",
  "what is thabang's background?",
  "which univeristy did thabang attend?",
  "which skills does thabang have?",
];

export default function MyAgent() {
  const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', text}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hideFaqs = messages.length > 0;

  async function askQuestion(q) {
    if (!q || loading) return;
    setError(null);
    const userMsg = { role: "user", text: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:8000/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, top_k: 5, model: "flash" }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const assistant = { role: "assistant", text: data.answer || "(no answer)" };
      setMessages((m) => [...m, assistant]);
    } catch (err) {
      setError(err.message || String(err));
      const assistant = { role: "assistant", text: "I couldn't fetch an answer. Showing extractive fallback if available." };
      setMessages((m) => [...m, assistant]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e && e.preventDefault();
    if (!input.trim()) return;
    askQuestion(input.trim());
  }

  function onFaqClick(item) {
    askQuestion(item);
  }

  function scrollBy(amount) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: amount, behavior: "smooth" });
    }
  }

  return (
    <div className="agent-page">
      <div className="agent-center">
        <div className="chatboard-wrapper">
          {/* animated background balls */}
          <div className="bg-balls" aria-hidden>
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="ball" />
            ))}
          </div>

          <div className="chatboard">
            <div className="chatboard-header">
              <h2>Welcome to Thabang’s Agent! 🌟 Feel free to ask anything you’d like to know about Thabang.</h2>
            </div>

            {/* FAQs area: 4x4 box grid. Hide when user sends a question */}
            {!hideFaqs && (
              <div className="faq-grid" role="list">
                {Array.from({ length: 16 }).map((_, i) => (
                  <button
                    key={i}
                    className={`faq-box ${i < FAQ_ITEMS.length ? "has-text" : "empty"}`}
                    onClick={() => i < FAQ_ITEMS.length && onFaqClick(FAQ_ITEMS[i])}
                    disabled={i >= FAQ_ITEMS.length}
                  >
                    {i < FAQ_ITEMS.length ? FAQ_ITEMS[i] : ""}
                  </button>
                ))}
              </div>
            )}

            {/* messages area */}
            <div className="messages-area" ref={scrollRef}>
              {messages.length === 0 && hideFaqs && (
                <div className="empty-state">No messages yet. Ask a question below.</div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`msg ${m.role === "user" ? "msg-user" : "msg-assistant"}`}>
                  <div className="msg-content">{m.text}</div>
                </div>
              ))}
            </div>

           

            {/* input area */}
            <form className="chat-input" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Ask a question about the resume..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Ask a question"
              />
              <button type="submit" className="ask-btn" disabled={loading}>
                {loading ? "Asking..." : "📤"}
              </button>
            </form>

            {error && <div className="error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
