import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, LogOut, Edit2, Plus, X, AlertCircle, CheckCircle2, BarChart2, Eye, Camera, FolderOpen } from 'lucide-react';

const AdminDashboard = ({ setIsAdmin }) => {
  const [activeTab, setActiveTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [about, setAbout] = useState({ bio: '', email: '', phone: '', address: '', social_links: [] });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState({});
  const [aboutImage, setAboutImage] = useState(null);
  const navigate = useNavigate();

  // Modals status
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  
  // Custom Alert & Confirm Modals
  const [alertConfig, setAlertConfig] = useState(null); // { message, isError }
  const [confirmConfig, setConfirmConfig] = useState(null); // { message, onConfirm }

  // Upload/Add status
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState('portrait');
  const [uploadAlbumId, setUploadAlbumId] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);

  const [credentials, setCredentials] = useState({ email: '', password: '', password_confirmation: '' });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) navigate('/admin/josef/login');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } };
      const [photosRes, albumsRes, aboutRes, analyticsRes, settingsRes] = await Promise.all([
        api.get('/photos'),
        api.get('/albums'),
        api.get('/about'),
        api.get('/admin/analytics'),
        api.get('/settings'),
      ]);
      setPhotos(photosRes.data);
      setAlbums(albumsRes.data);
      setAnalytics(analyticsRes.data);
      setCustomization(settingsRes.data);
      
      const aboutData = aboutRes.data;
      let parsedLinks = [];
      try {
        if (typeof aboutData.social_links === 'string') {
          parsedLinks = JSON.parse(aboutData.social_links);
        } else if (Array.isArray(aboutData.social_links)) {
          parsedLinks = aboutData.social_links;
        }
      } catch(e) {}

      setAbout({
        bio: aboutData.bio || '',
        email: aboutData.email || '',
        phone: aboutData.phone || '',
        address: aboutData.address || '',
        social_links: parsedLinks,
        profile_image_url: aboutData.profile_image_url || ''
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token');
        setIsAdmin(false);
        navigate('/admin/josef/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    navigate('/admin/login');
  };

  const showAlert = (message, isError = false) => setAlertConfig({ message, isError });
  const showConfirm = (message, onConfirm) => setConfirmConfig({ message, onConfirm });

  // --- PHOTOS ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if(uploadFiles.length === 0) return showAlert('Please select at least one photo.', true);

    setUploadProgress(`Uploading 1 of ${uploadFiles.length}...`);
    
    for (let i = 0; i < uploadFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${uploadFiles.length}...`);
        const file = uploadFiles[i];
        const formData = new FormData();
        formData.append('image', file);
        
        let finalCategory = uploadCategory;
        if (uploadAlbumId) {
          const selectedAlbum = albums.find(a => a.id === parseInt(uploadAlbumId));
          if (selectedAlbum) finalCategory = selectedAlbum.type;
        }
        
        formData.append('category', finalCategory);
        
        // Auto-generate title from filename (removing extension)
        const title = file.name.split('.').slice(0, -1).join('.');
        formData.append('title', title);
        
        if(uploadAlbumId) formData.append('album_id', uploadAlbumId);

        try {
          const config = { headers: { 'Content-Type': 'multipart/form-data' }};
          await api.post('/admin/photos', formData, config);
        } catch (err) { 
          console.error('Upload failed for', file.name); 
        }
    }

    fetchData();
    showAlert(`${uploadFiles.length} photos uploaded, watermarked, & optimized to WebP!`);
    setUploadFiles([]);
    setUploadProgress(null);
    e.target.reset();
  };

  const handleDeletePhoto = (id) => {
    showConfirm('Are you sure you want to delete this photo?', async () => {
        try {
          await api.delete(`/admin/photos/${id}`);
          fetchData();
          showAlert('Photo deleted.');
        } catch (err) { showAlert('Error during deletion.', true); }
    });
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/photos/${editingPhoto.id}`, {
        title: editingPhoto.title,
        category: editingPhoto.category,
        album_id: editingPhoto.album_id
      });
      fetchData();
      setEditingPhoto(null);
      showAlert('Photo details updated.');
    } catch (err) { showAlert('Error updating photo.', true); }
  };

  // --- ALBUMS ---
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/albums', { name: e.target.name.value, type: e.target.type.value });
      fetchData();
      e.target.reset();
      showAlert('Album created successfully!');
    } catch (err) { showAlert('Error creating album.', true); }
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/albums/${editingAlbum.id}`, {
        name: editingAlbum.name,
        type: editingAlbum.type
      });
      fetchData();
      setEditingAlbum(null);
      showAlert('Album details updated.');
    } catch (err) { showAlert('Error updating album.', true); }
  };

  const handleDeleteAlbum = (id) => {
    showConfirm('Delete this album? Photos inside will NOT be deleted, only unassigned.', async () => {
        try {
          await api.delete(`/admin/albums/${id}`);
          fetchData();
          showAlert('Album successfully deleted.');
        } catch (err) { showAlert('Error deleting album.', true); }
    });
  };

  // --- ABOUT ---
  const handleUpdateAbout = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bio', about.bio);
    formData.append('email', about.email || '');
    formData.append('phone', about.phone || '');
    formData.append('address', about.address || '');
    formData.append('social_links', JSON.stringify(about.social_links));
    if (aboutImage) {
      formData.append('image', aboutImage);
    }

    try {
      await api.post('/admin/about', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      setAboutImage(null);
      fetchData();
      showAlert('About Content Updated!');
    } catch (err) { showAlert('Error updating about content.', true); }
  };

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

  // --- SETTINGS ---
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if(credentials.password && credentials.password !== credentials.password_confirmation) {
        return showAlert('Passwords do not match.', true);
    }
    try {
      await api.put('/admin/credentials', credentials);
      showAlert('Credentials updated! Please login again.');
      setTimeout(() => handleLogout(), 2000);
    } catch (err) { showAlert('Error updating credentials.', true); }
  };


  
  // --- CUSTOMIZATION ---
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', customization);
      showAlert('Site Appearance Updated! Page will refresh to apply changes.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) { showAlert('Error updating site settings.', true); }
  };

  if (loading) return <div className="container" style={{ paddingTop: '10rem' }}>Loading...</div>;

  return (
    <div className="admin-container" style={{ paddingTop: '5rem' }}>
      <div className="container">
        <header className="admin-header">
          <h1>DASHBOARD</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="admin-tabs">
          <button className={activeTab === 'photos' ? 'active' : ''} onClick={() => setActiveTab('photos')}>Photos</button>
          <button className={activeTab === 'albums' ? 'active' : ''} onClick={() => setActiveTab('albums')}>Albums</button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>About Content</button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>
          <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>Analytics</button>
          <button className={activeTab === 'customization' ? 'active' : ''} onClick={() => setActiveTab('customization')}>Customization</button>
        </div>

        {/* --- PHOTOS TAB --- */}
        {activeTab === 'photos' && (
          <div className="tab-content fade-in">
            <section className="upload-section">
              <h3>Batch Upload Photos</h3>
              <form onSubmit={handleUpload} className="upload-form">
                <input type="file" multiple onChange={(e) => setUploadFiles(e.target.files)} required />
                <select value={uploadAlbumId} onChange={(e) => {
                  const val = e.target.value;
                  setUploadAlbumId(val);
                  if (val) {
                    const selectedAlbum = albums.find(a => a.id === parseInt(val));
                    if (selectedAlbum) setUploadCategory(selectedAlbum.type);
                  }
                }}>
                  <option value="">No Album Assignment</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>{album.name}</option>
                  ))}
                </select>
                <select 
                  value={uploadCategory} 
                  onChange={(e) => setUploadCategory(e.target.value)}
                  disabled={!!uploadAlbumId}
                  style={uploadAlbumId ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  <option value="portrait">Portrait</option>
                  <option value="event">Event</option>
                </select>
                <button type="submit" disabled={!!uploadProgress}>
                  {uploadProgress ? uploadProgress : <><Upload size={18} /> Upload All</>}
                </button>
              </form>
            </section>

            <section className="photos-grid">
              <h3>Manage Library</h3>
              <div className="grid">
                {photos.map(photo => (
                  <div key={photo.id} className="grid-item">
                    <img src={photo.url} alt={photo.title || 'Photo'} />
                    <div className="grid-info">
                       <div className="photo-meta">
                          <strong>{photo.title || 'Untitled'}</strong>
                          <small>{photo.category} {photo.album_id ? `• Album: ${albums.find(a => a.id === photo.album_id)?.name}` : ''}</small>
                       </div>
                       <div className="action-buttons">
                         <button className="edit-btn" onClick={() => setEditingPhoto(photo)}><Edit2 size={16} /></button>
                         <button className="delete-btn" onClick={() => handleDeletePhoto(photo.id)}><Trash2 size={16} /></button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* --- ALBUMS TAB --- */}
        {activeTab === 'albums' && (
          <div className="tab-content fade-in">
            <section className="upload-section">
              <h3>Create New Album</h3>
              <form onSubmit={handleCreateAlbum} className="upload-form">
                <input name="name" type="text" placeholder="Album Name" required />
                <select name="type">
                  <option value="portrait">Portrait</option>
                  <option value="event">Event</option>
                </select>
                <button type="submit">Create Album</button>
              </form>
            </section>

            <section className="albums-list">
              <h3>Existing Albums</h3>
              <div className="albums-grid">
                {albums.map(album => (
                  <div key={album.id} className="album-card">
                    <h4>{album.name}</h4>
                    <span className="badge">{album.type}</span>
                    <p>{album.photos?.length || 0} photos assigned</p>
                    <div className="action-buttons" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <button className="edit-btn" onClick={() => setEditingAlbum(album)}><Edit2 size={16} /></button>
                        <button className="delete-btn" onClick={() => handleDeleteAlbum(album.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* --- ABOUT TAB --- */}
        {activeTab === 'about' && (
           <div className="tab-content fade-in">
             <section className="about-edit">
                <h3>Public Details</h3>
                <form onSubmit={handleUpdateAbout}>
                   <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '150px' }}>
                        <label>Profile Image</label>
                        <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '0', overflow: 'hidden', border: '2px solid var(--accent)', background: 'var(--bg)', marginTop: '1rem' }}>
                           {aboutImage ? (
                             <img src={URL.createObjectURL(aboutImage)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           ) : about.profile_image_url ? (
                             <img src={about.profile_image_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           ) : (
                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', color: 'var(--muted)' }}>NO IMAGE</div>
                           )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => setAboutImage(e.target.files[0])} style={{ marginTop: '0.8rem', fontSize: '0.7rem' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Biography</label>
                        <textarea value={about.bio} onChange={(e) => setAbout({...about, bio: e.target.value})} placeholder="Biography..." rows={8} required style={{ marginTop: '1rem' }} />
                      </div>
                   </div>
                  
                  <div className="split-grid">
                    <div>
                        <label>Contact Email</label>
                        <input type="email" value={about.email} onChange={(e) => setAbout({...about, email: e.target.value})} placeholder="Email" />
                    </div>
                    <div>
                        <label>Phone Number</label>
                        <input type="text" value={about.phone} onChange={(e) => setAbout({...about, phone: e.target.value})} placeholder="+1 234 567 890" />
                    </div>
                  </div>

                  <label>Physical Address / Studio</label>
                  <input type="text" value={about.address} onChange={(e) => setAbout({...about, address: e.target.value})} placeholder="123 Photography Lane, City..." />
                  
                  <div className="social-links-manager">
                    <h4>Social Media Links <button type="button" onClick={addSocialLink} className="add-btn"><Plus size={14}/> Add Link</button></h4>
                    {about.social_links.map((link, index) => (
                        <div key={index} className="social-link-row">
                            <input type="text" placeholder="Platform (e.g. Instagram)" value={link.platform} onChange={(e) => updateSocialLink(index, 'platform', e.target.value)} required />
                            <input type="url" placeholder="URL (e.g. https://instagram.com/...)" value={link.url} onChange={(e) => updateSocialLink(index, 'url', e.target.value)} required />
                            <button type="button" onClick={() => removeSocialLink(index)} className="remove-btn"><X size={16}/></button>
                        </div>
                    ))}
                  </div>

                  <button type="submit" className="save-btn">Save All Core Details</button>
                </form>
             </section>
           </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
           <div className="tab-content fade-in">
             <section className="about-edit">
                <h3>Account Security</h3>
                <p style={{marginBottom: '2rem', color: 'var(--muted)'}}>Update your administrator login credentials.</p>
                <form onSubmit={handleUpdateCredentials}>
                  <label>New Username (Email)</label>
                  <input type="text" value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} placeholder="e.g. josef" required />
                  
                  <label>New Password (leave blank to keep current)</label>
                  <input type="password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} placeholder="Min 6 characters" />
                  
                  <label>Confirm Password</label>
                  <input type="password" value={credentials.password_confirmation} onChange={(e) => setCredentials({...credentials, password_confirmation: e.target.value})} placeholder="Confirm Password" />
                  
                  <button type="submit" className="save-btn">Update Security Settings</button>
                </form>
             </section>
           </div>
        )}
        {/* --- ANALYTICS TAB --- */}
        {activeTab === 'analytics' && (
          <div className="tab-content fade-in">
            <div className="analytics-stats">
              <div className="stat-card">
                <Eye size={28} className="stat-icon" />
                <h2>{analytics?.total_views ?? '...'}</h2>
                <p>Total Lightbox Views</p>
              </div>
              <div className="stat-card">
                <Camera size={28} className="stat-icon" />
                <h2>{analytics?.total_photos ?? '...'}</h2>
                <p>Photos in Library</p>
              </div>
              <div className="stat-card">
                <FolderOpen size={28} className="stat-icon" />
                <h2>{analytics?.total_albums ?? '...'}</h2>
                <p>Albums Created</p>
              </div>
            </div>

            <section className="about-edit" style={{ marginTop: '3rem' }}>
              <h3> Top 5 Most Viewed Photos</h3>
              {analytics?.top_photos?.length > 0 ? (
                <div className="leaderboard">
                  {analytics.top_photos.map((photo, i) => (
                    <div key={photo.id} className="leaderboard-row">
                      <span className="rank">#{i + 1}</span>
                      <img src={photo.url} alt={photo.title} className="thumb" />
                      <div className="lb-info">
                        <strong>{photo.title || 'Untitled'}</strong>
                        <small>{photo.category} {photo.album ? `• ${photo.album.name}` : ''}</small>
                      </div>
                      <div className="lb-views">
                        <Eye size={14} />
                        <span>{photo.views_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--muted)', paddingTop: '1rem'}}>No views recorded yet. Share the portfolio!</p>
              )}
            </section>
          </div>
        )}

        {/* --- CUSTOMIZATION TAB --- */}
        {activeTab === 'customization' && (
          <div className="tab-content fade-in">
            <section className="about-edit">
              <h3> Site Appearance & Branding</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Fine-tune your website's colors, labels, and global identity. Every single item is under your control.</p>
              
              <form onSubmit={handleUpdateSettings}>
                <div style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--accent)' }}>🎨 THEME COLORS</h4>
                  <div className="theme-color-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem' }}>Primary Text</label>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input type="color" value={customization.primary_color || '#050505'} onChange={(e) => setCustomization({...customization, primary_color: e.target.value})} style={{ width: '40px', height: '40px', padding: '0', border: 'none', cursor: 'pointer', background: 'none' }} />
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{customization.primary_color}</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem' }}>Accent (Gold)</label>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input type="color" value={customization.accent_color || '#d4af37'} onChange={(e) => setCustomization({...customization, accent_color: e.target.value})} style={{ width: '40px', height: '40px', padding: '0', border: 'none', cursor: 'pointer', background: 'none' }} />
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{customization.accent_color}</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem' }}>Background</label>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input type="color" value={customization.bg_color || '#ffffff'} onChange={(e) => setCustomization({...customization, bg_color: e.target.value})} style={{ width: '40px', height: '40px', padding: '0', border: 'none', cursor: 'pointer', background: 'none' }} />
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{customization.bg_color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--accent)' }}>✍️ BRANDING & LABELS</h4>
                  <div className="split-grid" style={{ marginTop: '1.5rem' }}>
                    <div>
                      <label>Site Title (Tab Name)</label>
                      <input type="text" value={customization.site_title || ''} onChange={(e) => setCustomization({...customization, site_title: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                    <div>
                      <label>Site Tagline</label>
                      <input type="text" value={customization.site_tagline || ''} onChange={(e) => setCustomization({...customization, site_tagline: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                  </div>
                  <div className="split-grid" style={{ marginTop: '1.5rem' }}>
                    <div>
                      <label>Navigation Logo Text</label>
                      <input type="text" value={customization.logo_text || ''} placeholder="e.g. JOSEF NHIDI" onChange={(e) => setCustomization({...customization, logo_text: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                  </div>
                  <div className="split-grid" style={{ marginTop: '1.5rem' }}>
                    <div>
                      <label>Portraits Tab Label</label>
                      <input type="text" value={customization.portraits_label || ''} onChange={(e) => setCustomization({...customization, portraits_label: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                    <div>
                      <label>Events Tab Label</label>
                      <input type="text" value={customization.events_label || ''} onChange={(e) => setCustomization({...customization, events_label: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--accent)' }}>🏛 GLOBAL SYSTEM</h4>
                  <div className="split-grid">
                    <div>
                      <label>Gallery Background Text</label>
                      <input type="text" value={customization.gallery_bg_text || ''} placeholder="e.g. GALLERY" onChange={(e) => setCustomization({...customization, gallery_bg_text: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                    <div>
                      <label>Footer Copyright</label>
                      <input type="text" value={customization.footer_copy || ''} onChange={(e) => setCustomization({...customization, footer_copy: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                  </div>
                  <div className="split-grid" style={{ marginTop: '1.5rem' }}>
                    <div>
                      <label>Intro Tagline</label>
                      <input type="text" value={customization.gallery_tagline || ''} placeholder="e.g. Collections" onChange={(e) => setCustomization({...customization, gallery_tagline: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                    <div>
                      <label>Intro Title</label>
                      <input type="text" value={customization.gallery_title || ''} placeholder="e.g. Work" onChange={(e) => setCustomization({...customization, gallery_title: e.target.value})} style={{ marginTop: '0.5rem' }} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--accent)' }}>🔍 SEO & DISCOVERABILITY</h4>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label>Site Meta Description</label>
                    <textarea 
                      value={customization.seo_description || ''} 
                      placeholder="Enter a description for search engines..."
                      onChange={(e) => setCustomization({...customization, seo_description: e.target.value})} 
                      style={{ marginTop: '0.5rem', width: '100%', minHeight: '80px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.8rem', borderRadius: '4px', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div>
                    <label>Meta Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      value={customization.seo_keywords || ''} 
                      placeholder="e.g. photography, portraits, joseph nhidi"
                      onChange={(e) => setCustomization({...customization, seo_keywords: e.target.value})} 
                      style={{ marginTop: '0.5rem' }} 
                    />
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <label>Google Search Console Verification Tag</label>
                    <input 
                      type="text" 
                      value={customization.google_verification_tag || ''} 
                      placeholder="e.g. your-google-verification-string-here"
                      onChange={(e) => setCustomization({...customization, google_verification_tag: e.target.value})} 
                      style={{ marginTop: '0.5rem' }} 
                    />
                    <small style={{ color: 'var(--muted)', marginTop: '0.5rem', display: 'block' }}>Get this from Google Search Console → Settings → Ownership Verification → HTML Tag.</small>
                  </div>
                </div>

                <button type="submit" className="save-btn" style={{ marginTop: '1rem', width: '100%' }}>Publish Site Appearance</button>
              </form>
            </section>
          </div>
        )}
      </div>

      {/* --- EDIT MODALS --- */}
      {editingPhoto && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
             <h3>Edit Photo Details</h3>
             <form onSubmit={handleUpdatePhoto}>
               <label>Title</label>
               <input type="text" value={editingPhoto.title || ''} onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})} />
               
               <label>Category</label>
               <select 
                 value={editingPhoto.category} 
                 onChange={(e) => setEditingPhoto({...editingPhoto, category: e.target.value})}
                 disabled={!!editingPhoto.album_id}
                 style={editingPhoto.album_id ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
               >
                  <option value="portrait">Portrait</option>
                  <option value="event">Event</option>
               </select>
               
               <label>Assign to Album</label>
               <select value={editingPhoto.album_id || ''} onChange={(e) => {
                 const val = e.target.value;
                 let category = editingPhoto.category;
                 if (val) {
                   const alb = albums.find(a => a.id === parseInt(val));
                   if (alb) category = alb.type;
                 }
                 setEditingPhoto({...editingPhoto, album_id: val, category});
               }}>
                  <option value="">No Album</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>{album.name}</option>
                  ))}
               </select>

               <div className="modal-actions">
                 <button type="button" className="cancel-btn" onClick={() => setEditingPhoto(null)}>Cancel</button>
                 <button type="submit" className="save-btn">Save Changes</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {editingAlbum && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
             <h3>Edit Album</h3>
             <form onSubmit={handleUpdateAlbum}>
               <label>Album Name</label>
               <input type="text" value={editingAlbum.name} onChange={(e) => setEditingAlbum({...editingAlbum, name: e.target.value})} required/>
               
               <label>Type / Category</label>
               <select value={editingAlbum.type} onChange={(e) => setEditingAlbum({...editingAlbum, type: e.target.value})}>
                  <option value="portrait">Portrait</option>
                  <option value="event">Event</option>
               </select>
               
               <div className="modal-actions">
                 <button type="button" className="cancel-btn" onClick={() => setEditingAlbum(null)}>Cancel</button>
                 <button type="submit" className="save-btn">Save Changes</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* --- GLOBAL ALERT MODAL --- */}
      {alertConfig && (
        <div className="modal-overlay">
          <div className="custom-popup fade-in">
             {alertConfig.isError ? <AlertCircle size={40} className="popup-icon error" /> : <CheckCircle2 size={40} className="popup-icon success" />}
             <h3>{alertConfig.isError ? 'Error' : 'Success'}</h3>
             <p>{alertConfig.message}</p>
             <button className="save-btn" onClick={() => setAlertConfig(null)}>OK</button>
          </div>
        </div>
      )}

      {/* --- GLOBAL CONFIRM MODAL --- */}
      {confirmConfig && (
        <div className="modal-overlay">
          <div className="custom-popup fade-in">
             <AlertCircle size={40} className="popup-icon warning" />
             <h3>Are you sure?</h3>
             <p>{confirmConfig.message}</p>
             <div className="modal-actions justify-center">
                 <button className="cancel-btn" onClick={() => setConfirmConfig(null)}>Cancel</button>
                 <button className="delete-btn" onClick={() => {
                     confirmConfig.onConfirm();
                     setConfirmConfig(null);
                 }}>Yes, proceed</button>
             </div>
          </div>
        </div>
      )}


      <style jsx="true">{`
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; gap: 1rem; }
        .logout-btn { background: none; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 0.5rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: var(--transition); border-radius: 4px; font-size: 0.8rem; }
        .logout-btn:hover { background: #ff4d4d; color: white; }
        .admin-tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border); margin-bottom: 3rem; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .admin-tabs::-webkit-scrollbar { display: none; }
        .admin-tabs button { background: none; border: none; color: var(--muted); padding: 1rem 1.5rem; cursor: pointer; font-size: 0.85rem; transition: var(--transition); white-space: nowrap; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .admin-tabs button:hover { color: var(--primary); }
        .admin-tabs button.active { color: var(--accent); border-bottom: 2px solid var(--accent); }
        
        .upload-section { background: var(--secondary); padding: 2rem; border-radius: 8px; margin-bottom: 4rem; border: 1px solid var(--border); box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .upload-section h3 { margin-bottom: 1.5rem; color: var(--text); font-size: 1.2rem; }
        .upload-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .upload-form input, .upload-form select, .about-edit input, .about-edit textarea, .modal-content input, .modal-content select { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 0.8rem; border-radius: 4px; font-family: inherit; width: 100%; outline: none;}
        .upload-form input:focus, .upload-form select:focus, .about-edit input:focus, .about-edit textarea:focus, .modal-content input:focus, .modal-content select:focus { border-color: var(--accent); }
        
        button[type="submit"], .save-btn { background: var(--accent); color: white; border: none; padding: 0.8rem 1.5rem; font-weight: bold; cursor: pointer; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; transition: var(--transition); }
        button[type="submit"]:hover, .save-btn:hover { background: var(--primary); color: white; }
        
        .photos-grid h3 { margin-bottom: 1.5rem; color: var(--text); font-size: 1.2rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
        .grid-item { position: relative; aspect-ratio: 1; border-radius: 0; overflow: hidden; background: var(--bg); border: 1px solid var(--border); }
        .grid-item img { width: 100%; height: 100%; object-fit: cover; }
        .grid-info { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: flex-end; backdrop-filter: blur(4px); }
        .photo-meta { min-width: 0; flex: 1; }
        .photo-meta strong { display: block; font-size: 0.9rem; margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .photo-meta small { color: #ccc; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .action-buttons { display: flex; gap: 0.5rem; flex-shrink: 0; }
        .edit-btn { background: rgba(255, 255, 255, 0.2); color: white; border: none; padding: 0.4rem; cursor: pointer; border-radius: 4px; display: flex; align-items: center; transition: var(--transition); }
        .edit-btn:hover { background: var(--accent); }
        .delete-btn { background: rgba(255, 77, 77, 0.9); color: white; border: none; padding: 0.4rem; cursor: pointer; border-radius: 4px; display: flex; align-items: center; transition: var(--transition); }
        .delete-btn:hover { background: red; }
        
        .albums-list h3 { margin-bottom: 1.5rem; color: var(--text); font-size: 1.2rem; }
        .albums-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .album-card { background: var(--secondary); padding: 2rem; border-radius: 8px; border: 1px solid var(--border); position: relative; transition: var(--transition); box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .album-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
        .album-card h4 { margin-bottom: 0.5rem; font-size: 1.2rem; }
        .album-card p { opacity: 0.6; font-size: 0.9rem; margin-top: 1rem; margin-bottom: 0; }
        .badge { background: var(--bg); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
        
        .about-edit { background: var(--secondary); padding: 2rem; border-radius: 8px; border: 1px solid var(--border); box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .about-edit h3 { margin-bottom: 2rem; color: var(--text); font-size: 1.2rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
        .about-edit form { display: flex; flex-direction: column; gap: 1.5rem; max-width: 800px; }
        .about-edit label { font-size: 0.85rem; font-weight: bold; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: -1rem; }
        .split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .social-links-manager { margin-top: 1rem; padding-top: 1.5rem; border-top: 1px dashed var(--border); }
        .social-links-manager h4 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .add-btn { background: none; border: 1px solid var(--accent); color: var(--accent); padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; font-size: 0.7rem; font-weight: bold; transition: var(--transition); }
        .add-btn:hover { background: var(--accent); color: white; }
        .social-link-row { display: grid; grid-template-columns: 1fr 2fr auto; gap: 0.5rem; margin-bottom: 0.5rem; }
        .remove-btn { background: #ff4d4d; color: white; border: none; padding: 0 0.8rem; border-radius: 4px; cursor: pointer; transition: var(--transition); }
        .remove-btn:hover { background: red; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .modal-content, .custom-popup { background: var(--secondary); padding: 2.5rem; border-radius: 8px; width: 100%; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 1px solid var(--border); }
        .custom-popup { max-width: 400px; text-align: center; }
        .popup-icon { margin: 0 auto 1rem; }
        .popup-icon.success { color: #10B981; }
        .popup-icon.error { color: #EF4444; }
        .popup-icon.warning { color: #F59E0B; }
        .custom-popup h3 { margin-bottom: 0.5rem; font-size: 1.5rem; color: var(--text); }
        .custom-popup p { color: var(--muted); margin-bottom: 1.5rem; }
        .custom-popup .save-btn { width: 100%; }

        .modal-content h3 { margin-bottom: 1.5rem; font-size: 1.3rem; }
        .modal-content form { display: flex; flex-direction: column; gap: 1rem; }
        .modal-content label { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; font-weight: bold; margin-bottom: -0.5rem; }
        .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
        .modal-actions.justify-center { justify-content: center; }
        .cancel-btn { background: var(--bg); border: 1px solid var(--border); padding: 0.8rem 1.5rem; border-radius: 4px; cursor: pointer; font-weight: bold; color: var(--text); }
        .cancel-btn:hover { background: #e0e0e0; }
        
        /* ANALYTICS */
        .analytics-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 1rem; }
        @media (max-width: 768px) { .analytics-stats { grid-template-columns: 1fr; } }
        .stat-card { background: var(--secondary); border: 1px solid var(--border); border-radius: 8px; padding: 2rem; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.02); transition: var(--transition); }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
        .stat-icon { color: var(--accent); margin: 0 auto 1rem; }
        .stat-card h2 { font-size: 2.5rem; font-weight: 700; color: var(--text); margin-bottom: 0.3rem; }
        .stat-card p { color: var(--muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .leaderboard { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .leaderboard-row { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg); border-radius: 8px; border: 1px solid var(--border); }
        .rank { font-size: 1.2rem; font-weight: 700; color: var(--accent); width: 2rem; text-align: center; flex-shrink: 0; }
        .thumb { width: 50px; height: 50px; border-radius: 0; object-fit: cover; flex-shrink: 0; }
        .lb-info { flex: 1; }
        .lb-info strong { display: block; margin-bottom: 0.2rem; }
        .lb-info small { color: var(--muted); font-size: 0.75rem; text-transform: uppercase; }
        .lb-views { display: flex; align-items: center; gap: 0.4rem; font-size: 1.1rem; font-weight: 700; color: var(--text); flex-shrink: 0; }

        @media (max-width: 768px) {
           .admin-container { padding-top: 2rem !important; }
           .admin-header { flex-direction: column; align-items: flex-start; margin-bottom: 2rem; }
           .admin-header h2 { font-size: 1.8rem; }
           .admin-tabs { margin-bottom: 2rem; }
           .admin-tabs button { padding: 0.8rem 1rem; font-size: 0.75rem; }
           
           .upload-section, .about-edit, .album-card, .stat-card { padding: 1.5rem; }
           .split-grid { grid-template-columns: 1fr; }
           .social-link-row { grid-template-columns: 1fr; gap: 0.8rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
           
           .modal-content, .custom-popup { width: 95%; padding: 1.5rem; }
           .modal-actions { flex-direction: column; }
           .modal-actions button { width: 100%; }
           
           .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
           .analytics-stats { grid-template-columns: 1fr; }
           
           .leaderboard-row { padding: 0.8rem; gap: 0.8rem; }
           .rank { font-size: 1rem; width: 1.5rem; }
           .thumb { width: 40px; height: 40px; }
           .lb-views { font-size: 0.9rem; }
        }
        
        @media (max-width: 480px) {
           .grid { grid-template-columns: 1fr; }
           .admin-header h2 { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
