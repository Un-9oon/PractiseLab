import React, { useState, useEffect } from 'react';

const PRODUCTS = [
  { id: 1, name: "NexusShield Enterprise Firewall", price: 499.00, cat: "Hardware", icon: "🛡️", desc: "Gigabit hardware firewall with deep packet inspection and intrusion detection." },
  { id: 2, name: "Hardware Security Key (FIDO2)", price: 49.99, cat: "Hardware", icon: "🔑", desc: "Hardware FIDO2 U2F authentication key for high-security zero-trust access." },
  { id: 3, name: "SOC Monitoring Workstation", price: 1299.00, cat: "Hardware", icon: "🖥️", desc: "High-performance security operations center monitoring workstation." },
  { id: 4, name: "Vulnerability Scanner Pro", price: 199.99, cat: "Software", icon: "🔍", desc: "Automated network and web vulnerability scanner with CVE reporting." },
  { id: 5, name: "Executive Superuser Security Pass", price: 9999.00, cat: "Special", icon: "🧪", desc: "RESTRICTED — Executive Level Superuser Security Pass." },
  { id: 6, name: "Tactical Faraday Backpack", price: 89.99, cat: "Gear", icon: "🎒", desc: "RF-shielded anti-theft Faraday bag for sensitive hardware and laptops." }
];

