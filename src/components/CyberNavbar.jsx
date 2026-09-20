import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Terminal, Award, Cpu, RefreshCw } from 'lucide-react';

export default function CyberNavbar({ activeTab, setActiveTab, isPatched, setIsPatched, ctfFlags }) {
  const flagCount = Object.keys(ctfFlags).length;

  return (
    <nav className="cyber-card" style={{
      position: 'sticky',
      top: '16px',
      zIndex: 50,
      margin: '0 24px 24px 24px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand & Target Logo */}
      <div onClick={() => setActiveTab('terminal')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: isPatched ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: isPatched ? '1px solid var(--cyber-green)' : '1px solid var(--cyber-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isPatched ? <ShieldCheck size={24} color="var(--cyber-green)" /> : <ShieldAlert size={24} color="var(--cyber-red)" />}
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
            Cyber<span style={{ color: isPatched ? 'var(--cyber-green)' : 'var(--cyber-red)' }}>Lab</span>.v2
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isPatched ? 'var(--cyber-green)' : 'var(--cyber-red)',
              display: 'inline-block'
            }} />
            TARGET: {isPatched ? 'SECURED / PATCHED MODE' : 'VULNERABLE PENTEST TARGET'}
          </div>
        </div>
      </div>

      {/* Lab Selector Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(5, 8, 15, 0.8)',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid var(--border-cyber)'
      }}>
        {[
          { id: 'sqli', label: 'SQLi Lab' },
          { id: 'xss', label: 'XSS Lab' },
          { id: 'cmd', label: 'CMD/LFI Lab' },
          { id: 'jwt', label: 'JWT Auth' },
          { id: 'upload', label: 'File Upload' },
          { id: 'terminal', label: 'Cyber Terminal' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cyber-btn ${activeTab === tab.id ? 'cyber-btn-cyan' : ''}`}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              border: activeTab === tab.id ? '1px solid var(--cyber-cyan)' : 'none',
              background: activeTab === tab.id ? 'rgba(6, 182, 212, 0.2)' : 'transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mode Switcher & CTF Flag Counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mode Toggle Button */}
        <button
          onClick={() => setIsPatched(!isPatched)}
          className={`cyber-btn ${isPatched ? 'cyber-btn' : 'cyber-btn-red'}`}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          {isPatched ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
          {isPatched ? 'Mode: Patched (Secured)' : 'Mode: Vulnerable (Pentest)'}
        </button>

        {/* CTF Score Badge */}
        <div className="cyber-card" style={{
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderColor: flagCount > 0 ? 'var(--cyber-green)' : 'var(--border-cyber)'
        }}>
          <Award size={18} color="var(--cyber-amber)" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600 }}>CTF FLAGS</div>
            <div className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: 'var(--cyber-amber)' }}>
              {flagCount} / 5 CAPTURED
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
