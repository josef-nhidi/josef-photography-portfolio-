import React from 'react';
import { Lock, ShieldCheck, Mail, KeyRound, AlertTriangle } from 'lucide-react';

const SecurityPanel = ({ credentials, setCredentials, onUpdateCredentials }) => {
  return (
    <div className="security-root">
      <div className="panel-grid">
        <div className="admin-card-premium main-form">
          <p className="admin-heading-premium"><ShieldCheck size={14} style={{marginRight: '8px'}} /> Administrator Credentials</p>
          
          <form onSubmit={onUpdateCredentials}>
            <div className="form-column">
              <div className="form-group">
                <label className="admin-label-premium">Admin Email/Username</label>
                <div className="input-with-icon">
                  <Mail size={14} />
                  <input 
                    type="text" 
                    className="admin-input-premium" 
                    value={credentials.email} 
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                    placeholder="e.g. josef@photography.com" 
                    required 
                  />
                </div>
              </div>

              <div className="divider"></div>

               <div className="form-group">
                <label className="admin-label-premium">New Password</label>
                <div className="input-with-icon">
                  <KeyRound size={14} />
                  <input 
                    type="password" 
                    className="admin-input-premium" 
                    value={credentials.password} 
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                    placeholder="Leave blank to keep current" 
                  />
                </div>
              </div>

               <div className="form-group">
                <label className="admin-label-premium">Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={14} />
                  <input 
                    type="password" 
                    className="admin-input-premium" 
                    value={credentials.password_confirmation} 
                    onChange={(e) => setCredentials({...credentials, password_confirmation: e.target.value})} 
                    placeholder="Repeat new password" 
                  />
                </div>
              </div>

              <div className="warning-box">
                <AlertTriangle size={16} />
                <div>
                  <p>Changing these credentials will take effect immediately.</p>
                  <p>You will be logged out and required to sign in with your new email/password.</p>
                </div>
              </div>

              <button type="submit" className="btn-save-security">
                Update Security Credentials
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card-premium info-card">
          <p className="admin-heading-premium">Security Status</p>
          <div className="status-item">
             <div className="status-dot active"></div>
             <div>
                <strong>Two-Factor Authentication</strong>
                <p>Not currently configured for this account.</p>
             </div>
          </div>
          <div className="status-item">
             <div className="status-dot active"></div>
             <div>
                <strong>Session Management</strong>
                <p>Your current session is active and secure.</p>
             </div>
          </div>
          
          <div className="security-tip">
             <ShieldCheck size={24} />
             <p>Use a pass phrase that is unique to this portfolio dashboard for maximum protection of your creative assets.</p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .security-root { }
        .panel-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; align-items: start; }
        .panel-card { background: var(--admin-panel, white); border: 1px solid var(--admin-border, rgba(0,0,0,0.06)); border-radius: 12px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .panel-card-title { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--admin-text-soft); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2rem; display: flex; align-items: center; opacity: 0.6; }
 
        .form-column { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12rem; color: var(--admin-text-soft); font-weight: 700; opacity: 0.8; }
        
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon svg { position: absolute; left: 0.95rem; color: var(--admin-text-soft); pointer-events: none; opacity: 0.5; }
        .form-input { background: var(--admin-bg); border: 1px solid var(--admin-border); color: var(--admin-text); padding: 0.9rem 0.9rem 0.9rem 2.8rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: all 0.2s; width: 100%; }
        .form-input:focus { border-color: var(--admin-accent); background: var(--admin-panel); box-shadow: 0 4px 12px rgba(37,99,235,0.05); }

        .divider { height: 1px; background: var(--admin-border); margin: 0.5rem 0; opacity: 0.5; }

        .warning-box { background: rgba(245, 158, 11, 0.05); border: 1px dashed rgba(245, 158, 11, 0.2); border-radius: 10px; padding: 1.25rem; display: flex; gap: 1.2rem; align-items: flex-start; }
        .warning-box svg { color: #f59e0b; flex-shrink: 0; margin-top: 0.1rem; }
        .warning-box p { font-size: 0.75rem; color: #f59e0b; line-height: 1.5; margin: 0; font-weight: 500; }

        .btn-save-security { background: var(--admin-panel); color: var(--admin-text-soft); border: 1px solid var(--admin-border); padding: 0.9rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.25s; }
        .btn-save-security:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(239, 68, 68, 0.15); }

        /* Status card */
        .status-item { display: flex; gap: 1.25rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--admin-border); }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #10b981; margin-top: 0.35rem; flex-shrink: 0; box-shadow: 0 0 12px rgba(16, 185, 129, 0.3); }
        .status-dot.active { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .status-item strong { display: block; font-size: 0.9rem; color: var(--admin-text); margin-bottom: 0.25rem; font-weight: 700; }
        .status-item p { font-size: 0.78rem; color: var(--admin-text-soft); margin: 0; font-weight: 500; opacity: 0.6; }

        .security-tip { margin-top: 2rem; background: var(--admin-bg); border: 1px solid var(--admin-border); padding: 1.75rem; border-radius: 14px; text-align: center; }
        .security-tip svg { color: var(--admin-accent); margin-bottom: 1.2rem; opacity: 0.3; }
        .security-tip p { font-size: 0.75rem; color: var(--admin-text-soft); line-height: 1.6; margin: 0; font-style: italic; font-weight: 500; opacity: 0.6; }

        @media (max-width: 900px) {
          .panel-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default SecurityPanel;
