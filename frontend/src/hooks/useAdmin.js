import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

/**
 * useAdmin
 * A comprehensive hook that manages the entire state and logic for the Admin Dashboard.
 * Handles data orchestration, authentication checks, and CRUD operations.
 */
export const useAdmin = (setIsAdmin) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [about, setAbout] = useState({ bio: '', email: '', phone: '', address: '', social_links: [] });
  const [analytics, setAnalytics] = useState(null);
  const [customization, setCustomization] = useState({});
  const [credentials, setCredentials] = useState({ email: '', password: '', password_confirmation: '' });

  // UI State
  const [activeTab, setActiveTab] = useState('overview');
  const [toasts, setToasts] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [aboutImage, setAboutImage] = useState(null);

  // Upload State
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState('portrait');
  const [uploadAlbumId, setUploadAlbumId] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const fetchData = async () => {
    try {
      const [photosRes, albumsRes, aboutRes, analyticsRes, settingsRes] = await Promise.all([
        api.get('photos'),
        api.get('albums'),
        api.get('about'),
        api.get('admin/analytics'),
        api.get('settings'),
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
        ...aboutData,
        bio: aboutData.bio || '',
        email: aboutData.email || '',
        phone: aboutData.phone || '',
        address: aboutData.address || '',
        social_links: parsedLinks,
        profile_image_url: aboutData.profile_image_url || ''
      });
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/josef/login');
    } else {
      fetchData();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    navigate('/admin/josef/login');
  };

  const showAlert = (message, isError = false) => setAlertConfig({ message, isError });
  const showConfirm = (message, onConfirm) => setConfirmConfig({ message, onConfirm });

  // --- CRUD HANDLERS ---

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
        const title = file.name.split('.').slice(0, -1).join('.');
        formData.append('title', title);
        if(uploadAlbumId) formData.append('album_id', uploadAlbumId);

        try {
          const config = { headers: { 'Content-Type': 'multipart/form-data' }};
          await api.post('admin/photos', formData, config);
        } catch (err) { 
          console.error('Upload failed for', file.name); 
        }
    }

    fetchData();
    addToast(`${uploadFiles.length} photos uploaded successfully!`);
    setUploadFiles([]);
    setUploadProgress(null);
  };

  const handleDeletePhoto = (id) => {
    showConfirm('Are you sure you want to delete this photo?', async () => {
        try {
          await api.delete(`admin/photos/${id}`);
          fetchData();
          addToast('Photo deleted.');
        } catch (err) { showAlert('Error during deletion.', true); }
    });
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    try {
      await api.put(`admin/photos/${editingPhoto.id}`, {
        title: editingPhoto.title,
        category: editingPhoto.category,
        album_id: editingPhoto.album_id
      });
      fetchData();
      setEditingPhoto(null);
      addToast('Photo details updated.');
    } catch (err) { showAlert('Error updating photo.', true); }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('admin/albums', { 
        name: formData.get('name'), 
        type: formData.get('type') 
      });
      fetchData();
      e.target.reset();
      addToast('Album created successfully!');
    } catch (err) { showAlert('Error creating album.', true); }
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    try {
      await api.put(`admin/albums/${editingAlbum.id}`, {
        name: editingAlbum.name,
        type: editingAlbum.type
      });
      fetchData();
      setEditingAlbum(null);
      addToast('Album details updated.');
    } catch (err) { showAlert('Error updating album.', true); }
  };

  const handleDeleteAlbum = (id) => {
    showConfirm('Delete this album? Photos inside will NOT be deleted.', async () => {
        try {
          await api.delete(`admin/albums/${id}`);
          fetchData();
          addToast('Album successfully deleted.');
        } catch (err) { showAlert('Error deleting album.', true); }
    });
  };

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
      await api.post('admin/about', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      setAboutImage(null);
      fetchData();
      addToast('About Content Updated!');
    } catch (err) { showAlert('Error updating about content.', true); }
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if(credentials.password && credentials.password !== credentials.password_confirmation) {
        return showAlert('Passwords do not match.', true);
    }
    try {
      await api.put('admin/credentials', credentials);
      addToast('Credentials updated! Please login again.');
      setTimeout(() => handleLogout(), 2000);
    } catch (err) { showAlert('Error updating credentials.', true); }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      // Use FormData to support file uploads (logo/favicon)
      const formData = new FormData();
      Object.keys(customization).forEach(key => {
        // Skip null values and special internal states
        if (customization[key] !== null && key !== 'site_logo_file') {
          formData.append(key, customization[key]);
        }
      });

      if (customization.site_logo_file) {
        formData.append('site_logo_file', customization.site_logo_file);
      }

      await api.post('admin/settings', formData);

      addToast('Site Appearance Updated! Page will refresh.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) { showAlert('Error updating site settings.', true); }
  };

  return {
    // Data
    photos, albums, about, analytics, customization, credentials, loading,
    setAbout, setCustomization, setCredentials,
    
    // UI Logic
    activeTab, setActiveTab,
    toasts, setToasts, addToast,
    editingPhoto, setEditingPhoto,
    editingAlbum, setEditingAlbum,
    alertConfig, setAlertConfig,
    confirmConfig, setConfirmConfig,
    aboutImage, setAboutImage,
    
    // Upload
    uploadFiles, setUploadFiles,
    uploadCategory, setUploadCategory,
    uploadAlbumId, setUploadAlbumId,
    uploadProgress,
    
    // Actions
    handleLogout,
    handleUpload,
    handleDeletePhoto,
    handleUpdatePhoto,
    handleCreateAlbum,
    handleUpdateAlbum,
    handleDeleteAlbum,
    handleUpdateAbout,
    handleUpdateCredentials,
    handleUpdateSettings,
    refresh: fetchData
  };
};
