import React, { useState, useRef } from 'react';
import { Upload, Trash2, Edit2, Image } from 'lucide-react';

const PhotosPanel = ({
  photos, albums,
  uploadFiles, setUploadFiles,
  uploadCategory, setUploadCategory,
  uploadAlbumId, setUploadAlbumId,
  uploadProgress,
  onUpload, onDelete, onEdit,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setUploadFiles(files);
  };

  return (
    <div className="photos-root">
      {/* Upload Card */}
      <div className="admin-card-premium">
        <p className="admin-heading-premium"><Upload size={14} style={{marginRight: '8px'}} /> Upload Photos</p>
        <form onSubmit={onUpload}>
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${uploadFiles.length > 0 ? 'has-files' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => setUploadFiles(Array.from(e.target.files))}
            />
            {uploadFiles.length > 0 ? (
              <>
                <div className="dz-count">{uploadFiles.length}</div>
                <p className="dz-text">Photos ready to upload</p>
                <p className="dz-sub">Click to change selection</p>
              </>
            ) : (
              <>
                <Upload size={30} className="dz-icon" />
                <p className="dz-text">Drop photos here or click to browse</p>
                <p className="dz-sub">JPG, PNG, WEBP — auto-converted & watermarked</p>
              </>
            )}
          </div>

          {/* Preview strip */}
          {uploadFiles.length > 0 && (
            <div className="preview-strip">
              {uploadFiles.slice(0, 10).map((f, i) => (
                <div key={i} className="preview-thumb">
                  <img src={URL.createObjectURL(f)} alt="" />
                </div>
              ))}
              {uploadFiles.length > 10 && (
                <div className="preview-thumb preview-more">+{uploadFiles.length - 10}</div>
              )}
            </div>
          )}

          {/* Options */}
          <div className="upload-options">
            <div className="form-group">
              <label className="admin-label-premium">Target Album</label>
              <select
                className="admin-input-premium"
                value={uploadAlbumId}
                onChange={(e) => {
                  const val = e.target.value;
                  setUploadAlbumId(val);
                  if (val) {
                    const alb = albums.find(a => a.id === parseInt(val));
                    if (alb) setUploadCategory(alb.type);
                  }
                }}
              >
                <option value="">No Album</option>
                {albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="admin-label-premium">Portfolio Category</label>
              <select
                className="admin-input-premium"
                value={uploadCategory}
                disabled={!!uploadAlbumId}
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div className="form-group form-group-end">
              <button type="submit" className="btn-primary" disabled={!!uploadProgress}>
                {uploadProgress ? <span>{uploadProgress}</span> : <><Upload size={15} /> Upload All</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Library */}
      <div className="admin-card-premium">
        <p className="admin-heading-premium"><Image size={14} style={{marginRight: '8px'}} /> Photo Library — {photos.length} photos</p>
        {photos.length === 0 ? (
          <div className="empty-state">
            <Image size={40} />
            <p>No photos yet. Upload your first photo above.</p>
          </div>
        ) : (
          <div className="photo-grid">
            {photos.map(photo => (
              <div key={photo.id} className="photo-grid-item">
                <img src={photo.url} alt={photo.title || 'Photo'} />
                <div className="photo-overlay">
                  <div className="photo-meta">
                    <strong>{photo.title || 'Untitled'}</strong>
                    <span>{photo.category}{photo.album_id ? ` • ${albums.find(a => a.id === photo.album_id)?.name || ''}` : ''}</span>
                  </div>
                  <div className="photo-actions">
                    <button className="icon-btn" onClick={() => onEdit(photo)} title="Edit"><Edit2 size={14} /></button>
                    <button className="icon-btn danger" onClick={() => onDelete(photo.id)} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .photos-root { display: flex; flex-direction: column; gap: 1.5rem; }
        .panel-card { background: var(--admin-panel, white); border: 1px solid var(--admin-border, rgba(0,0,0,0.06)); border-radius: 12px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .photos-root { display: flex; flex-direction: column; gap: 1.5rem; }
        .panel-card { background: var(--admin-panel, white); border: 1px solid var(--admin-border, rgba(0,0,0,0.06)); border-radius: 12px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .panel-card-title { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--admin-text-soft); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; opacity: 0.6; }
        .drop-zone { border: 2px dashed var(--admin-border); border-radius: 0; padding: 2.5rem; text-align: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1); background: var(--admin-bg); }
        .drop-zone:hover, .drop-zone.drag-over { border-color: var(--admin-accent); background: var(--admin-active-bg); transform: scale(0.99); }
        .drop-zone.has-files { border-style: solid; border-color: rgba(37,99,235,0.2); background: var(--admin-panel); }
        .dz-icon { color: var(--admin-text-soft); opacity: 0.5; margin: 0 auto 1.2rem; }
        .dz-count { font-family: var(--font-heading); font-size: 3.5rem; font-weight: 800; color: var(--admin-accent); line-height: 1; margin-bottom: 0.4rem; }
        .dz-text { font-size: 0.95rem; color: var(--admin-text); margin-bottom: 0.25rem; font-weight: 600; }
        .dz-sub { font-size: 0.75rem; color: var(--admin-text-soft); opacity: 0.6; }
        .preview-strip { display: flex; gap: 0.6rem; margin-top: 1.5rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .preview-thumb { width: 58px; height: 58px; border-radius: 0; overflow: hidden; flex-shrink: 0; background: var(--admin-bg); border: 1px solid var(--admin-border); }
        .preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .preview-more { display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: var(--admin-text-soft); font-weight: 700; }
        .upload-options { display: flex; gap: 1.25rem; margin-top: 1.5rem; flex-wrap: wrap; align-items: flex-end; }
        .form-group { display: flex; flex-direction: column; gap: 0.45rem; flex: 1; min-width: 160px; }
        .form-group-end { align-self: flex-end; flex: 0; }
        .form-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12rem; color: var(--admin-text-soft); font-weight: 700; opacity: 0.8; }
        .form-select { background: var(--admin-bg); border: 1px solid var(--admin-border); color: var(--admin-text); padding: 0.75rem 0.9rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: border-color 0.2s; width: 100%; cursor: pointer; }
        .form-select:focus { border-color: var(--admin-accent); background: var(--admin-panel); }
        .form-select:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-primary { background: var(--admin-accent); color: white; border: none; padding: 0.8rem 1.6rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.875rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.6rem; transition: all 0.2s; white-space: nowrap; box-shadow: 0 8px 20px rgba(37,99,235,0.2); }
        .btn-primary:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(37,99,235,0.3); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem; }
        .photo-grid-item { aspect-ratio: 1; border-radius: 0; overflow: hidden; position: relative; background: var(--admin-bg); border: 1px solid var(--admin-border); }
        .photo-grid-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
        .photo-grid-item:hover img { transform: scale(1.08); }
        .photo-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 0.75rem; opacity: 1; /* Always visible on mobile for clarity */ }
        
        @media (min-width: 1025px) {
           .photo-overlay { opacity: 0; }
           .photo-grid-item:hover .photo-overlay { opacity: 1; }
        }

        .photo-meta { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; }
        .photo-meta strong { font-size: 0.75rem; color: white; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1rem; }
        .photo-meta span { font-size: 0.6rem; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.08em; display: block; font-weight: 600; }
        .photo-actions { display: flex; gap: 0.4rem; margin-top: 0.5rem; }
        .icon-btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0.6rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; transition: all 0.2s; backdrop-filter: blur(8px); }
        .icon-btn:hover { background: var(--admin-accent); border-color: transparent; transform: scale(1.1); }
        .icon-btn.danger:hover { background: #ef4444; }
        .empty-state { text-align: center; padding: 4rem; color: var(--admin-text-soft); opacity: 0.4; }
        .empty-state svg { margin: 0 auto 1.5rem; }
        .empty-state p { font-size: 0.95rem; font-weight: 500; }
      `}</style>
    </div>
  );
};

export default PhotosPanel;
