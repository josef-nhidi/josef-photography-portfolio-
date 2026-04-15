import React from 'react';
import { Camera, FolderOpen, Eye, Upload, Plus, TrendingUp } from 'lucide-react';

const OverviewPanel = ({ analytics, photos, albums, onNavigate }) => {
  const stats = [
    { label: 'Total Photos', value: analytics?.total_photos ?? 0, icon: Camera, color: '#2563eb' },
    { label: 'Albums', value: analytics?.total_albums ?? 0, icon: FolderOpen, color: '#8b5cf6' },
    { label: 'Total Views', value: analytics?.total_views ?? 0, icon: Eye, color: '#10b981' },
  ];

  const recentPhotos = [...photos].slice(0, 8);

  return (
    <div className="overview-root">
      {/* Stats */}
      <div className="overview-stats-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: `${color}20`, color }}>
              <Icon size={22} />
            </div>
            <div className="stat-body">
              <div className="stat-value">{Number(value).toLocaleString()}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section-block">
        <p className="section-eyebrow">Quick Actions</p>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => onNavigate('photos')}>
            <Upload size={18} />
            <span>Upload Photos</span>
          </button>
          <button className="quick-action-btn" onClick={() => onNavigate('albums')}>
            <Plus size={18} />
            <span>New Album</span>
          </button>
          <button className="quick-action-btn" onClick={() => onNavigate('appearance')}>
            <TrendingUp size={18} />
            <span>Manage Site</span>
          </button>
        </div>
      </div>

      {/* Top Photos */}
      {analytics?.top_photos?.length > 0 && (
        <div className="section-block">
          <p className="section-eyebrow">Top Viewed Photos</p>
          <div className="top-photos-list">
            {analytics.top_photos.map((photo, i) => (
              <div key={photo.id} className="top-photo-row">
                <span className="rank">#{i + 1}</span>
                <img src={photo.url} alt={photo.title} className="row-thumb" />
                <div className="row-info">
                  <strong>{photo.title || 'Untitled'}</strong>
                  <small>{photo.category}{photo.album ? ` • ${photo.album.name}` : ''}</small>
                </div>
                <div className="row-views">
                  <Eye size={13} />
                  <span>{photo.views_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Uploads */}
      <div className="section-block">
        <p className="section-eyebrow">Recent Uploads</p>
        {recentPhotos.length === 0 ? (
          <div className="empty-hint">No photos yet. Use the Photos panel to upload.</div>
        ) : (
          <div className="recent-grid">
            {recentPhotos.map(photo => (
              <div key={photo.id} className="recent-item">
                <img src={photo.url} alt={photo.title || 'Photo'} />
                <div className="recent-overlay">
                  <span>{photo.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .overview-root { display: flex; flex-direction: column; gap: 2rem; }
 
        /* Stats */
        .overview-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; }
        .stat-card { background: var(--admin-panel, white); border: 1px solid var(--admin-border, rgba(0,0,0,0.06)); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        
        @media (min-width: 768px) {
          .stat-card { flex-direction: row; padding: 1.4rem 1.6rem; text-align: left; gap: 1.2rem; }
          .overview-stats-grid { gap: 1rem; }
        }

        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-value { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--admin-text); line-height: 1; }
        
        @media (min-width: 768px) {
          .stat-value { font-size: 2rem; }
          .stat-icon { width: 48px; height: 48px; }
        }

        .stat-label { font-size: 0.65rem; color: var(--admin-text-soft); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.3rem; font-weight: 700; }
 
        /* Sections */
        .section-block { background: var(--admin-panel, white); border: 1px solid var(--admin-border); border-radius: 12px; padding: 1.5rem 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .section-eyebrow { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--admin-text-soft); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.2rem; opacity: 0.6; }
 
        /* Quick Actions */
        .quick-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .quick-action-btn { display: flex; align-items: center; gap: 0.6rem; padding: 0.7rem 1.2rem; background: var(--admin-active-bg); border: 1px solid rgba(37,99,235,0.15); border-radius: 10px; color: var(--admin-accent); cursor: pointer; font-family: var(--font-body); font-size: 0.85rem; font-weight: 700; transition: all 0.2s; }
        .quick-action-btn:hover { background: var(--admin-accent); color: white; transform: translateY(-2px); box-shadow: 0 8px 15px rgba(37,99,235,0.25); }
 
        /* Top Photos */
        .top-photos-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .top-photo-row { display: flex; align-items: center; gap: 1rem; padding: 0.6rem 0.8rem; border-radius: 10px; background: var(--admin-hover-bg); border: 1px solid var(--admin-border); }
        .rank { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--admin-text-soft); min-width: 24px; opacity: 0.5; }
        .row-thumb { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; flex-shrink: 0; }
        .row-info { flex: 1; min-width: 0; }
        .row-info strong { display: block; font-size: 0.85rem; color: var(--admin-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .row-info small { font-size: 0.7rem; color: var(--admin-text-soft); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; opacity: 0.8; }
        .row-views { display: flex; align-items: center; gap: 0.4rem; color: var(--admin-text-soft); font-size: 0.8rem; flex-shrink: 0; opacity: 0.6; }
 
        /* Recent Grid */
        .recent-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.6rem; }
        .recent-item { aspect-ratio: 1; border-radius: 10px; overflow: hidden; position: relative; background: var(--admin-border); }
        .recent-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
        .recent-item:hover img { transform: scale(1.1); }
        .recent-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 0.6rem; opacity: 0; transition: opacity 0.3s; }
        .recent-item:hover .recent-overlay { opacity: 1; }
        .recent-overlay span { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: white; font-weight: 600; }
        .empty-hint { font-size: 0.85rem; color: var(--admin-text-soft); padding: 1rem 0; font-style: italic; opacity: 0.6; }
      `}</style>
    </div>
  );
};

export default OverviewPanel;
