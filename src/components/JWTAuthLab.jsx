import React, { useState } from 'react';
import { Key, ShieldAlert, ShieldCheck, Play, Award, Lock, FileCode, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JWTAuthLab({ isPatched, unlockFlag }) {
  const [jwtHeader, setJwtHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [jwtPayload, setJwtPayload] = useState('{\n  "user": "alex",\n  "role": "guest",\n  "admin": false\n}');
  const [authResponse, setAuthResponse] = useState(null);

  const injectNoneAlg = () => {
    setJwtHeader('{\n  "alg": "none",\n  "typ": "JWT"\n}');
    setJwtPayload('{\n  "user": "alex",\n  "role": "admin",\n  "admin": true\n}');
  };

  const handleVerifyToken = (e) => {
    e.preventDefault();

    try {
      const parsedHeader = JSON.parse(jwtHeader);
      const parsedPayload = JSON.parse(jwtPayload);

      if (!isPatched) {
        // Vulnerable Mode: Accepts "alg": "none" or admin: true
        if (parsedHeader.alg === 'none' || parsedPayload.admin === true || parsedPayload.role === 'admin') {
          unlockFlag('jwt', 'CTF{jwt_auth_bypass_unlocked}');
          confetti({ particleCount: 50, spread: 60 });

          setAuthResponse({
            success: true,
            status: '200 OK (ADMIN PRIVILEGES GRANTED)',
            msg: 'JWT Signature verification skipped due to "alg": "none". Elevated to SUPER_ADMIN.',
            tokenFlag: 'CTF{jwt_auth_bypass_unlocked}'
          });
        } else {
          setAuthResponse({
            success: false,
            status: '403 Forbidden (Standard Guest User)',
            msg: 'Valid signature, but user role is restricted to "guest".'
          });
        }
      } else {
        // Patched Mode: Enforces HS256 Signature verification
        if (parsedHeader.alg === 'none') {
          setAuthResponse({
            success: false,
            status: '401 Unauthorized (JWT Algorithm Attack Blocked)',
            msg: 'Security Policy Denied: Algorithm "none" is explicitly disallowed. Valid HMAC-SHA256 signature required.'
          });
        } else if (parsedPayload.admin === true) {
          setAuthResponse({
            success: false,
            status: '401 Unauthorized (Invalid Signature)',
            msg: 'Signature verification failed. Token payload tampering detected.'
          });
        } else {
          setAuthResponse({
            success: false,
            status: '200 OK (Standard User)',
            msg: 'Token verified successfully with HMAC-SHA256 signature.'
          });
        }
      }
    } catch (err) {
      setAuthResponse({
        success: false,
        status: '400 Bad Request',
        msg: 'JSON Parse Error: Ensure Header and Payload are valid JSON objects.'
      });
    }
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--cyber-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            OWASP A07:2021 • BROKEN AUTHENTICATION
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={28} color="var(--cyber-purple)" /> JWT Token Bypass Lab
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Test JWT algorithm confusion attacks (`"alg": "none"`) and role claim tampering.
          </p>
        </div>

        <div className="cyber-card" style={{ padding: '10px 16px', background: 'rgba(5, 8, 15, 0.7)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600 }}>CHALLENGE GOAL</div>
          <div className="font-mono" style={{ fontSize: '12px', color: 'var(--cyber-purple)', fontWeight: 700 }}>
            Forge JWT claim with "alg": "none"
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left: JWT Editor */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={20} color="var(--cyber-purple)" /> JWT Token Inspector
            </h3>

            <button
              onClick={injectNoneAlg}
              className="cyber-btn"
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              Inject "alg": "none"
            </button>
          </div>

          <form onSubmit={handleVerifyToken} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--cyber-cyan)', marginBottom: '6px' }}>
                HEADER (JSON):
              </label>
              <textarea
                rows="3"
                className="cyber-input"
                value={jwtHeader}
                onChange={(e) => setJwtHeader(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--cyber-amber)', marginBottom: '6px' }}>
                PAYLOAD (CLAIMS):
              </label>
              <textarea
                rows="4"
                className="cyber-input"
                value={jwtPayload}
                onChange={(e) => setJwtPayload(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`cyber-btn ${isPatched ? 'cyber-btn-cyan' : 'cyber-btn-red'}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              <Play size={16} /> Submit Forged JWT to API Server
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
                <strong>SECURED CODE (Strict Signature Verification):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#fff' }}>
                  jwt.verify(token, secret, &#123; algorithms: ['HS256'] &#125;); // Disallows "none"
                </pre>
              </div>
            ) : (
              <div>
                <strong>VULNERABLE CODE (Unverified Algorithm Parsing):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#f87171' }}>
                  jwt.decode(token); // Decodes payload without verifying signature!
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: API Server Response */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="var(--cyber-green)" /> API Authorization Response
          </h3>

          {authResponse ? (
            <div className="animate-fadeIn">
              <div style={{
                padding: '14px',
                borderRadius: '8px',
                background: authResponse.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: authResponse.success ? '1px solid var(--cyber-green)' : '1px solid var(--cyber-red)',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: authResponse.success ? 'var(--cyber-green)' : 'var(--cyber-red)', marginBottom: '4px' }}>
                  {authResponse.status}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {authResponse.msg}
                </div>
              </div>

              {authResponse.tokenFlag && (
                <div style={{ background: '#08120b', border: '1px solid var(--cyber-green)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--cyber-green)', fontWeight: 700 }}>🏆 FLAG UNLOCKED</div>
                  <div className="font-mono" style={{ fontSize: '14px', color: '#00ff66', fontWeight: 800, marginTop: '4px' }}>
                    {authResponse.tokenFlag}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
              Submit a JWT token to inspect backend API authentication response...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
