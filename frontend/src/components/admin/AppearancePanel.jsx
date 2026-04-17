import React from 'react';
import { Type, Globe, Upload, CheckCircle } from 'lucide-react';

/**
 * AppearancePanel (Minimalist Version)
 * Streamlined to core identity essentials: Favicon, Title, and SEO Description.
 */
const AppearancePanel = ({ customization, setCustomization, onUpdateSettings }) => {
  return (
    <div className="appearance-root">
      <form onSubmit={onUpdateSettings}>
        <div className="panel-grid">
          
          {/* Unified Identity Card */}
          <div className="admin-card-premium">
            <p className="admin-heading-premium">
              <Globe size={14} style={{ marginRight: '8px' }} /> 
              Website Identity & SEO
            </p>
            
            <div className="form-column">
              {/* 1. WEBSITE TITLE TAG */}
              <div className="form-group">
                <label className="admin-label-premium">Website Title Tag</label>
                <input 
                  type="text" 
                  className="admin-input-premium" 
                  value={customization.site_title || ''} 
                  onChange={(e) => setCustomization({ ...customization, site_title: e.target.value })} 
                  placeholder="e.g. Josef Nhidi | Professional Photographer" 
                />
                <p className="upload-hint">The title displayed on browser tabs and search links.</p>
              </div>

              {/* 2. META DESCRIPTION */}
              <div className="form-group">
                <label className="admin-label-premium">Meta Description</label>
                <textarea 
                  className="admin-input-premium" 
                  value={customization.seo_description || ''} 
                  placeholder="Appears in search results (max 160 characters)..."
                  rows={4}
                  onChange={(e) => setCustomization({ ...customization, seo_description: e.target.value })} 
                />
                <p className="upload-hint">A brief summary of your site for search engines.</p>
              </div>

              <div className="divider" />

              {/* 3. WEBSITE FAVICON */}
              <div className="form-group">
                <label className="admin-label-premium">Website Favicon / SEO Image</label>
                <div className="branding-upload-area">
                  <div className="logo-preview-box">
                    {customization.site_logo ? (
                      <img src={customization.site_logo} alt="Site Favicon" className="logo-preview-img" />
                    ) : (
                      <div className="logo-placeholder">No Favicon</div>
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
                      Replace Favicon
                    </label>
                    <p className="upload-hint">This image appears in browser tabs and search snippets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Action */}
        <div className="sticky-action">
          <button type="submit" className="btn-save-settings">
            <CheckCircle size={18} /> Update Studio Identity
          </button>
        </div>
      </form>

      <style jsx="true">{`
        .appearance-root { padding-bottom: 5rem; }
        .panel-grid { max-width: 800px; margin: 0 auto; }
        
        /* Premium Card Standard */
        .admin-card-premium {
          background: var(--admin-panel);
          border: 1px solid var(--admin-border);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: var(--shadow-premium);
          margin-bottom: 2rem;
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

        .form-column { display: flex; flex-direction: column; gap: 2rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        
        .admin-label-premium {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--admin-text-soft);
          font-weight: 800;
        }

        .admin-input-premium {
          background: var(--admin-bg);
          border: 1px solid var(--admin-border);
          color: var(--admin-text);
          padding: 1.1rem;
          border-radius: 12px;
          font-family: var(--font-body);
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
          width: 100%;
          resize: none;
        }

        .admin-input-premium:focus {
          border-color: var(--admin-accent);
          background: var(--admin-panel);
          box-shadow: var(--shadow-focus);
        }

        .divider { height: 1px; background: var(--admin-border); margin: 0.5rem 0; opacity: 0.5; }

        /* Upload Area */
        .branding-upload-area { 
          display: flex; 
          gap: 2rem; 
          align-items: center; 
          background: var(--admin-bg); 
          padding: 1.5rem; 
          border-radius: 16px; 
          border: 1px dashed var(--admin-border); 
        }
        .logo-preview-box { 
          width: 100px; 
          height: 100px; 
          background: var(--admin-panel); 
          border: 1px solid var(--admin-border); 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          overflow: hidden; 
          box-shadow: var(--shadow-sm); 
        }
        .logo-preview-img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
        .logo-placeholder { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; opacity: 0.4; text-align: center; }
        
        .upload-controls { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
        .hidden-file-input { display: none; }
        
        .btn-upload { 
          background: var(--admin-panel); 
          border: 1px solid var(--admin-border); 
          color: var(--admin-text); 
          padding: 0.8rem 1.2rem; 
          border-radius: 10px; 
          font-size: 0.8rem; 
          font-weight: 700; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 0.75rem; 
          transition: all 0.2s; 
        }
        .btn-upload:hover { border-color: var(--admin-accent); color: var(--admin-accent); }
        .upload-hint { font-size: 0.7rem; color: var(--admin-text-soft); opacity: 0.6; line-height: 1.4; }

        /* Save Button */
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

        @media (max-width: 600px) {
          .branding-upload-area { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
};

export default AppearancePanel;
