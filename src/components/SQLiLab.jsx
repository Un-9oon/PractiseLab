import React, { useState } from 'react';
import { Database, ShieldAlert, ShieldCheck, Terminal, Award, Key, Play, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SQLiLab({ isPatched, unlockFlag }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample payloads
  const injectPayload = (payload) => {
    setUsername(payload);
    setPassword('any_password');
  };

  const handleTestSQLi = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setQueryResult(null);

    const rawQuery = isPatched
      ? `SELECT * FROM users WHERE username = $1 AND password = $2 [Params: "${username}", "${password}"]`
      : `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    if (!isPatched) {
      // Check for SQLi Bypass Payloads
      const isBypass = username.includes("' OR '1'='1") || 
                       username.includes("' OR 1=1") || 
                       username.includes("admin' --") || 
                       username.includes("' OR 'a'='a");

      if (isBypass) {
        unlockFlag('sqli', 'CTF{sqli_bypass_mastered}');
        confetti({ particleCount: 50, spread: 60 });

        setQueryResult({
          success: true,
          status: '200 OK (SQL INJECTION SUCCESSFUL)',
          query: rawQuery,
          user: { id: 1, username: 'admin_godmode', role: 'SUPER_ADMIN', email: 'admin@targetlab.internal', secret_token: 'SECRET_FLAG_SQLI_PWNED_2026' },
          dbDump: [
            { id: 1, user: 'admin', role: 'root', hash: '$2a$12$e9.QkP4A0' },
            { id: 2, user: 'ceo', role: 'executive', hash: '$2a$12$kL8.0pQqZ' },
            { id: 3, user: 'dev', role: 'engineer', hash: '$2a$12$pZ7.3bMm9' }
          ]
        });
      } else {
        setErrorMsg('SQL Syntax Error: User not found or invalid credentials.');
        setQueryResult({
          success: false,
          status: '401 Unauthorized',
          query: rawQuery
        });
      }
    } else {
      // Patched Mode (Prepared Statements)
      setErrorMsg('Defense Active: Prepared statements parameterized input safely. Payload neutralized.');
      setQueryResult({
        success: false,
        status: '401 Unauthorized (Input Safely Parameterized)',
        query: rawQuery
      });
    }
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
      
      {/* Lab Header */}
      <div className="cyber-card" style={{ padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--cyber-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            OWASP A03:2021 • INJECTION LAB
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={28} color="var(--cyber-cyan)" /> SQL Injection (SQLi) Sandbox
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Test SQL injection authentication bypass payloads and observe how prepared statements parameterize queries.
          </p>
        </div>

        <div className="cyber-card" style={{ padding: '10px 16px', background: 'rgba(5, 8, 15, 0.7)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600 }}>CHALLENGE GOAL</div>
          <div className="font-mono" style={{ fontSize: '12px', color: 'var(--cyber-green)', fontWeight: 700 }}>
            Bypass authentication using SQL Payload
          </div>
        </div>
      </div>

      {/* Main Pentest Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left: Interactive Target Form */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={20} color="var(--cyber-green)" /> Target Authentication Form
          </h3>

          {/* Preset Payload Injectors */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '8px' }}>
              QUICK PAYLOAD INJECTORS:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                "' OR '1'='1",
                "admin' --",
                "' OR 1=1 --",
                "' UNION SELECT 1, 'admin', 'token' --"
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

          <form onSubmit={handleTestSQLi} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Username / SQL Input:
              </label>
              <input
                type="text"
                placeholder="e.g. admin OR '1'='1"
                className="cyber-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Password:
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="cyber-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`cyber-btn ${isPatched ? 'cyber-btn-cyan' : 'cyber-btn-red'}`}
              style={{ padding: '12px', fontSize: '14px', marginTop: '8px' }}
            >
              <Play size={16} /> Execute Query against Target
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
                <strong>SECURED CODE (Parameterized Query):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#fff' }}>
                  db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [user, pass]);
                </pre>
              </div>
            ) : (
              <div>
                <strong>VULNERABLE CODE (String Concatenation):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#f87171' }}>
                  db.query("SELECT * FROM users WHERE username = '" + user + "' AND password = '" + pass + "'");
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Backend SQL Query Console & DB Dump Inspector */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} color="var(--cyber-green)" />
              <span className="font-mono" style={{ fontSize: '12px', color: '#fff' }}>BACKEND_SQL_INSPECTOR.log</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>PORT 5432</span>
          </div>

          <div className="terminal-body" style={{ height: '420px', overflowY: 'auto' }}>
            <div style={{ color: 'var(--text-dim)', marginBottom: '12px' }}>
              [SYSTEM] Database listener attached. Awaiting SQL queries...
            </div>

            {queryResult && (
              <div className="animate-fadeIn">
                <div style={{ color: 'var(--cyber-cyan)', marginBottom: '8px' }}>
                  &gt; EXECUTED QUERY:
                </div>
                <div style={{ background: '#0a101d', padding: '10px', borderRadius: '6px', color: '#fff', marginBottom: '14px', borderLeft: '3px solid var(--cyber-cyan)' }}>
                  {queryResult.query}
                </div>

                <div style={{ color: queryResult.success ? 'var(--cyber-green)' : 'var(--cyber-red)', marginBottom: '12px', fontWeight: 700 }}>
                  STATUS: {queryResult.status}
                </div>

                {queryResult.success && (
                  <div>
                    <div style={{ color: 'var(--cyber-amber)', marginBottom: '6px' }}>
                      ⚡ ADMIN USER RECORD UNLOCKED:
                    </div>
                    <pre style={{ background: '#08120b', padding: '10px', borderRadius: '6px', color: '#00ff66', fontSize: '11px', marginBottom: '14px' }}>
                      {JSON.stringify(queryResult.user, null, 2)}
                    </pre>

                    <div style={{ color: 'var(--cyber-green)', marginBottom: '6px' }}>
                      📂 DATABASE USER DUMP EXFILTRATED:
                    </div>
                    <pre style={{ background: '#08120b', padding: '10px', borderRadius: '6px', color: '#00ff66', fontSize: '11px' }}>
                      {JSON.stringify(queryResult.dbDump, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {errorMsg && !queryResult?.success && (
              <div style={{ color: 'var(--cyber-red)', marginTop: '12px' }}>
                [ERROR] {errorMsg}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
