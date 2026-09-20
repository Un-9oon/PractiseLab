import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Shield, Award, Cpu, CheckCircle2, Play } from 'lucide-react';

export default function CyberTerminal({ isPatched, setIsPatched, ctfFlags, unlockFlag, setActiveTab }) {
  const [inputCmd, setInputCmd] = useState('');
  const [history, setHistory] = useState([
    { text: '=======================================================', color: 'var(--cyber-green)' },
    { text: '   CYBERSEC TARGET RANGE & PENTEST CONSOLE v2.4       ', color: '#fff' },
    { text: '=======================================================', color: 'var(--cyber-green)' },
    { text: 'Type "help" to view available pentesting CLI tools.', color: 'var(--text-muted)' },
    { text: 'Type "nmap" to perform port & service scan on target.', color: 'var(--text-muted)' },
    { text: 'Type "flags" to view captured CTF flags.', color: 'var(--text-muted)' }
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = inputCmd.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { text: `user@cyberlab:~$ ${inputCmd}`, color: '#fff' }];

    if (cmd === 'help') {
      newHistory.push(
        { text: 'AVAILABLE CLI PENTEST COMMANDS:', color: 'var(--cyber-cyan)' },
        { text: '  nmap / scan     - Scan target ports and active HTTP services', color: 'var(--text-muted)' },
        { text: '  sqli            - Switch to SQL Injection Pentest Sandbox', color: 'var(--text-muted)' },
        { text: '  xss             - Switch to XSS Payload Playground', color: 'var(--text-muted)' },
        { text: '  cmd             - Switch to Remote Command Execution Lab', color: 'var(--text-muted)' },
        { text: '  jwt             - Switch to JWT Token Inspector', color: 'var(--text-muted)' },
        { text: '  upload          - Switch to Malicious File Upload Lab', color: 'var(--text-muted)' },
        { text: '  flags           - Display captured CTF flags summary', color: 'var(--text-muted)' },
        { text: '  patch-all       - Enable defense patches on all labs', color: 'var(--text-muted)' },
        { text: '  unpatch-all     - Re-enable vulnerable target mode', color: 'var(--text-muted)' },
        { text: '  clear           - Clear terminal window', color: 'var(--text-muted)' }
      );
    } else if (cmd === 'nmap' || cmd === 'scan') {
      newHistory.push(
        { text: 'Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-20...', color: 'var(--cyber-cyan)' },
        { text: 'Nmap scan report for targetlab.internal (10.10.14.85)', color: '#fff' },
        { text: 'Host is up (0.00042s latency).', color: 'var(--cyber-green)' },
        { text: 'PORT     STATE SERVICE       VERSION', color: 'var(--text-dim)' },
        { text: '22/tcp   open  ssh           OpenSSH 8.9p1 Ubuntu', color: '#fff' },
        { text: '80/tcp   open  http          Nginx 1.18.0 (Vulnerable App)', color: 'var(--cyber-red)' },
        { text: '5432/tcp open  postgresql    PostgreSQL 14.2 (SQLi Vulnerable)', color: 'var(--cyber-red)' },
        { text: 'Nmap done: 1 IP address (1 host up) scanned in 0.48 seconds.', color: 'var(--cyber-green)' }
      );
    } else if (cmd === 'sqli') {
      setActiveTab('sqli');
    } else if (cmd === 'xss') {
      setActiveTab('xss');
    } else if (cmd === 'cmd') {
      setActiveTab('cmd');
    } else if (cmd === 'jwt') {
      setActiveTab('jwt');
    } else if (cmd === 'upload') {
      setActiveTab('upload');
    } else if (cmd === 'flags') {
      const keys = Object.keys(ctfFlags);
      if (keys.length === 0) {
        newHistory.push({ text: '[CTF STATUS] 0 Flags captured yet. Solve pentest labs to earn flags!', color: 'var(--cyber-amber)' });
      } else {
        newHistory.push({ text: `[CTF STATUS] ${keys.length} / 5 FLAGS CAPTURED:`, color: 'var(--cyber-green)' });
        keys.forEach(k => {
          newHistory.push({ text: `  ✦ ${ctfFlags[k]}`, color: 'var(--cyber-neon)' });
        });
      }
    } else if (cmd === 'patch-all') {
      setIsPatched(true);
      newHistory.push({ text: '[DEFENSE UPDATED] All target labs set to SECURED / PATCHED MODE.', color: 'var(--cyber-green)' });
    } else if (cmd === 'unpatch-all') {
      setIsPatched(false);
      newHistory.push({ text: '[TARGET UPDATED] All target labs set to VULNERABLE PENTEST MODE.', color: 'var(--cyber-red)' });
    } else if (cmd === 'clear') {
      setHistory([]);
      setInputCmd('');
      return;
    } else {
      newHistory.push({ text: `bash: command not found: ${inputCmd}. Type "help" for CLI tools.`, color: 'var(--cyber-red)' });
    }

    setHistory(newHistory);
    setInputCmd('');
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
      
      {/* Terminal Container */}
      <div className="terminal-window" style={{ height: '620px', display: 'flex', flexDirection: 'column' }}>
        <div className="terminal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--cyber-green)" />
            <span className="font-mono" style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>CYBER_RANGE_CLI.sh</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-dim)' }}>
            <span>TARGET_IP: 10.10.14.85</span>
            <span style={{ color: isPatched ? 'var(--cyber-green)' : 'var(--cyber-red)' }}>
              [{isPatched ? 'SECURED' : 'VULNERABLE'}]
            </span>
          </div>
        </div>

        {/* Scrollable Output */}
        <div className="terminal-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {history.map((h, idx) => (
            <div key={idx} style={{ color: h.color, marginBottom: '4px' }}>
              {h.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Command Input Bar */}
        <form onSubmit={handleCommand} style={{
          padding: '12px 20px',
          background: '#070c14',
          borderTop: '1px solid var(--border-cyber)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span className="font-mono" style={{ color: 'var(--cyber-green)', fontWeight: 700, fontSize: '13px' }}>
            user@cyberlab:~$
          </span>
          <input
            type="text"
            className="cyber-input"
            style={{ border: 'none', background: 'transparent', padding: '0', flex: 1, fontSize: '13px' }}
            placeholder="Type 'help', 'nmap', 'sqli', 'flags'..."
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            autoFocus
          />
        </form>
      </div>

    </div>
  );
}
