import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, Terminal, Cpu, Zap, Search, Key, 
  ArrowRight, CheckCircle2, Server, Globe, Database, Award, User, Eye, EyeOff, Code
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CyberWebsite() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  
  // Login Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMsg, setLoginMsg] = useState('');

  // Pentest Tool state
  const [targetInput, setTargetInput] = useState('');
  const [testType, setTestType] = useState('sqli');
  const [scanResult, setScanResult] = useState(null);

  const handleQuickDemoLogin = () => {
    setEmail('sec.officer@cybershield.io');
    setPassword('DemoPass2026!');
    setUser({
      name: 'Security Officer Alex',
      email: 'sec.officer@cybershield.io',
      role: 'Chief Information Security Officer'
    });
    confetti({ particleCount: 50, spread: 60 });
    setActiveTab('home');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginMsg('Please enter email and password.');
      return;
    }
    setUser({
      name: email.split('@')[0],
      email: email,
      role: 'Security Analyst'
    });
    confetti({ particleCount: 50, spread: 60 });
    setActiveTab('home');
  };

  const handleRunPentest = (e) => {
    e.preventDefault();
    if (!targetInput) return;

    if (testType === 'sqli') {
      const isSqli = targetInput.includes("' OR '1'='1") || targetInput.includes("' OR 1=1");
      setScanResult({
        type: 'SQL Injection Test',
        input: targetInput,
        vulnerable: isSqli,
        message: isSqli 
          ? '⚠️ VULNERABILITY DETECTED: Payload bypassed authentication query!' 
          : '✅ PASSED: Query safely parameterized.',
        query: `SELECT * FROM users WHERE username = '${targetInput}'`
      });
    } else if (testType === 'xss') {
      const isXSS = targetInput.includes('<script>') || targetInput.includes('onerror=');
      setScanResult({
        type: 'Cross-Site Scripting (XSS)',
        input: targetInput,
        vulnerable: isXSS,
        message: isXSS 
          ? '⚠️ VULNERABILITY DETECTED: Script tag rendered directly in DOM!' 
          : '✅ PASSED: Input HTML entity encoded cleanly.'
      });
    } else {
      const isCmd = targetInput.includes(';') || targetInput.includes('|');
      setScanResult({
        type: 'Command Injection (RCE)',
        input: targetInput,
        vulnerable: isCmd,
        message: isCmd 
          ? '⚠️ VULNERABILITY DETECTED: Chained shell command executed!' 
          : '✅ PASSED: Strict IPv4 validation passed.'
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>
      
      {/* Navbar */}
      <nav className="cyber-card" style={{
        position: 'sticky',
        top: '16px',
        zIndex: 50,
        margin: '0 24px 24px 24px',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div onClick={() => setActiveTab('home')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid var(--cyber-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={22} color="var(--cyber-green)" />
          </div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Cyber<span className="glow-green">Shield</span> AI
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>ENTERPRISE CYBERSECURITY PLATFORM</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Security Solutions' },
            { id: 'pentest', label: 'Pentest Simulator' },
            { id: 'threats', label: 'Threat Intelligence' }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className="cyber-btn"
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                background: activeTab === link.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                border: activeTab === link.id ? '1px solid var(--cyber-green)' : '1px solid transparent'
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Auth / Login Button */}
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '6px 12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--cyber-green)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--cyber-green)',
                fontWeight: 600
              }}>
                👤 {user.name}
              </div>
              <button
                onClick={() => setUser(null)}
                className="cyber-btn cyber-btn-red"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="cyber-btn cyber-btn-cyan"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Client Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Router */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 60px 24px' }}>
        
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="animate-fadeIn">
            {/* Hero Section */}
            <div className="cyber-card" style={{
              padding: '60px 48px',
              textAlign: 'center',
              marginBottom: '40px',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 8, 15, 0.9) 100%)'
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--cyber-green)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid var(--cyber-green)'
              }}>
                ✦ ZERO TRUST CYBER DEFENSE PLATFORM 2026
              </span>

              <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', marginTop: '20px', lineHeight: '1.2' }}>
                Protecting Enterprise Assets with <br />
                <span className="glow-green">AI Threat Detection & Pentesting</span>
              </h1>

              <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '680px', margin: '16px auto 32px auto' }}>
                Next-generation vulnerability auditing, automated penetration testing, Zero Trust firewall protection, and real-time incident response.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button
                  onClick={() => setActiveTab('pentest')}
                  className="cyber-btn"
                  style={{ padding: '14px 28px', fontSize: '15px' }}
                >
                  <Terminal size={18} /> Launch Pentest Simulator
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className="cyber-btn cyber-btn-cyan"
                  style={{ padding: '14px 28px', fontSize: '15px' }}
                >
                  Explore Security Solutions &rarr;
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              {[
                { label: 'Threats Blocked Today', val: '1,420,890', sub: '+99.98% Uptime', icon: ShieldCheck, color: 'var(--cyber-green)' },
                { label: 'Vulnerabilities Scanned', val: '84,200', sub: 'OWASP Top 10 Active', icon: Search, color: 'var(--cyber-cyan)' },
                { label: 'Global Security Nodes', val: '340 Edges', sub: 'Zero Latency Firewall', icon: Globe, color: 'var(--cyber-amber)' },
                { label: 'Incident Response Time', val: '&lt; 0.4 ms', sub: 'Automated AI Defense', icon: Zap, color: 'var(--cyber-purple)' }
              ].map((m, idx) => (
                <div key={idx} className="cyber-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.label}</span>
                    <m.icon size={20} color={m.color} />
                  </div>
                  <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{m.val}</div>
                  <div style={{ fontSize: '11px', color: m.color, marginTop: '4px', fontWeight: 600 }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Feature Teasers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              <div className="cyber-card" style={{ padding: '28px' }}>
                <Database size={28} color="var(--cyber-green)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>SQL Injection Protection</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Automated parameterized query inspection preventing SQLi authentication bypass payloads.
                </p>
                <button onClick={() => setActiveTab('pentest')} className="cyber-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  Test SQLi Playground &rarr;
                </button>
              </div>

              <div className="cyber-card" style={{ padding: '28px' }}>
                <Code size={28} color="var(--cyber-amber)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>XSS & DOM Sanitization</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  DOMPurify HTML entity encoding preventing Reflected and Stored Cross-Site Scripting.
                </p>
                <button onClick={() => setActiveTab('pentest')} className="cyber-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  Test XSS Sandbox &rarr;
                </button>
              </div>

              <div className="cyber-card" style={{ padding: '28px' }}>
                <Server size={28} color="var(--cyber-red)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>RCE & Command Firewall</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Strict input whitelist validation blocking shell meta-character injection and path traversal.
                </p>
                <button onClick={() => setActiveTab('pentest')} className="cyber-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  Test RCE Scanner &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SECURITY SOLUTIONS */}
        {activeTab === 'services' && (
          <div className="animate-fadeIn">
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>Enterprise Security Solutions</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
                Comprehensive cybersecurity services for vulnerability management and defense.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { title: 'Automated Penetration Testing', desc: 'Simulates real-world cyber attacks against web apps, APIs, and network perimeters to identify zero-day flaws before hackers do.', icon: Terminal, color: 'var(--cyber-green)' },
                { title: 'Zero Trust Web Application Firewall (WAF)', desc: 'Blocks malicious HTTP traffic, SQL injection attempts, cross-site scripting (XSS), and automated bot attacks.', icon: ShieldCheck, color: 'var(--cyber-cyan)' },
                { title: 'Identity & Access Management (IAM)', desc: 'Enforces Multi-Factor Authentication (MFA), secure OAuth2/JWT token verification, and role-based access control.', icon: Lock, color: 'var(--cyber-purple)' },
                { title: 'Cloud Infrastructure Security Audit', desc: 'Continuous monitoring of Kubernetes clusters, Cloud Storage bucket permissions, and IAM policy misconfigurations.', icon: Server, color: 'var(--cyber-amber)' }
              ].map((s, idx) => (
                <div key={idx} className="cyber-card" style={{ padding: '32px' }}>
                  <s.icon size={36} color={s.color} style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: PENTEST SIMULATOR */}
        {activeTab === 'pentest' && (
          <div className="animate-fadeIn">
            <div className="cyber-card" style={{ padding: '24px 32px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--cyber-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  INTERACTIVE AUDIT SUITE
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  Web Vulnerability & Pentest Playground
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  Enter penetration testing payloads below to test sanitization and vulnerability detection.
                </p>
              </div>

              {/* Selector */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'sqli', label: 'SQL Injection' },
                  { id: 'xss', label: 'XSS Scripting' },
                  { id: 'cmd', label: 'Command Injection' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTestType(t.id); setScanResult(null); }}
                    className="cyber-btn"
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      background: testType === t.id ? 'var(--cyber-green)' : 'transparent',
                      color: testType === t.id ? '#000' : 'var(--cyber-green)'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form & Output */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="cyber-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                  Payload Input Console
                </h3>

                <form onSubmit={handleRunPentest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Input Payload ({testType.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      placeholder={
                        testType === 'sqli' ? "admin' OR '1'='1" :
                        testType === 'xss' ? "<script>alert('XSS')</script>" :
                        "127.0.0.1; cat /etc/passwd"
                      }
                      className="cyber-input"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Sample Payloads:</span>
                    {testType === 'sqli' && (
                      <button type="button" onClick={() => setTargetInput("' OR '1'='1")} className="cyber-btn" style={{ padding: '2px 8px', fontSize: '10px' }}>
                        ' OR '1'='1
                      </button>
                    )}
                    {testType === 'xss' && (
                      <button type="button" onClick={() => setTargetInput("<script>alert(1)</script>")} className="cyber-btn" style={{ padding: '2px 8px', fontSize: '10px' }}>
                        &lt;script&gt;alert(1)&lt;/script&gt;
                      </button>
                    )}
                    {testType === 'cmd' && (
                      <button type="button" onClick={() => setTargetInput("127.0.0.1; whoami")} className="cyber-btn" style={{ padding: '2px 8px', fontSize: '10px' }}>
                        127.0.0.1; whoami
                      </button>
                    )}
                  </div>

                  <button type="submit" className="cyber-btn cyber-btn-cyan" style={{ padding: '12px', fontSize: '14px', marginTop: '8px' }}>
                    Run Pentest Scan
                  </button>
                </form>
              </div>

              {/* Output Result */}
              <div className="terminal-window" style={{ height: '360px' }}>
                <div className="terminal-header">
                  <span className="font-mono" style={{ fontSize: '12px', color: '#fff' }}>AUDIT_SCAN_RESULT.log</span>
                </div>
                <div className="terminal-body">
                  {scanResult ? (
                    <div className="animate-fadeIn">
                      <div style={{ color: 'var(--cyber-cyan)', marginBottom: '8px' }}>
                        &gt; TEST TYPE: {scanResult.type}
                      </div>
                      <div style={{ color: '#fff', marginBottom: '8px' }}>
                        &gt; INPUT PAYLOAD: {scanResult.input}
                      </div>
                      <div style={{
                        padding: '12px',
                        borderRadius: '6px',
                        background: scanResult.vulnerable ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        border: scanResult.vulnerable ? '1px solid var(--cyber-red)' : '1px solid var(--cyber-green)',
                        color: scanResult.vulnerable ? 'var(--cyber-red)' : 'var(--cyber-green)',
                        fontWeight: 700,
                        fontSize: '13px'
                      }}>
                        {scanResult.message}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-dim)' }}>
                      [SYSTEM] Awaiting pentest payload input...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: THREAT INTEL */}
        {activeTab === 'threats' && (
          <div className="animate-fadeIn">
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>Live Threat Intelligence Feed</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
                Real-time security vulnerability advisories and global threat telemetry.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { cve: 'CVE-2026-8910', title: 'Critical SQL Injection in Unparameterized Auth Controllers', severity: 'CRITICAL 9.8', color: 'var(--cyber-red)' },
                { cve: 'CVE-2026-7412', title: 'Stored XSS via Unescaped User Comment Input', severity: 'HIGH 8.2', color: 'var(--cyber-amber)' },
                { cve: 'CVE-2026-6109', title: 'JWT Token Algorithm Confusion ("alg": "none")', severity: 'HIGH 7.8', color: 'var(--cyber-amber)' }
              ].map((t, idx) => (
                <div key={idx} className="cyber-card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="font-mono" style={{ fontSize: '12px', color: 'var(--cyber-cyan)', fontWeight: 700 }}>{t.cve}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{t.title}</h3>
                  </div>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: `${t.color}20`,
                    border: `1px solid ${t.color}`,
                    color: t.color,
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {t.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: CLIENT LOGIN PORTAL */}
        {activeTab === 'login' && (
          <div className="animate-fadeIn" style={{ maxWidth: '440px', margin: '40px auto' }}>
            <div className="cyber-card" style={{ padding: '36px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid var(--cyber-green)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  color: 'var(--cyber-green)'
                }}>
                  <Lock size={26} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>Client Portal Login</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  Access your enterprise security dashboard
                </p>
              </div>

              {/* Quick Demo Login Banner */}
              <button
                onClick={handleQuickDemoLogin}
                className="cyber-btn cyber-btn-cyan"
                style={{ width: '100%', padding: '10px', fontSize: '13px', marginBottom: '20px' }}
              >
                ⚡ 1-Click Demo Officer Login
              </button>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Email Address:
                  </label>
                  <input
                    type="email"
                    placeholder="analyst@company.com"
                    className="cyber-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Password:
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    className="cyber-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="cyber-btn" style={{ padding: '12px', fontSize: '14px', marginTop: '8px' }}>
                  Sign In to Security Portal
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        color: 'var(--text-dim)',
        fontSize: '12px',
        borderTop: '1px solid var(--border-cyber)'
      }}>
        CyberShield AI Enterprise Security Platform © 2026 • Saved in Downloads/cybersec-pentest-lab
      </footer>

    </div>
  );
}
