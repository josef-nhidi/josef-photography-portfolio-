import React from 'react';
import { Palette, Type, Search, Globe, Layout, CheckCircle, Upload } from 'lucide-react';

const AppearancePanel = ({ customization, setCustomization, onUpdateSettings }) => {
  return (
    <div className="appearance-root">
      <form onSubmit={onUpdateSettings}>
        <div className="panel-grid">
          {/* Visual Style */}
          <div className="panel-card">
            <p className="panel-card-title"><Palette size={14} style={{marginRight: '8px'}} /> Site Theme</p>
            <div className="color-grid">
              <div className="color-input-group">
                <label className="form-label">Primary Text</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={customization.primary_color || '#050505'} onChange={(e) => setCustomization({...customization, primary_color: e.target.value})} />
                  <span className="color-code">{customization.primary_color}</span>
                </div>
              </div>
              <div className="color-input-group">
                <label className="form-label">Accent Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={customization.accent_color || '#2563eb'} onChange={(e) => setCustomization({...customization, accent_color: e.target.value})} />
                  <span className="color-code">{customization.accent_color}</span>
                </div>
              </div>
              <div className="color-input-group">
                <label className="form-label">Background</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={customization.bg_color || '#ffffff'} onChange={(e) => setCustomization({...customization, bg_color: e.target.value})} />
                  <span className="color-code">{customization.bg_color}</span>
                </div>
              </div>
            </div>
            
            <div className="info-box">
              <p>Accent blue is the default. Changing this updates your logo accent, active links, and various UI highlights across the portfolio.</p>
            </div>
          </div>

          {/* Branding Content */}
          <div className="panel-card">
            <p className="panel-card-title"><Type size={14} style={{marginRight: '8px'}} /> Branding & Identity</p>
            <div className="form-column">
               <div className="form-group">
                <label className="form-label">Site Title (Tab Name)</label>
                <input type="text" className="form-input" value={customization.site_title || ''} onChange={(e) => setCustomization({...customization, site_title: e.target.value})} placeholder="e.g. Josef Photography Portfilio" />
              </div>
              <div className="form-group">
                <label className="form-label">Navigation Logo Text</label>
                <input type="text" className="form-input" value={customization.logo_text || ''} placeholder="e.g. JOSEF NHIDI" onChange={(e) => setCustomization({...customization, logo_text: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Site Tagline</label>
                <input type="text" className="form-input" value={customization.site_tagline || ''} onChange={(e) => setCustomization({...customization, site_tagline: e.target.value})} placeholder="Exclusive Events & Portraits" />
              </div>
            </div>
          </div>

          {/* Branding & SEO Section */}
          <div className="panel-card">
            <p className="panel-card-title"><Globe size={14} style={{marginRight: '8px'}} /> Branding & SEO</p>
            <p className="panel-desc">Manage your professional branding, logos, and global SEO imagery.</p>
            <div className="form-section">
              <div className="form-group full-width">
                <label className="form-label">Site Logo / SEO Image (512x512 recommended)</label>
                <div className="branding-upload-area">
                  <div className="logo-preview-box">
                    {customization.site_logo ? (
                      <img src={customization.site_logo} alt="Site Logo" className="logo-preview-img" />
                    ) : (
                      <div className="logo-placeholder">No Logo Set</div>
                    )}
                  </div>
                  <div className="upload-controls">
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="site_logo_file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setCustomization(prev => ({ ...prev, site_logo_file: file }));
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCustomization(prev => ({ ...prev, site_logo: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden-file-input"
                    />
                    <label htmlFor="site_logo_file" className="btn-upload">
                      <Upload size={18} />
                      Change Logo
                    </label>
                    <p className="upload-hint">This image appears in Google search results and social previews.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Labels */}
          <div className="panel-card">
            <p className="panel-card-title"><Layout size={14} style={{marginRight: '8px'}} /> Interface Labels</p>
            <div className="form-grid">
               <div className="form-group">
                <label className="form-label">Portraits Tab Label</label>
                <input type="text" className="form-input" value={customization.portraits_label || ''} onChange={(e) => setCustomization({...customization, portraits_label: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Events Tab Label</label>
                <input type="text" className="form-input" value={customization.events_label || ''} onChange={(e) => setCustomization({...customization, events_label: e.target.value})} />
              </div>
               <div className="form-group">
                <label className="form-label">Intro Label (Small)</label>
                <input type="text" className="form-input" value={customization.gallery_tagline || ''} onChange={(e) => setCustomization({...customization, gallery_tagline: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Intro Heading (Large)</label>
                <input type="text" className="form-input" value={customization.gallery_title || ''} onChange={(e) => setCustomization({...customization, gallery_title: e.target.value})} />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="panel-card">
            <p className="panel-card-title"><Search size={14} style={{marginRight: '8px'}} /> SEO & Analytics</p>
            <div className="form-column">
               <div className="form-group">
                <label className="form-label">Meta Description</label>
                <textarea 
                  className="form-textarea" 
                  value={customization.seo_description || ''} 
                  placeholder="Appears in search results..."
                  rows={3}
                  onChange={(e) => setCustomization({...customization, seo_description: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Production URL (Canonical)</label>
                <div className="input-with-icon">
                  <Globe size={14} />
                  <input type="text" className="form-input" value={customization.site_url || ''} placeholder="https://josefnhidi.com" onChange={(e) => setCustomization({...customization, site_url: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Google Site Verification</label>
                <input type="text" className="form-input" value={customization.google_verification_tag || ''} placeholder="ID from Search Console" onChange={(e) => setCustomization({...customization, google_verification_tag: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-action">
           <button type="submit" className="btn-save-settings">
              <CheckCircle size={18} /> Publish Site Changes
            </button>
        </div>
      </form>

      <style jsx="true">{`
        .appearance-root { padding-bottom: 5rem; }
        .panel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; align-items: start; }
        .panel-card { background: var(--admin-panel, white); border: 1px solid var(--admin-border, rgba(0,0,0,0.06)); border-radius: 12px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .panel-card-title { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--admin-text-soft); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; display: flex; align-items: center; opacity: 0.6; }
        
        /* Theme */
        .color-grid { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .color-input-group { flex: 1; min-width: 120px; }
        .color-picker-wrapper { background: var(--admin-bg); padding: 0.5rem; border-radius: 10px; border: 1px solid var(--admin-border); display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .color-picker-wrapper:hover { border-color: var(--admin-accent); background: var(--admin-panel); }
        .color-picker-wrapper input[type="color"] { width: 32px; height: 32px; border-radius: 6px; border: none; background: none; cursor: pointer; -webkit-appearance: none; }
        .color-picker-wrapper input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        .color-picker-wrapper input[type="color"]::-webkit-color-swatch { border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); }
        .color-code { font-family: 'monospace'; font-size: 0.75rem; color: var(--admin-text-soft); text-transform: uppercase; font-weight: 600; opacity: 0.6; }
 
        .info-box { background: var(--admin-active-bg); border: 1px dashed rgba(37,99,235,0.2); border-radius: 10px; padding: 1rem; }
        .info-box p { font-size: 0.75rem; color: var(--admin-accent); line-height: 1.5; margin: 0; font-weight: 500; }
 
        /* Forms */
        .form-column { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.45rem; }
        .form-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12rem; color: var(--admin-text-soft); font-weight: 700; opacity: 0.8; }
        .form-input, .form-textarea { background: var(--admin-bg); border: 1px solid var(--admin-border); color: var(--admin-text); padding: 0.8rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: all 0.2s; width: 100%; resize: none; }
        .form-input:focus, .form-textarea:focus { border-color: var(--admin-accent); background: var(--admin-panel); box-shadow: 0 4px 12px rgba(37,99,235,0.05); }
 
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon svg { position: absolute; left: 0.9rem; color: var(--admin-text-soft); pointer-events: none; opacity: 0.5; }
        .input-with-icon .form-input { padding-left: 2.75rem; }
 
        .sticky-action { margin-top: 2rem; }
        .btn-save-settings { 
          background: var(--admin-accent); 
          color: white; 
          border: none; 
          padding: 1.25rem; 
          border-radius: 14px; 
          font-family: var(--font-body); 
          font-size: 0.95rem; 
          font-weight: 800; 
          width: 100%;
          display: flex; 
          align-items: center; 
          justify-content: center;
          gap: 0.85rem; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          box-shadow: 0 10px 25px rgba(37,99,235,0.25); 
        }
        .btn-save-settings:hover { 
          background: #1d4ed8; 
          transform: translateY(-4px); 
          box-shadow: 0 15px 35px rgba(37,99,235,0.35); 
        }
 
        /* Branding Upload */
        .branding-upload-area { display: flex; gap: 2rem; align-items: center; background: var(--admin-bg); padding: 2rem; border-radius: 12px; border: 1px dashed var(--admin-border); }
        .logo-preview-box { width: 120px; height: 120px; background: var(--admin-panel); border: 1px solid var(--admin-border); border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: var(--shadow-sm); }
        .logo-preview-img { width: 100%; height: 100%; object-fit: contain; padding: 0.5rem; }
        .logo-placeholder { font-size: 0.65rem; color: var(--admin-text-soft); font-weight: 700; text-transform: uppercase; opacity: 0.5; }
        .upload-controls { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
        .hidden-file-input { display: none; }
        .btn-upload { background: var(--admin-panel); border: 1px solid var(--admin-border); color: var(--admin-text); padding: 0.85rem 1.5rem; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: var(--transition); }
        .btn-upload:hover { border-color: var(--admin-accent); color: var(--admin-accent); background: var(--admin-active-bg); }
        .upload-hint { font-size: 0.7rem; color: var(--admin-text-soft); opacity: 0.6; line-height: 1.4; }

        @media (max-width: 800px) {
          .panel-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AppearancePanel;
