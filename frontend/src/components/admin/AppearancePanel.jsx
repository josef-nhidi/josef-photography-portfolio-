import React from 'react';
import { Palette, Type, Search, CheckCircle, Upload, Layout, Globe } from 'lucide-react';

/**
 * AppearancePanel (Full Unified Version)
 * Restored with all management sections: Theme, Branding, Labels, and SEO.
 * All sections use the unified Premium High-Fidelity design system.
 */
const AppearancePanel = ({ customization, setCustomization, onUpdateSettings }) => {
  return (
    <div className="appearance-root">
      <form onSubmit={onUpdateSettings}>
        <div className="panel-columns">
          <div className="admin-column">
            {/* ── 1. VISUAL THEME ── */}
            <div className="admin-card-premium">
              <p className="admin-heading-premium">
                <Palette size={14} style={{ marginRight: '8px' }} /> 
                Site Theme & Atmosphere
              </p>
              <div className="color-grid">
                <div className="color-input-group">
                  <label className="admin-label-premium">Primary Text</label>
                  <div className="color-picker-wrapper">
                    <input type="color" value={customization.primary_color || '#0f172a'} onChange={(e) => setCustomization({ ...customization, primary_color: e.target.value })} />
                    <span className="color-code">{customization.primary_color}</span>
                  </div>
                </div>
                <div className="color-input-group">
                  <label className="admin-label-premium">Accent Color</label>
                  <div className="color-picker-wrapper">
                    <input type="color" value={customization.accent_color || '#2563eb'} onChange={(e) => setCustomization({ ...customization, accent_color: e.target.value })} />
                    <span className="color-code">{customization.accent_color}</span>
                  </div>
                </div>
                <div className="color-input-group">
                  <label className="admin-label-premium">Background</label>
                  <div className="color-picker-wrapper">
                    <input type="color" value={customization.bg_color || '#f8fafc'} onChange={(e) => setCustomization({ ...customization, bg_color: e.target.value })} />
                    <span className="color-code">{customization.bg_color}</span>
                  </div>
                </div>
              </div>
              <div className="info-box-premium">
                <p>Updates logo accents, active links, and various UI highlights across the portfolio.</p>
              </div>
            </div>

            {/* ── 3. WEBSITE FAVICON ── */}
            <div className="admin-card-premium">
              <p className="admin-heading-premium">
                <Globe size={14} style={{ marginRight: '8px' }} /> 
                Website Favicon & Global SEO Image
              </p>
              <div className="form-column">
                <div className="form-group">
                  <label className="admin-label-premium">Site Logo / Favicon (512x512 recommended)</label>
                  <div className="branding-upload-area">
                    <div className="logo-preview-box">
                      {customization.site_logo ? (
                        <img src={customization.site_logo} alt="Site Logo" className="logo-preview-img" />
                      ) : (
                        <div className="logo-placeholder">No Favicon</div>
                      )}
                    </div>
                    <div className="upload-controls">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="site_logo_file_restored"
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
                      <label htmlFor="site_logo_file_restored" className="btn-upload-premium">
                        <Upload size={18} />
                        Replace Favicon
                      </label>
                      <p className="upload-hint">Appears in Google search results and browser tabs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 5. SEO & SEARCH AUTHORITY ── */}
            <div className="admin-card-premium">
              <p className="admin-heading-premium">
                <Search size={14} style={{ marginRight: '8px' }} /> 
                SEO Metadata & Search Snippets
              </p>
              <div className="form-column">
                <div className="form-group">
                  <label className="admin-label-premium">Meta Description (Search Snippet)</label>
                  <textarea 
                    className="admin-input-premium" 
                    value={customization.seo_description || ''} 
                    placeholder="Appears in search results (max 160 characters)..."
                    rows={3}
                    onChange={(e) => setCustomization({ ...customization, seo_description: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium">Meta Keywords</label>
                  <input 
                    type="text" 
                    className="admin-input-premium" 
                    value={customization.seo_keywords || ''} 
                    placeholder="e.g. josef photography, Tunisia photographer" 
                    onChange={(e) => setCustomization({ ...customization, seo_keywords: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-column">
            {/* ── 2. BRANDING IDENTITY ── */}
            <div className="admin-card-premium">
              <p className="admin-heading-premium">
                <Type size={14} style={{ marginRight: '8px' }} /> 
                Branding & Tab Identity
              </p>
              <div className="form-column">
                <div className="form-group">
                  <label className="admin-label-premium">Website Title (Tab Name)</label>
                  <input 
                    type="text" 
                    className="admin-input-premium" 
                    value={customization.site_title || ''} 
                    onChange={(e) => setCustomization({ ...customization, site_title: e.target.value })} 
                    placeholder="e.g. Josef Nhidi | Professional Photographer" 
                  />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium">Navigation Logo Text</label>
                  <input 
                    type="text" 
                    className="admin-input-premium" 
                    value={customization.logo_text || ''} 
                    placeholder="e.g. JOSEF NHIDI" 
                    onChange={(e) => setCustomization({ ...customization, logo_text: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium">Site Tagline</label>
                  <input 
                    type="text" 
                    className="admin-input-premium" 
                    value={customization.site_tagline || ''} 
                    onChange={(e) => setCustomization({ ...customization, site_tagline: e.target.value })} 
                    placeholder="e.g. Exclusive Events & Portraits" 
                  />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium">Browser Tab Format</label>
                  <input 
                    type="text" 
                    className="admin-input-premium" 
                    value={customization.title_format || '{page} | {site}'} 
                    onChange={(e) => setCustomization({ ...customization, title_format: e.target.value })} 
                    placeholder="e.g. {page} - {site} or {site} • {page}" 
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-soft)', marginTop: '-0.3rem' }}>Use <strong>{page}</strong> for the tab name and <strong>{site}</strong> for website title.</span>
                </div>
              </div>
            </div>

            {/* ── 4. INTERFACE LABELS ── */}
            <div className="admin-card-premium">
              <p className="admin-heading-premium">
                <Layout size={14} style={{ marginRight: '8px' }} /> 
                Gallery & Navigation Labels
              </p>
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="admin-label-premium">Portraits Tab Label</label>
                  <input type="text" className="admin-input-premium" value={customization.portraits_label || 'Portraits'} onChange={(e) => setCustomization({ ...customization, portraits_label: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium">Events Tab Label</label>
                  <input type="text" className="admin-input-premium" value={customization.events_label || 'Events'} onChange={(e) => setCustomization({ ...customization, events_label: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium">Intro Label (Small)</label>
                  <input type="text" className="admin-input-premium" value={customization.gallery_tagline || ''} onChange={(e) => setCustomization({ ...customization, gallery_tagline: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium">Intro Heading (Large)</label>
                  <input type="text" className="admin-input-premium" value={customization.gallery_title || ''} onChange={(e) => setCustomization({ ...customization, gallery_title: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Action */}
        <div className="admin-action-footer">
          <button type="submit" className="btn-publish-premium">
            <CheckCircle size={18} /> Publish Studio Identity
          </button>
        </div>
      </form>

      <style jsx="true">{`
        .appearance-root { padding-bottom: 5rem; }
        .panel-columns { display: flex; gap: 2rem; align-items: flex-start; }
        .admin-column { flex: 1; display: flex; flex-direction: column; gap: 2rem; min-width: 450px; }
        
        .admin-card-premium {
          background: var(--admin-panel);
          border: 1px solid var(--admin-border);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: var(--shadow-premium);
        }

        .admin-heading-premium {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--admin-accent);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
        }

        .color-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
        .color-input-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .color-picker-wrapper { background: var(--admin-bg); padding: 0.5rem; border-radius: 12px; border: 1px solid var(--admin-border); display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .color-picker-wrapper input[type="color"] { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; }
        .color-code { font-family: 'monospace'; font-size: 0.7rem; color: var(--admin-text-soft); font-weight: 700; text-transform: uppercase; opacity: 0.6; }

        .info-box-premium { background: var(--admin-active-bg); border-radius: 12px; padding: 1rem; border: 1px dashed rgba(37,99,235,0.2); }
        .info-box-premium p { font-size: 0.75rem; color: var(--admin-accent); font-weight: 600; margin: 0; line-height: 1.4; }

        .form-column { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        
        .admin-label-premium { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--admin-text-soft); font-weight: 800; }
        .admin-input-premium { background: var(--admin-bg); border: 1px solid var(--admin-border); color: var(--admin-text); padding: 1.1rem; border-radius: 14px; font-family: var(--font-body); font-size: 0.95rem; outline: none; transition: all 0.2s; width: 100%; resize: none; }
        .admin-input-premium:focus { border-color: var(--admin-accent); background: var(--admin-panel); box-shadow: var(--shadow-focus); }

        .branding-upload-area { display: flex; gap: 2rem; align-items: center; background: var(--admin-bg); padding: 2rem; border-radius: 20px; border: 1px dashed var(--admin-border); }
        .logo-preview-box { width: 120px; height: 120px; background: var(--admin-panel); border: 1px solid var(--admin-border); border-radius: 16px; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: var(--shadow-sm); }
        .logo-preview-img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
        .logo-placeholder { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; opacity: 0.4; }
        
        .upload-controls { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
        .hidden-file-input { display: none; }
        .btn-upload-premium { background: var(--admin-panel); border: 1px solid var(--admin-border); color: var(--admin-text); padding: 0.85rem 1.5rem; border-radius: 12px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.2s; }
        .btn-upload-premium:hover { border-color: var(--admin-accent); color: var(--admin-accent); }
        .upload-hint { font-size: 0.7rem; color: var(--admin-text-soft); opacity: 0.6; line-height: 1.4; }

        .admin-action-footer { 
          margin-top: 3rem; 
          display: flex; 
          justify-content: flex-end; 
          border-top: 1px solid var(--admin-border);
          padding-top: 2rem;
        }

        .btn-publish-premium { 
          background: var(--admin-accent); 
          color: white; 
          border: none; 
          padding: 0.85rem 2.5rem; 
          border-radius: 14px; 
          font-family: var(--font-body); 
          font-size: 0.9rem; 
          font-weight: 800; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          gap: 0.75rem; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          box-shadow: 0 8px 20px rgba(37,99,235,0.2); 
        }

        .btn-publish-premium:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 12px 30px rgba(37,99,235,0.3); 
          background: #1d4ed8; 
        }

        @media (max-width: 1024px) { 
          .panel-columns { flex-direction: column; } 
          .admin-column { min-width: 100%; }
        }
        @media (max-width: 600px) { .form-grid-2col { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AppearancePanel;
