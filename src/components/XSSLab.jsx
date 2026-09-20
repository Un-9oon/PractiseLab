import React, { useState } from 'react';
import { Code, ShieldAlert, ShieldCheck, Play, Award, MessageSquare, AlertTriangle, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function XSSLab({ isPatched, unlockFlag }) {
  const [payload, setPayload] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'SecurityAuditor', text: 'Clean comment without XSS.', safe: true },
    { id: 2, user: 'BugBountyHunter', text: 'Welcome to the XSS sanitization range!', safe: true }
  ]);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [alertText, setAlertText] = useState('');

  const injectPayload = (p) => {
    setPayload(p);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!payload) return;

    const containsScript = payload.includes('<script>') || 
                           payload.includes('onerror=') || 
                           payload.includes('onload=') || 
                           payload.includes('javascript:');

    if (!isPatched && containsScript) {
      // Trigger XSS Exploit
      unlockFlag('xss', 'CTF{xss_stored_reflected}');
      confetti({ particleCount: 50, spread: 60 });
      setAlertText(`[XSS EXECUTION]: ${payload}`);
      setAlertTriggered(true);

      const newComment = {
        id: Date.now(),
        user: 'Hacker',
        text: payload,
        vulnerable: true
      };
      setComments([newComment, ...comments]);
    } else {
      // Sanitized Mode / Normal text
      const sanitizedText = isPatched 
        ? payload.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        : payload;

      const newComment = {
        id: Date.now(),
        user: 'User',
        text: sanitizedText,
        vulnerable: false
      };
      setComments([newComment, ...comments]);
    }

    setPayload('');
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--cyber-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            OWASP A03:2021 • XSS PLAYGROUND
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code size={28} color="var(--cyber-amber)" /> Cross-Site Scripting (XSS) Sandbox
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Test Reflected and Stored XSS vectors and observe how HTML entity encoding & DOMPurify sanitize DOM input.
          </p>
        </div>

        <div className="cyber-card" style={{ padding: '10px 16px', background: 'rgba(5, 8, 15, 0.7)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600 }}>CHALLENGE GOAL</div>
          <div className="font-mono" style={{ fontSize: '12px', color: 'var(--cyber-amber)', fontWeight: 700 }}>
            Execute JS payload via comment input
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left: Input Payload Injection Form */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--cyber-amber)" /> Post Comment / Inject XSS Payload
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '8px' }}>
              QUICK XSS PAYLOADS:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                "<script>alert('XSS_PWNED')</script>",
                "<img src=x onerror=alert('DOM_XSS')>",
                "<svg/onload=alert('SVG_XSS')>"
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => injectPayload(p)}
                  className="cyber-btn"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handlePostComment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Comment / HTML Payload Box:
              </label>
              <textarea
                rows="4"
                placeholder="Enter comment or <script>alert(1)</script>..."
                className="cyber-input"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`cyber-btn ${isPatched ? 'cyber-btn-cyan' : 'cyber-btn-red'}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              <Play size={16} /> Post Comment to DOM Feed
            </button>
          </form>

          {/* Defense Patch Indicator */}
          <div style={{
            marginTop: '24px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: isPatched ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: isPatched ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            fontSize: '12px',
            color: isPatched ? 'var(--cyber-green)' : 'var(--cyber-red)'
          }}>
            {isPatched ? (
              <div>
                <strong>SECURED CODE (DOMPurify Sanitization):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#fff' }}>
                  const cleanHTML = DOMPurify.sanitize(userComment);
                </pre>
              </div>
            ) : (
              <div>
                <strong>VULNERABLE CODE (Raw innerHTML Execution):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#f87171' }}>
                  commentBox.innerHTML = userComment; // Unsafe DOM Injection
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: DOM Render Feed */}
        <div className="cyber-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={20} color="var(--cyber-cyan)" /> Live Rendered DOM Feed
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'rgba(5, 8, 15, 0.8)',
                  border: c.vulnerable ? '1px solid var(--cyber-red)' : '1px solid var(--border-cyber)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: c.vulnerable ? 'var(--cyber-red)' : 'var(--cyber-green)', fontWeight: 700 }}>
                    @{c.user}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    {c.vulnerable ? 'VULNERABLE SCRIPT INJECTED' : 'SANITIZED DOM'}
                  </span>
                </div>
                <div className="font-mono" style={{ fontSize: '13px', color: '#fff', wordBreak: 'break-all' }}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Simulated XSS Alert Popup Modal */}
      {alertTriggered && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="cyber-card cyber-card-red animate-fadeIn" style={{ maxWidth: '440px', padding: '32px', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid var(--cyber-red)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: 'var(--cyber-red)'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              XSS EXPLOIT EXECUTED!
            </h2>
            <p className="font-mono" style={{ color: 'var(--cyber-red)', fontSize: '13px', marginBottom: '20px', background: '#08120b', padding: '10px', borderRadius: '6px' }}>
              {alertText}
            </p>

            <button
              onClick={() => setAlertTriggered(false)}
              className="cyber-btn cyber-btn-red"
              style={{ width: '100%', padding: '12px' }}
            >
              Dismiss & Continue Pentest
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
