import React from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

// Layout & Panels
import AdminLayout from '../layouts/AdminLayout';
import OverviewPanel from '../components/admin/OverviewPanel';
import PhotosPanel from '../components/admin/PhotosPanel';
import AlbumsPanel from '../components/admin/AlbumsPanel';
import AboutPanel from '../components/admin/AboutPanel';
import AppearancePanel from '../components/admin/AppearancePanel';
import SecurityPanel from '../components/admin/SecurityPanel';

/**
 * AdminDashboard
 * The primary orchestrator for the Josef Nhidi Photography Studio backend.
 * Now refactored into a high-fidelity, modular architecture using the useAdmin hook.
 */
const AdminDashboard = ({ setIsAdmin }) => {
  const admin = useAdmin(setIsAdmin);

  if (admin.loading) return (
    <div className="loader-page">
      <div className="aperture-pulse"></div>
      <span className="loader-sub">Synchronizing Studio</span>
    </div>
  );

  return (
    <AdminLayout 
      activeTab={admin.activeTab} 
      setActiveTab={admin.setActiveTab} 
      onLogout={admin.handleLogout}
    >
      {/* ── PANELS ── */}
      {admin.activeTab === 'overview' && (
        <OverviewPanel 
          analytics={admin.analytics} 
          photos={admin.photos} 
          albums={admin.albums} 
          onNavigate={(tab) => admin.setActiveTab(tab)} 
        />
      )}

      {admin.activeTab === 'photos' && (
        <PhotosPanel 
          photos={admin.photos}
          albums={admin.albums}
          uploadFiles={admin.uploadFiles}
          setUploadFiles={admin.setUploadFiles}
          uploadCategory={admin.uploadCategory}
          setUploadCategory={admin.setUploadCategory}
          uploadAlbumId={admin.uploadAlbumId}
          setUploadAlbumId={admin.setUploadAlbumId}
          uploadProgress={admin.uploadProgress}
          onUpload={admin.handleUpload}
          onDelete={admin.handleDeletePhoto}
          onEdit={admin.setEditingPhoto}
        />
      )}
      
      {admin.activeTab === 'albums' && (
        <AlbumsPanel 
          albums={admin.albums}
          onCreateAlbum={admin.handleCreateAlbum}
          onEditAlbum={admin.setEditingAlbum}
          onDeleteAlbum={admin.handleDeleteAlbum}
        />
      )}

      {admin.activeTab === 'about' && (
        <AboutPanel 
          about={admin.about}
          setAbout={admin.setAbout}
          aboutImage={admin.aboutImage}
          setAboutImage={admin.setAboutImage}
          onUpdateAbout={admin.handleUpdateAbout}
        />
      )}

      {admin.activeTab === 'appearance' && (
        <AppearancePanel 
          customization={admin.customization}
          setCustomization={admin.setCustomization}
          onUpdateSettings={admin.handleUpdateSettings}
        />
      )}

      {admin.activeTab === 'security' && (
        <SecurityPanel 
          credentials={admin.credentials}
          setCredentials={admin.setCredentials}
          onUpdateCredentials={admin.handleUpdateCredentials}
        />
      )}

      {/* ── MODALS & OVERLAYS ── */}
      
      {/* Edit Photo Modal */}
      {admin.editingPhoto && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
             <div className="modal-header">
                <h3>Edit Photo Details</h3>
                <button onClick={() => admin.setEditingPhoto(null)}><X size={20} /></button>
             </div>
             <form onSubmit={admin.handleUpdatePhoto}>
               <div className="form-group-modal">
                  <label>Title</label>
                  <input type="text" value={admin.editingPhoto.title || ''} onChange={(e) => admin.setEditingPhoto({...admin.editingPhoto, title: e.target.value})} className="modal-input" />
               </div>
               
               <div className="form-group-modal">
                  <label>Assign to Album</label>
                  <select 
                    className="modal-select"
                    value={admin.editingPhoto.album_id || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      let category = admin.editingPhoto.category;
                      if (val) {
                        const alb = admin.albums.find(a => a.id === parseInt(val));
                        if (alb) category = alb.type;
                      }
                      admin.setEditingPhoto({...admin.editingPhoto, album_id: val, category});
                    }}
                  >
                    <option value="">No Album</option>
                    {admin.albums.map(album => (
                      <option key={album.id} value={album.id}>{album.name}</option>
                    ))}
                  </select>
               </div>

               <div className="modal-actions">
                 <button type="button" className="btn-cancel" onClick={() => admin.setEditingPhoto(null)}>Cancel</button>
                 <button type="submit" className="btn-save">Save Changes</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Edit Album Modal */}
      {admin.editingAlbum && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
             <div className="modal-header">
                <h3>Edit Album</h3>
                <button onClick={() => admin.setEditingAlbum(null)}><X size={20} /></button>
             </div>
             <form onSubmit={admin.handleUpdateAlbum}>
               <div className="form-group-modal">
                  <label>Album Name</label>
                  <input type="text" value={admin.editingAlbum.name} onChange={(e) => admin.setEditingAlbum({...admin.editingAlbum, name: e.target.value})} className="modal-input" required />
               </div>
               
               <div className="form-group-modal">
                  <label>Type / Category</label>
                  <select value={admin.editingAlbum.type} onChange={(e) => admin.setEditingAlbum({...admin.editingAlbum, type: e.target.value})} className="modal-select">
                    <option value="portrait">Portrait</option>
                    <option value="event">Event</option>
                  </select>
               </div>
               
               <div className="modal-actions">
                 <button type="button" className="btn-cancel" onClick={() => admin.setEditingAlbum(null)}>Cancel</button>
                 <button type="submit" className="btn-save">Save Changes</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Global Alert Popup */}
      {admin.alertConfig && (
        <div className="admin-modal-overlay">
          <div className="admin-popup">
             {admin.alertConfig.isError ? <AlertCircle size={48} className="popup-icon error" /> : <CheckCircle2 size={48} className="popup-icon success" />}
             <h3>{admin.alertConfig.isError ? 'Action Failed' : 'Success'}</h3>
             <p>{admin.alertConfig.message}</p>
             <button className="btn-save" onClick={() => admin.setAlertConfig(null)}>Got it</button>
          </div>
        </div>
      )}

      {/* Global Confirm Popup */}
      {admin.confirmConfig && (
        <div className="admin-modal-overlay">
          <div className="admin-popup">
             <AlertCircle size={48} className="popup-icon warning" />
             <h3>Confirm Action</h3>
             <p>{admin.confirmConfig.message}</p>
             <div className="modal-actions" style={{justifyContent: 'center'}}>
                 <button className="btn-cancel" onClick={() => admin.setConfirmConfig(null)}>Cancel</button>
                 <button className="btn-danger" onClick={() => {
                     admin.confirmConfig.onConfirm();
                     admin.setConfirmConfig(null);
                 }}>Confirm</button>
             </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      <div className="toast-container">
        {admin.toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
             <CheckCircle2 size={18} />
             <span>{toast.message}</span>
             <button onClick={() => admin.setToasts(prev => prev.filter(t => t.id !== toast.id))} className="toast-close">
                <X size={14} />
             </button>
          </div>
        ))}
      </div>

      {/* ── STYLES ── */}
    </AdminLayout>
  );
};

export default AdminDashboard;
