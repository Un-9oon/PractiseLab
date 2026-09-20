import React, { useState } from 'react';
import { Terminal, ShieldAlert, ShieldCheck, Play, Award, Server, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CmdInjectionLab({ isPatched, unlockFlag }) {
  const [targetHost, setTargetHost] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const injectPayload = (p) => {
    setTargetHost(p);
  };

  const handleRunPing = (e) => {
    e.preventDefault();
    if (!targetHost) return;

    setIsExecuting(true);
    setTerminalOutput([`$ exec_ping --host "${targetHost}"`]);

    setTimeout(() => {
      setIsExecuting(false);

      if (!isPatched) {
        // Check for shell command injection or LFI path traversal
        const isInjection = targetHost.includes(';') || 
                            targetHost.includes('|') || 
                            targetHost.includes('&&') || 
                            targetHost.includes('../../');

        if (isInjection) {
          unlockFlag('cmd', 'CTF{rce_cmd_injection_pwned}');
          confetti({ particleCount: 50, spread: 60 });

          if (targetHost.includes('passwd')) {
            setTerminalOutput([
              `$ exec_ping --host "${targetHost}"`,
              `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.`,
              `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.045 ms`,
              `--- EXECUTING CHAINED SHELL COMMAND: cat /etc/passwd ---`,
              `root:x:0:0:root:/root:/bin/bash`,
              `daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin`,
              `sys:x:2:2:sys:/dev:/usr/sbin/nologin`,
              `www-data:x:33:33:www-data:/var/www:/bin/bash`,
              `flag_keeper:x:1001:1001:CTF{rce_cmd_injection_pwned}:/home/flag:/bin/bash`
            ]);
          } else if (targetHost.includes('whoami')) {
            setTerminalOutput([
              `$ exec_ping --host "${targetHost}"`,
              `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.`,
              `--- EXECUTING CHAINED COMMAND: whoami ---`,
              `root (ELEVATED PRIVILEGES DETECTED)`
            ]);
          } else {
            setTerminalOutput([
              `$ exec_ping --host "${targetHost}"`,
              `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.`,
              `--- SHELL COMMAND INJECTION EXECUTED ---`,
              `uid=0(root) gid=0(root) groups=0(root)`
            ]);
          }
        } else {
          setTerminalOutput([
            `$ exec_ping --host "${targetHost}"`,
            `PING ${targetHost} (${targetHost}) 56(84) bytes of data.`,
            `64 bytes from ${targetHost}: icmp_seq=1 ttl=64 time=0.12 ms`,
            `64 bytes from ${targetHost}: icmp_seq=2 ttl=64 time=0.10 ms`,
            `--- ${targetHost} ping statistics ---`,
            `2 packets transmitted, 2 received, 0% packet loss`
          ]);
        }
      } else {
        // Patched Mode - Strict Input Validation
        const isValidIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(targetHost.trim());
        if (isValidIP) {
          setTerminalOutput([
            `$ exec_ping --host "${targetHost}"`,
            `PING ${targetHost} 56(84) bytes of data.`,
            `2 packets transmitted, 2 received, 0% packet loss`
          ]);
        } else {
          setTerminalOutput([
            `$ exec_ping --host "${targetHost}"`,
            `[SECURITY DENIED]: Input contains illegal characters. Only valid IPv4 addresses allowed.`
          ]);
        }
      }
    }, 500);
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--cyber-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            OWASP A03:2021 • COMMAND INJECTION & LFI
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={28} color="var(--cyber-red)" /> Remote Command Execution (RCE) Lab
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Test shell meta-character injection (`;&|`) in backend system calls and observe IP regex whitelisting defense.
          </p>
        </div>

        <div className="cyber-card" style={{ padding: '10px 16px', background: 'rgba(5, 8, 15, 0.7)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600 }}>CHALLENGE GOAL</div>
          <div className="font-mono" style={{ fontSize: '12px', color: 'var(--cyber-red)', fontWeight: 700 }}>
            Execute shell command `cat /etc/passwd`
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left: Input Form */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={20} color="var(--cyber-green)" /> Network Diagnostics Utility
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '8px' }}>
              QUICK COMMAND INJECTION PAYLOADS:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                "127.0.0.1; cat /etc/passwd",
                "127.0.0.1 | whoami",
                "127.0.0.1 && id"
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

          <form onSubmit={handleRunPing} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Target Host / IP Address Input:
              </label>
              <input
                type="text"
                placeholder="e.g. 127.0.0.1; cat /etc/passwd"
                className="cyber-input"
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isExecuting}
              className={`cyber-btn ${isPatched ? 'cyber-btn-cyan' : 'cyber-btn-red'}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              <Play size={16} /> Run System Diagnostic Ping
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
                <strong>SECURED CODE (Regex IPv4 Whitelist):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#fff' }}>
                  if (!/^(\d&#123;1,3&#125;\.&#123;3&#125;\d&#123;1,3&#125;$/.test(host)) throw new Error("Invalid IP");
                </pre>
              </div>
            ) : (
              <div>
                <strong>VULNERABLE CODE (Unsanitized system() call):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#f87171' }}>
                  child_process.exec("ping -c 2 " + host); // Vulnerable to shell injection
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Terminal Console Output */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} color="var(--cyber-green)" />
              <span className="font-mono" style={{ fontSize: '12px', color: '#fff' }}>SYSTEM_CONSOLE_EXEC.log</span>
            </div>
          </div>

          <div className="terminal-body" style={{ height: '380px', overflowY: 'auto' }}>
            {terminalOutput.length === 0 ? (
              <div style={{ color: 'var(--text-dim)' }}>
                [SYSTEM] Awaiting diagnostic execution command...
              </div>
            ) : (
              terminalOutput.map((line, idx) => (
                <div key={idx} style={{ color: line.includes('CTF') ? 'var(--cyber-amber)' : line.includes('root') ? 'var(--cyber-red)' : '#00ff66' }}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
