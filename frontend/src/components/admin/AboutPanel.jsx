import React, { useRef } from 'react';
import { Save, Plus, X, Globe, Mail, Phone, MapPin, FileText, MessageSquare } from 'lucide-react';

const AboutPanel = ({ about, setAbout, aboutImage, setAboutImage, onUpdateAbout }) => {
  const fileRef = useRef(null);

  const addSocialLink = () => {
    setAbout({ ...about, social_links: [...about.social_links, { platform: '', url: '' }] });
  };

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...about.social_links];
    newLinks[index][field] = value;
    setAbout({ ...about, social_links: newLinks });
  };

  const removeSocialLink = (index) => {
    const newLinks = about.social_links.filter((_, i) => i !== index);
    setAbout({ ...about, social_links: newLinks });
  };

  return (
    <div className="about-root">
      <form onSubmit={onUpdateAbout}>
        <div className="panel-grid">
          {/* Main Info */}
          <div className="admin-card-premium main-info">
            <p className="admin-heading-premium"><FileText size={14} style={{marginRight: '8px'}} /> Biography & Vision</p>
            
            <div className="profile-upload-section">
              <div className="profile-preview-wrapper" onClick={() => fileRef.current?.click()}>
                 <input 
                    ref={fileRef}
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => setAboutImage(e.target.files[0])} 
                 />
                 {aboutImage ? (
                    <img src={URL.createObjectURL(aboutImage)} alt="Preview" className="profile-img" />
                 ) : about.profile_image_url ? (
                    <img src={about.profile_image_url} alt="Profile" className="profile-img" />
                 ) : (
                    <div className="profile-placeholder">NO IMAGE</div>
                 )}
                 <div className="profile-upload-overlay">
                    <span>Change Image</span>
                 </div>
              </div>
              <div className="profile-upload-info">
                <p className="upload-tip">Profile Portrait</p>
                <small>Recommended: Square 800x800px</small>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '2.5rem' }}>
              <label className="admin-label-premium">Artist Biography</label>
              <textarea 
                className="admin-input-premium" 
                value={about.bio} 
                onChange={(e) => setAbout({...about, bio: e.target.value})} 
                placeholder="Write your story..."
                rows={10}
                required
              />
            </div>
          </div>

          <div className="right-column">
             {/* Contact Info */}
            <div className="admin-card-premium">
              <p className="admin-heading-premium"><MessageSquare size={14} style={{marginRight: '8px'}} /> Contact & Studio</p>
              <div className="form-column">
                <div className="form-group">
                  <label className="admin-label-premium"><Mail size={12} style={{marginRight: '6px'}} /> Email Address</label>
                  <input type="email" className="admin-input-premium" value={about.email} onChange={(e) => setAbout({...about, email: e.target.value})} placeholder="hello@josefnhidi.com" />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium"><Phone size={12} style={{marginRight: '6px'}} /> Phone Number</label>
                  <input type="text" className="admin-input-premium" value={about.phone} onChange={(e) => setAbout({...about, phone: e.target.value})} placeholder="+216 ..." />
                </div>
                <div className="form-group">
                  <label className="admin-label-premium"><MapPin size={12} style={{marginRight: '6px'}} /> Studio Address</label>
                  <input type="text" className="admin-input-premium" value={about.address} onChange={(e) => setAbout({...about, address: e.target.value})} placeholder="Sousse, Tunisia" />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="admin-card-premium social-card">
              <div className="card-header">
                <p className="admin-heading-premium" style={{marginBottom: 0}}><Globe size={14} style={{marginRight: '8px'}} /> Social Links</p>
                <button type="button" onClick={addSocialLink} className="btn-add-social">
                  <Plus size={12} /> Add
                </button>
              </div>
              
              <div className="social-links-list">
                {about.social_links.length === 0 && (
                  <p className="empty-hint">No social links added yet.</p>
                )}
                {about.social_links.map((link, index) => (
                  <div key={index} className="social-row">
                    <input 
                      type="text" 
                      className="admin-input-premium row-platform" 
                      placeholder="Instagram" 
                      value={link.platform} 
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)} 
                    />
                    <input 
                      type="url" 
                      className="admin-input-premium row-url" 
                      placeholder="URL" 
                      value={link.url} 
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)} 
                    />
                    <button type="button" onClick={() => removeSocialLink(index)} className="btn-remove">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-save-all">
              <Save size={18} /> Save Core Details
            </button>
          </div>
        </div>
      </form>

      <style jsx="true">{`
        .about-root { padding-bottom: 5rem; }
        .panel-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; align-items: start; }
        .panel-card { background: var(--admin-panel, white); border: 1px solid var(--admin-border, rgba(0,0,0,0.06)); border-radius: 12px; padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .panel-card-title { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--admin-text-soft); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; opacity: 0.6; }
        
        .right-column { display: flex; flex-direction: column; }
 
        .profile-upload-section { display: flex; align-items: center; gap: 1.5rem; }
        .profile-preview-wrapper { width: 100px; height: 100px; border-radius: 14px; overflow: hidden; position: relative; background: var(--admin-bg); border: 1px solid var(--admin-border); cursor: pointer; flex-shrink: 0; transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1); }
        .profile-preview-wrapper:hover { transform: scale(1.02); border-color: var(--admin-accent); }
        .profile-img { width: 100%; height: 100%; object-fit: cover; }
        .profile-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: var(--admin-text-soft); font-weight: 800; text-align: center; padding: 0.5rem; letter-spacing: 0.05em; opacity: 0.4; }
        .profile-upload-overlay { position: absolute; inset: 0; background: rgba(37,99,235,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.25s; }
        .profile-preview-wrapper:hover .profile-upload-overlay { opacity: 1; }
        .profile-upload-overlay span { font-size: 0.65rem; color: white; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; }
        .profile-upload-info { display: flex; flex-direction: column; gap: 0.2rem; }
        .upload-tip { font-size: 0.95rem; color: var(--admin-text); font-weight: 700; }
        .profile-upload-info small { font-size: 0.72rem; color: var(--admin-text-soft); font-weight: 500; opacity: 0.6; }
  
        .form-column { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.45rem; }
        .form-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12rem; color: var(--admin-text-soft); font-weight: 700; display: flex; align-items: center; opacity: 0.8; }
        .form-input, .form-textarea { background: var(--admin-bg); border: 1px solid var(--admin-border); color: var(--admin-text); padding: 0.85rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: all 0.2s; width: 100%; resize: none; }
        .form-input:focus, .form-textarea:focus { border-color: var(--admin-accent); background: var(--admin-panel); box-shadow: 0 4px 12px rgba(37,99,235,0.05); }
 
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .btn-add-social { background: var(--admin-active-bg); border: 1px solid rgba(37,99,235,0.1); color: var(--admin-accent); padding: 0.4rem 0.9rem; border-radius: 8px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s; }
        .btn-add-social:hover { background: var(--admin-accent); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
 
        .social-links-list { display: flex; flex-direction: column; gap: 0.85rem; }
        .social-row { display: flex; gap: 0.6rem; }
        .row-platform { width: 110px; flex-shrink: 0; }
        .row-url { flex: 1; min-width: 0; }
        .btn-remove { background: var(--admin-bg); border: 1px solid var(--admin-border); color: var(--admin-text-soft); width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .btn-remove:hover { border-color: #fecaca; color: #ef4444; background: #fee2e2; transform: scale(0.95); }
  
        .btn-save-all { background: var(--admin-accent); color: white; border: none; padding: 1.1rem; border-radius: 14px; font-family: var(--font-body); font-size: 0.95rem; font-weight: 800; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.85rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-top: 0.5rem; box-shadow: 0 10px 25px rgba(37,99,235,0.25); }
        .btn-save-all:hover { background: #1d4ed8; transform: translateY(-4px); box-shadow: 0 15px 35px rgba(37,99,235,0.35); }
        .empty-hint { font-size: 0.85rem; color: var(--admin-text-soft); text-align: center; padding: 1.5rem 0; font-style: italic; opacity: 0.4; }

        @media (max-width: 1100px) {
          .panel-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AboutPanel;