const MASTER_VULNERABILITY_CATALOG = [
  // 1. INJECTION VULNERABILITIES (OWASP A03)
  { id: 'sqli_simple', name: 'Simple In-Band SQL Injection', category: '1. Injection', pts: 100, difficulty: 'Easy (1-Liner)', desc: 'Bypass search/login via basic \' OR 1=1-- payload.', solved: false },
  { id: 'sqli_blind_time', name: 'Blind Time-Based SQL Injection', category: '1. Injection', pts: 300, difficulty: 'Hard (Complex)', desc: 'Exploit stealth SLEEP/PG_SLEEP time delay SQLi payload.', solved: false },
  { id: 'sqli_second_order', name: 'Second-Order SQL Injection', category: '1. Injection', pts: 400, difficulty: '🔥 Extreme', desc: 'Inject stored payload that triggers in background batch queries.', solved: false },
  { id: 'cmd_injection', name: 'OS Command Injection (RCE)', category: '1. Injection', pts: 450, difficulty: '🔥 Extreme', desc: 'Inject system commands (; id || ping) into server ping diagnostics API.', solved: false },
  { id: 'nosql_injection', name: 'NoSQL Injection Payload', category: '1. Injection', pts: 350, difficulty: 'Hard (Complex)', desc: 'Bypass authentication using MongoDB style {"$gt": ""} NoSQL operator.', solved: false },

  // 2. BROKEN AUTHENTICATION & SESSION MANAGEMENT (OWASP A07)
  { id: 'auth_bypass', name: 'Simple Authentication Bypass', category: '2. Broken Auth', pts: 150, difficulty: 'Easy (1-Liner)', desc: 'Bypass login form using simple SQL injection without valid password.', solved: false },
  { id: 'jwt_alg_none', name: 'JWT Signature Exclusion (alg:none)', category: '2. Broken Auth', pts: 300, difficulty: 'Hard (Complex)', desc: 'Forge valid Admin session JWT token with alg:none header.', solved: false },
  { id: 'jwt_key_confusion', name: 'JWT Key Confusion (RSA to HMAC)', category: '2. Broken Auth', pts: 450, difficulty: '🔥 Extreme', desc: 'Forge SuperAdmin token using RSA Public Key as HMAC secret.', solved: false },
  { id: 'insecure_cookie', name: 'Plaintext JWT Token Exposure', category: '2. Broken Auth', pts: 150, difficulty: 'Easy (1-Liner)', desc: 'Inspect unencrypted session tokens stored in LocalStorage.', solved: false },
  { id: 'admin_takeover', name: 'SuperAdmin Account Hijacking', category: '2. Broken Auth', pts: 250, difficulty: 'Medium', desc: 'Hijack superadmin privileges via credential/session takeover.', solved: false },

  // 3. ACCESS CONTROL & PATH TRAVERSAL (OWASP A01)
  { id: 'path_traversal_simple', name: 'Simple Path Traversal / LFI', category: '3. Access Control', pts: 100, difficulty: 'Easy (1-Liner)', desc: 'Read local file via simple ../../../etc/passwd payload.', solved: false },
  { id: 'path_traversal_complex', name: 'Complex Filter Bypass Path Traversal', category: '3. Access Control', pts: 350, difficulty: 'Hard (Complex)', desc: 'Bypass replace("../", "") filter using nested ....//....//etc/passwd.', solved: false },
  { id: 'idor_profile', name: 'Insecure Direct Object Reference (IDOR)', category: '3. Access Control', pts: 200, difficulty: 'Medium', desc: 'Access unauthorized executive profile records via API parameter tampering.', solved: false },
  { id: 'priv_esc', name: 'Vertical Privilege Escalation', category: '3. Access Control', pts: 300, difficulty: 'Hard (Complex)', desc: 'Escalate low-privileged user account to System Administrator.', solved: false },
  { id: 'directory_listing', name: 'Sensitive Directory Listing', category: '3. Access Control', pts: 150, difficulty: 'Easy (1-Liner)', desc: 'Discover exposed internal server files (/backup/internal/).', solved: false },

  // 4. CROSS-SITE SCRIPTING (XSS) (OWASP A03)
  { id: 'xss_simple', name: 'Simple Reflected XSS', category: '4. XSS', pts: 100, difficulty: 'Easy (1-Liner)', desc: 'Execute simple <script>alert(1)</script> script payload.', solved: false },
  { id: 'xss_stored', name: 'Stored XSS in Reviews', category: '4. XSS', pts: 150, difficulty: 'Medium', desc: 'Inject persistent XSS script in customer feedback section.', solved: false },
  { id: 'xss_complex_polyglot', name: 'Complex Polyglot XSS WAF Bypass', category: '4. XSS', pts: 350, difficulty: 'Hard (Complex)', desc: 'Bypass WAF regex filters using polyglot SVG/JavaScript event payloads.', solved: false },
  { id: 'xss_dom_hash', name: 'DOM-Based XSS via Hash Fragment', category: '4. XSS', pts: 300, difficulty: 'Hard (Complex)', desc: 'Exploit DOM sink reading unescaped location.hash fragment.', solved: false },

  // 5. CLIENT-SIDE & CSRF EXPLOITATION
  { id: 'proto_pollution', name: 'DOM Prototype Pollution Attack', category: '5. Client Exploits', pts: 500, difficulty: '🔥 Extreme', desc: 'Pollute Object.prototype via URL params (?__proto__[isAdmin]=true).', solved: false },
  { id: 'csrf_simple', name: 'Simple Unprotected CSRF', category: '5. Client Exploits', pts: 150, difficulty: 'Easy (1-Liner)', desc: 'Trigger state-changing email update due to missing anti-CSRF token.', solved: false },
  { id: 'csrf_complex_cors', name: 'Complex CORS Misconfiguration CSRF', category: '5. Client Exploits', pts: 400, difficulty: '🔥 Extreme', desc: 'Exploit wildcard Access-Control-Allow-Origin with credentials.', solved: false },
  { id: 'clickjacking', name: 'Clickjacking Vulnerability', category: '5. Client Exploits', pts: 150, difficulty: 'Easy (1-Liner)', desc: 'Embed web app in unauthorized frame due to missing X-Frame-Options.', solved: false },

  // 6. API & BUSINESS LOGIC FLAWS (OWASP A04)
  { id: 'logic_negative_cart', name: 'Business Logic Flaw (Price Tampering)', category: '6. Logic Flaws', pts: 300, difficulty: 'Hard (Complex)', desc: 'Manipulate cart parameters to achieve negative checkout balance.', solved: false },
  { id: 'mass_assignment', name: 'JSON Mass Assignment Override', category: '6. Logic Flaws', pts: 350, difficulty: '🔥 Extreme', desc: 'Inject unexpected JSON payload parameters ({"is_vip_admin": true}).', solved: false },
  { id: 'rate_limit_missing', name: 'Missing API Rate Limiting', category: '6. Logic Flaws', pts: 150, difficulty: 'Easy (1-Liner)', desc: 'Perform automated brute force attacks due to absent rate limiting.', solved: false },

  // 7. SECURITY MISCONFIGURATION & RECON (OWASP A05)
  { id: 'sourcemap_recon', name: 'Source Map Debug Endpoint Recon', category: '7. Misconfig', pts: 400, difficulty: '🔥 Extreme', desc: 'Reverse engineer minified JS chunks to find hidden debug endpoints.', solved: false },
  { id: 'hardcoded_secrets', name: 'Hardcoded Master API Key Leak', category: '7. Misconfig', pts: 100, difficulty: 'Easy (1-Liner)', desc: 'Inspect source code to disclose hardcoded secret keys.', solved: false },
  { id: 'missing_headers', name: 'Security Response Headers Audit', category: '7. Misconfig', pts: 100, difficulty: 'Easy (1-Liner)', desc: 'Audit missing HSTS, CSP, and X-Frame-Options response headers.', solved: false },

  // 8. SSRF & DESERIALIZATION (OWASP A10 / A08)
  { id: 'ssrf_webhook', name: 'Server-Side Request Forgery (SSRF)', category: '8. SSRF & Deserial', pts: 450, difficulty: '🔥 Extreme', desc: 'Trigger SSRF via Webhook URL parameter to query internal metadata service.', solved: false }
];

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [activeTab, setActiveTab] = useState('store');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // CTF Challenge & Notification State
  const [challenges, setChallenges] = useState(MASTER_VULNERABILITY_CATALOG);
  const [notification, setNotification] = useState(null);

  // Vulnerability states
  const [sqliTriggered, setSqliTriggered] = useState(false);
  const [fileParam, setFileParam] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: "Alice (Security Analyst)", text: "Great hardware inventory management system." },
    { id: 2, author: "Bob (DevOps Engineer)", text: "API responses are quick and responsive." }
  ]);
  const [newComment, setNewComment] = useState('');
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginMsg, setLoginMsg] = useState('');
  const [idorUserId, setIdorUserId] = useState(2);
  const [jwtTokenInput, setJwtTokenInput] = useState('');
  const [ssrfUrlInput, setSsrfUrlInput] = useState('');

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Trigger Toast Notification on Challenge Solved
  const triggerSolved = (challengeId) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId && !c.solved) {
        setNotification({ name: c.name, pts: c.pts, category: c.category, difficulty: c.difficulty });
        setTimeout(() => setNotification(null), 6000);
        return { ...c, solved: true };
      }
      return c;
    }));
  };

  // Prototype Pollution & Hash listener
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('__proto__[isAdmin]') === 'true' || params.get('__proto__.isAdmin') === 'true') {
      Object.prototype.isAdmin = true;
      triggerSolved('proto_pollution');
    }

    const handleHashChange = () => {
      const hash = decodeURIComponent(window.location.hash);
      if (hash.includes("<script>") || hash.includes("onerror=") || hash.includes("javascript:")) {
        triggerSolved('xss_dom_hash');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Path Traversal Handler (Simple vs Complex Filter Bypass)
  const handleFileFetch = (path) => {
    setFileParam(path);
    if (!path.trim()) {
      setFileContent('');
      return;
    }

    // 1. Simple Path Traversal
    if (path.includes("../../../etc/passwd") || path.includes("../etc/passwd")) {
      setFileContent("root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin");
      triggerSolved('path_traversal_simple');
      return;
    }

    // 2. Complex Filter Bypass
    if (path.includes("....//") || path.includes("....\\\\") || path.includes("%252e%252e") || path.includes("%2e%2e")) {
      setFileContent("root:x:0:0:root:/root:/bin/bash\n# EXTREME LFI BYPASS SUCCESSFUL\nNEXUS_CONFIDENTIAL_KEY=SECRET_SERVER_ENV_KEY_9921");
      triggerSolved('path_traversal_complex');
      return;
    }

    setFileContent(`Error: File '${path}' not found on server.`);
  };

  // Search logic (Simple SQLi vs Complex Polyglot XSS)
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    // Simple SQLi
    if (val.includes("'") || val.toLowerCase().includes("or 1=1") || val.includes("--")) {
      setSqliTriggered(true);
      triggerSolved('sqli_simple');
    } else {
      setSqliTriggered(false);
    }

    // Simple XSS vs Complex Polyglot XSS
    if (val === "<script>alert(1)</script>" || val === "<script>alert('XSS')</script>") {
      triggerSolved('xss_simple');
    } else if (val.includes("<svg") || val.includes("onload=") || val.includes("javascript:") || val.includes("String.fromCharCode")) {
      triggerSolved('xss_complex_polyglot');
    }

    // Blind Time-Based SQLi
    if (val.toLowerCase().includes("sleep(") || val.toLowerCase().includes("pg_sleep")) {
      triggerSolved('sqli_blind_time');
    }

    // Second-Order SQLi
    if (val.toLowerCase().includes("select case when") || val.toLowerCase().includes("benchmark(")) {
      triggerSolved('sqli_second_order');
    }
  };

  const filteredProducts = PRODUCTS.filter(p => {
    if (sqliTriggered) return true;
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.desc.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Login logic
  const handleLogin = (e) => {
    e.preventDefault();
    const u = loginForm.user.trim();
    const p = loginForm.pass.trim();

    if (u.includes('"$gt"') || u.includes('"$ne"')) {
      setIsLoggedIn(true);
      setCurrentUser({ id: 1, name: "System Administrator", email: "admin@practicallab.internal", role: "SuperAdmin" });
      triggerSolved('nosql_injection');
      triggerSolved('admin_takeover');
    } else if (u.includes("'") || u.toLowerCase().includes("or '1'='1")) {
      setIsLoggedIn(true);
      setCurrentUser({ id: 1, name: "System Administrator", email: "admin@practicallab.internal", role: "SuperAdmin" });
      setLoginMsg("✅ Authentication Successful");
      triggerSolved('sqli_simple');
      triggerSolved('auth_bypass');
      triggerSolved('admin_takeover');
    } else if (u.toLowerCase() === "admin" && p === "admin123") {
      setIsLoggedIn(true);
      setCurrentUser({ id: 1, name: "System Administrator", email: "admin@practicallab.internal", role: "SuperAdmin" });
      triggerSolved('admin_takeover');
    } else if (u && p) {
      setIsLoggedIn(true);
      setCurrentUser({ id: 2, name: u, email: `${u}@practicallab.internal`, role: "User" });
    }
  };

  // CSRF Test Handler
  const handleCsrfTest = (newEmail, tokenProvided) => {
    if (!tokenProvided) {
      triggerSolved('csrf_simple');
      alert(`CSRF Exploit Solved! User email changed to ${newEmail} without anti-CSRF token.`);
    } else if (tokenProvided === 'CORS_WILDCARD_BYPASS') {
      triggerSolved('csrf_complex_cors');
      alert(`Complex CORS CSRF Exploit Solved! Access-Control-Allow-Origin credentials bypassed.`);
    }
  };

  // JWT Forgery Test
  const handleJwtForgerySubmit = (e) => {
    e.preventDefault();
    if (jwtTokenInput.includes("eyJhbGciOiJub25lIn") || jwtTokenInput.toLowerCase().includes('"alg":"none"')) {
      triggerSolved('jwt_alg_none');
      alert("✅ JWT alg:none Challenge Solved!");
    } else if (jwtTokenInput.toLowerCase().includes("alg_confusion_hmac") || jwtTokenInput.toLowerCase().includes("rsa_public_key_as_secret")) {
      triggerSolved('jwt_key_confusion');
      alert("✅ EXTREME CHALLENGE SOLVED: JWT Key Confusion Exploit Accepted!");
    }
  };

  // SSRF Webhook Test
  const handleSsrfSubmit = (e) => {
    e.preventDefault();
    if (ssrfUrlInput.includes("169.254.169.254") || ssrfUrlInput.includes("localhost") || ssrfUrlInput.includes("127.0.0.1")) {
      triggerSolved('ssrf_webhook');
      alert("✅ EXTREME CHALLENGE SOLVED: SSRF Internal Metadata Service Disclosed!");
    }
  };

  // Comment logic
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (newComment.includes("<script>") || newComment.includes("onerror=") || newComment.includes("alert(")) {
      triggerSolved('xss_simple');
      triggerSolved('xss_stored');
    }
    setComments([...comments, { id: Date.now(), author: currentUser ? currentUser.name : "Guest User", text: newComment }]);
    setNewComment('');
  };

  // IDOR Profile Inspection
  const handleIdorInspect = (id) => {
    setIdorUserId(id);
    if (id === 1 || id === 3) triggerSolved('idor_profile');
    if (id === 1) triggerSolved('hardcoded_secrets');
  };

  // Cart quantity update
  const updateCartQty = (id, newQty) => {
    if (newQty < 0) triggerSolved('logic_negative_cart');
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const addToCart = (p) => {
    setCart(prev => {
      const exist = prev.find(item => item.id === p.id);
      if (exist) return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...p, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const cartTotal = cart.reduce((a, b) => a + (b.price * b.qty), 0);
  const solvedCount = challenges.filter(c => c.solved).length;
  const totalScore = challenges.reduce((sum, c) => c.solved ? sum + c.pts : sum, 0);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* PRACTICAL LAB NOTIFICATION BANNER */}
      {notification && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, background: notification.difficulty.includes('Extreme') ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontSize: '32px' }}>🎉</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>CHALLENGE SOLVED! (+{notification.pts} PTS)</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{notification.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.85 }}>Category: {notification.category} • Difficulty: {notification.difficulty}</div>
          </div>
        </div>
      )}

      {/* CLEAN PROFESSIONAL NAVBAR */}
      <nav className="navbar">
        <div className="brand" onClick={() => setActiveTab('store')}>
          <div className="brand-icon">🌐</div>
          <div className="brand-text">
            <h1>Practical Lab</h1>
            <span>Master 28 Vulnerabilities Pentest Suite</span>
          </div>
        </div>

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search catalog, hardware, products..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="nav-actions">
          <button className={`btn ${activeTab === 'store' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('store')}>
            🛒 Products
          </button>
          <button className={`btn ${activeTab === 'comments' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('comments')}>
            💬 Community
          </button>

          {isLoggedIn ? (
            <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('profile')}>
              👤 Profile ({currentUser?.name})
            </button>
          ) : (
            <button className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('login')}>
              🔑 Login
            </button>
          )}

          <button className={`btn ${activeTab === 'scoreboard' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('scoreboard')}>
            🏆 Score Board ({solvedCount}/{challenges.length})
          </button>

          <button className="theme-toggle-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Light / Dark Mode">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button className="btn btn-primary btn-icon" onClick={() => setIsCartOpen(true)}>
            🛒
            {cart.length > 0 && <span className="badge">{cart.reduce((a,b)=>a+b.qty,0)}</span>}
          </button>
        </div>
      </nav>

      {/* MAIN TAB CONTENTS */}
      <div style={{ flex: 1 }}>
        {/* 1. STORE TAB */}
        {activeTab === 'store' && (
          <div>
            <header className="hero-banner">
              <div className="hero-content">
                <h2>Enterprise Hardware & Security Solutions</h2>
                <p>Browse our catalog of hardware firewalls, security tokens, and enterprise infrastructure.</p>
              </div>
              <div style={{ fontSize: '90px' }}>🔒</div>
            </header>

            <main className="products-grid">
              {filteredProducts.map(p => (
                <div key={p.id} className="product-card">
                  <div className="product-image">
                    <span>{p.icon}</span>
                    <span className="product-tag">{p.cat}</span>
                  </div>
                  <div className="product-body">
                    <div>
                      <h3 className="product-title">{p.name}</h3>
                      <p className="product-desc">{p.desc}</p>
                    </div>
                    <div className="product-footer">
                      <div className="price">${p.price.toFixed(2)}</div>
                      <button className="btn btn-primary" onClick={() => addToCart(p)}>
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </main>
          </div>
        )}

        {/* 2. LOGIN TAB */}
        {activeTab === 'login' && (
          <div style={{ maxWidth: '460px', margin: '60px auto', padding: '30px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>🔑 User Login Portal</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Enter your employee credentials to access the enterprise portal.</p>
            
            {loginMsg && (
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(79, 70, 229, 0.2)', border: '1px solid var(--primary)', marginBottom: '16px', fontSize: '13px' }}>
                {loginMsg}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username or Email</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter email or username..." 
                  value={loginForm.user}
                  onChange={e => setLoginForm({...loginForm, user: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Enter password..." 
                  value={loginForm.pass}
                  onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}>
                Sign In
              </button>
            </form>

            {/* JWT FORGERY */}
            <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <label className="form-label" style={{ color: 'var(--primary)' }}>🔐 Token Authentication (JWT):</label>
              <form onSubmit={handleJwtForgerySubmit} style={{ marginTop: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Paste Bearer JWT token..."
                  value={jwtTokenInput}
                  onChange={e => setJwtTokenInput(e.target.value)}
                  style={{ fontSize: '12px', fontFamily: 'monospace' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '8px', padding: '8px', fontSize: '12px' }}>
                  Authenticate via JWT Token
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. COMMENTS / FEEDBACK TAB */}
        {activeTab === 'comments' && (
          <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>💬 Community Feedback</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Submit reviews and product feedback for Practical Lab products.</p>

            <form onSubmit={handleAddComment} style={{ marginBottom: '30px', background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label">Leave your review:</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="Write your feedback here..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{ resize: 'none', marginBottom: '12px' }}
              ></textarea>
              <button type="submit" className="btn btn-primary">Post Review</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {comments.map(c => (
                <div key={c.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>{c.author}</div>
                  <div 
                    style={{ fontSize: '14px', color: 'var(--text-main)' }} 
                    dangerouslySetInnerHTML={{ __html: c.text }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. USER PROFILE TAB & CSRF DEMO */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '650px', margin: '40px auto', padding: '30px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>👤 User Account & Profile API</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>User settings, account IDOR, and CSRF endpoint testing.</p>

            <div style={{ marginBottom: '20px', padding: '14px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <label className="form-label">Select User ID to Query (IDOR Test):</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button className={`btn ${idorUserId === 2 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleIdorInspect(2)}>User ID: 2 (My Account)</button>
                <button className={`btn ${idorUserId === 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleIdorInspect(1)}>User ID: 1</button>
                <button className={`btn ${idorUserId === 3 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleIdorInspect(3)}>User ID: 3</button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '18px', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
              <div style={{ color: 'var(--primary)' }}>GET /api/v1/users/{idorUserId}/profile HTTP/1.1</div>
              {idorUserId === 1 && <div style={{ color: 'var(--accent-red)', marginTop: '6px' }}>&#123; "id": 1, "role": "SuperAdmin", "master_key": "NEXUS_SECRET_API_KEY_ROOT" &#125;</div>}
              {idorUserId === 2 && <div style={{ color: 'var(--accent-green)', marginTop: '6px' }}>&#123; "id": 2, "role": "Standard_Employee" &#125;</div>}
              {idorUserId === 3 && <div style={{ color: 'var(--accent-red)', marginTop: '6px' }}>&#123; "id": 3, "role": "Executive_CEO", "salary": "$500,000" &#125;</div>}
            </div>

            {/* CSRF Test Section */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>🔄 Email Update Endpoint (CSRF Test)</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => handleCsrfTest('attacker@evil.com', false)}>
                  Test Simple CSRF (No Token)
                </button>
                <button className="btn btn-secondary" onClick={() => handleCsrfTest('hacked@cors-bypass.com', 'CORS_WILDCARD_BYPASS')}>
                  Test Complex CORS CSRF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. DIAGNOSTICS & PATH TRAVERSAL TAB */}
        {activeTab === 'diagnostics' && (
          <div style={{ maxWidth: '650px', margin: '40px auto', padding: '30px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>🛠️ Server Diagnostics & Webhooks</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>File inspector, Path Traversal, and SSRF Webhook tests.</p>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Server File Path Parameter (`file`):</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="system_logs.txt (Try ../../../etc/passwd OR ....//....//etc/passwd)"
                value={fileParam}
                onChange={e => handleFileFetch(e.target.value)}
              />
            </div>

            {fileContent && (
              <div style={{ background: 'var(--bg-main)', padding: '18px', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', color: fileContent.includes('root:') ? 'var(--accent-green)' : 'var(--text-muted)', marginBottom: '24px' }}>
                {fileContent}
              </div>
            )}

            {/* SSRF Test */}
            <form onSubmit={handleSsrfSubmit} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <label className="form-label">Fetch Webhook Endpoint (SSRF Test):</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="https://api.practicallab.internal (Try: http://169.254.169.254/latest/meta-data/)"
                value={ssrfUrlInput}
                onChange={e => setSsrfUrlInput(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary" style={{ marginTop: '8px' }}>Fetch External Webhook</button>
            </form>
          </div>
        )}

        {/* 6. SCORE BOARD TAB (ALL 28 VULNERABILITIES) */}
        {activeTab === 'scoreboard' && (
          <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '28px' }}>🏆 Master 28 Vulnerabilities Score Board</h2>
                <p style={{ color: 'var(--text-muted)' }}>Complete both Simple 1-Liners & Complex Logic-Bypass Security Challenges.</p>
              </div>
              <div style={{ textAlign: 'right', background: 'var(--bg-card)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>TOTAL SCORE</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>{totalScore} PTS</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              {challenges.map(c => (
                <div key={c.id} style={{ background: 'var(--bg-card)', border: c.solved ? '1px solid var(--accent-green)' : '1px solid var(--border-color)', padding: '18px 20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px' }}>{c.solved ? '✅' : '🔒'}</span>
                      <h3 style={{ fontSize: '16px', color: c.solved ? 'var(--accent-green)' : 'var(--text-main)' }}>{c.name}</h3>
                      <span style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{c.category}</span>
                      <span style={{ background: c.difficulty.includes('Hard') || c.difficulty.includes('Extreme') ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-main)', border: c.difficulty.includes('Hard') || c.difficulty.includes('Extreme') ? '1px solid var(--accent-red)' : '1px solid var(--border-color)', color: c.difficulty.includes('Hard') || c.difficulty.includes('Extreme') ? 'var(--accent-red)' : 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {c.difficulty}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{c.desc}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: c.solved ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                      {c.solved ? `SOLVED (+${c.pts})` : `${c.pts} PTS`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER DISCOVERY LINKS */}
      <footer style={{ background: 'var(--bg-header)', borderTop: '1px solid var(--border-color)', padding: '20px 28px', marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
        <div>© 2026 Practical Lab. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setActiveTab('diagnostics')}>
            Server File Inspector (LFI & SSRF)
          </span>
        </div>
      </footer>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3>🛒 Order Cart ({cart.reduce((a,b)=>a+b.qty,0)})</h3>
              <button className="modal-close" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Cart is empty</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div style={{ fontSize: '28px' }}>{item.icon}</div>
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button className="btn btn-secondary" style={{ padding: '2px 8px' }} onClick={() => updateCartQty(item.id, item.qty - 1)}>-</button>
                      <input 
                        type="number" 
                        value={item.qty} 
                        onChange={e => updateCartQty(item.id, parseInt(e.target.value) || 0)}
                        style={{ width: '45px', textAlign: 'center', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px', padding: '2px' }}
                      />
                      <button className="btn btn-secondary" style={{ padding: '2px 8px' }} onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="total-row">
                  <span>Total Amount:</span>
                  <span style={{ color: cartTotal < 0 ? 'var(--accent-red)' : 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert(`Order Placed! Total: $${cartTotal.toFixed(2)}`)}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
