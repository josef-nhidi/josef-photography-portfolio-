import React from 'react';
import { Plus, Trash2, Edit2, FolderOpen } from 'lucide-react';

const AlbumsPanel = ({ albums, onCreateAlbum, onEditAlbum, onDeleteAlbum }) => {
  return (
    <div className="albums-root">
      {/* Create Album */}
      <div className="admin-card-premium">
        <p className="admin-heading-premium"><Plus size={14} style={{marginRight: '8px'}} /> Create New Album</p>
        <form onSubmit={onCreateAlbum} className="album-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="admin-label-premium">Album Name</label>
              <input name="name" type="text" className="admin-input-premium" placeholder="e.g. Summer Wedding 2024" required />
            </div>
            <div className="form-group">
              <label className="admin-label-premium">Type / Category</label>
              <select name="type" className="admin-input-premium">
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div className="form-group-end">
              <button type="submit" className="btn-primary">
                <Plus size={15} /> Create Album
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Album List */}
      <div className="admin-card-premium">
        <p className="admin-heading-premium"><FolderOpen size={14} style={{marginRight: '8px'}} /> Existing Albums — {albums.length}</p>
        {albums.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={40} />
            <p>No albums created yet.</p>
          </div>
        ) : (
          <div className="album-grid">
            {albums.map(album => (
              <div key={album.id} className="album-card">
                <div className="album-details">
                  <h4 className="album-name">{album.name}</h4>
                  <div className="album-meta">
                    <span className="badge">{album.type}</span>
                    <span className="photo-count">{album.photos?.length || 0} photos</span>
                  </div>
                </div>
                <div className="album-actions">
                  <button className="icon-btn" onClick={() => onEditAlbum(album)} title="Edit"><Edit2 size={14} /></button>
                  <button className="icon-btn danger" onClick={() => onDeleteAlbum(album.id)} title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .albums-root { display: flex; flex-direction: column; gap: 1.5rem; }
        .panel-card { background: var(--admin-panel, white); border: 1px solid var(--admin-border, rgba(0,0,0,0.06)); border-radius: 12px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .panel-card-title { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--admin-text-soft); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; opacity: 0.6; }
        
        .album-form { margin-top: 1rem; }
        .form-grid { display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end; }
        .form-group { display: flex; flex-direction: column; gap: 0.45rem; flex: 1; min-width: 220px; }
        .form-group-end { flex: 0; }
        .form-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12rem; color: var(--admin-text-soft); font-weight: 700; opacity: 0.8; }
        .form-input, .form-select { background: var(--admin-bg); border: 1px solid var(--admin-border); color: var(--admin-text); padding: 0.75rem 0.9rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: border-color 0.2s; width: 100%; }
        .form-input:focus, .form-select:focus { border-color: var(--admin-accent); background: var(--admin-panel); }
        
        .btn-primary { background: var(--admin-accent); color: white; border: none; padding: 0.8rem 1.6rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.875rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.6rem; transition: all 0.2s; white-space: nowrap; box-shadow: 0 8px 18px rgba(37,99,235,0.2); }
        .btn-primary:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(37,99,235,0.3); }
 
        .album-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        
        @media (max-width: 500px) {
          .album-grid { grid-template-columns: 1fr; }
          .album-card { padding: 1.25rem; flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .album-actions { width: 100%; justify-content: flex-end; }
        }

        .album-card { background: var(--admin-bg); border: 1px solid var(--admin-border); border-radius: 14px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1); }
        .album-card:hover { border-color: var(--admin-accent); transform: translateY(-4px); box-shadow: 10px 10px 30px rgba(0,0,0,0.1); background: var(--admin-panel); }
        .album-details { flex: 1; min-width: 0; width: 100%; }
        .album-name { font-size: 1rem; color: var(--admin-text); margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 700; letter-spacing: -0.01em; }
        .album-meta { display: flex; align-items: center; gap: 0.75rem; }
        .badge { background: var(--admin-active-bg); color: var(--admin-accent); border: 1px solid rgba(37,99,235,0.1); padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.6rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.08em; }
        .photo-count { font-size: 0.7rem; color: var(--admin-text-soft); font-weight: 600; opacity: 0.6; }
        
        .album-actions { display: flex; gap: 0.6rem; }
        .icon-btn { background: var(--admin-panel); border: 1px solid var(--admin-border); color: var(--admin-text-soft); padding: 0.5rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .icon-btn:hover { border-color: var(--admin-accent); color: var(--admin-accent); transform: scale(1.1); }
        .icon-btn.danger:hover { background: #fee2e2; border-color: #fecaca; color: #ef4444; }
        
        .empty-state { text-align: center; padding: 4rem; color: var(--admin-text-soft); opacity: 0.4; }
        .empty-state svg { margin: 0 auto 1.5rem; }
        .empty-state p { font-size: 0.95rem; font-weight: 500; }
      `}</style>
    </div>
  );
};

export default AlbumsPanel;
