import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Instagram, Linkedin, Mail, Globe, Twitter, Youtube, Facebook } from 'lucide-react';
import SEO from '../components/ui/SEO';

const About = ({ settings }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get('about');
        const data = response.data;
        if (data && typeof data.social_links === 'string') {
          try { data.social_links = JSON.parse(data.social_links); } catch(e) { data.social_links = []; }
        }
        if (data && !Array.isArray(data.social_links)) {
          data.social_links = []; // Force to array if it's an object or null
        }
        setContent(data);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <div className="loader container">Loading...</div>;

  return (
    <section className="about-page">
      <SEO 
        settings={settings}
        title="About The Artist"
        description={content?.bio?.substring(0, 160) || "Learn more about Josef Nhidi, a professional photographer specializing in cinematic portraits and high-end event coverage. Discover the vision behind the lens."}
        url="/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Josef Nhidi",
          "jobTitle": "Professional Photographer",
          "description": content?.bio || "Professional Photographer specializing in portraits and events.",
          "image": content?.profile_image_url,
          "url": "https://josefnhidi.me/about",
          "sameAs": content?.social_links?.map(link => link.url) || []
        }}
      />
      <div className="container">
        <header className="page-header">
          <div className="header-content">
            <span className="header-label">The Artist Behind the Lens</span>
            <h1 className="header-title">Josef Nhidi</h1>
            <p className="header-subtitle">Professional Photographer & Visual Storyteller</p>
          </div>
        </header>

        <div className="portfolio-content-panel about-panel">
          <div className="panel-body about-grid">
        <div className="about-image">
          {content?.profile_image_url ? (
            <img src={content.profile_image_url} alt="Josef Nhidi" />
          ) : (
            <div className="image-placeholder">PROFILE PICTURE</div>
          )}
        </div>
        
        <div className="about-text">
          <div className="bio">
            {content?.bio || "Josef Nhidi is a passionate photographer specializing in portraits and events. With a keen eye for details and the soul of his subjects, he captures the fleeting to make it eternal."}
          </div>
          
          <span className="contact-section-title">Get in Touch</span>
          <div className="contact-info">
            {content?.email && (
              <div className="contact-item">
                <label>Email</label>
                <a href={`mailto:${content.email}`}>{content.email}</a>
              </div>
            )}
            {content?.phone && (
              <div className="contact-item">
                <label>Phone</label>
                <span>{content.phone}</span>
              </div>
            )}
            {content?.address && (
              <div className="contact-item">
                <label>Studio</label>
                <span>{content.address}</span>
              </div>
            )}
          </div>
            
          {content?.social_links && content.social_links.length > 0 && (
            <div className="socials">
              {content.social_links.map((link, idx) => {
                const platform = link.platform?.toLowerCase() || '';
                let Icon = Globe;
                if (platform.includes('instagram')) Icon = Instagram;
                else if (platform.includes('linkedin')) Icon = Linkedin;
                else if (platform.includes('mail') || platform.includes('email')) Icon = Mail;
                else if (platform.includes('twitter') || platform.includes('x')) Icon = Twitter;
                else if (platform.includes('youtube')) Icon = Youtube;
                else if (platform.includes('facebook')) Icon = Facebook;
                return (
                  <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="social-icon-link" title={link.platform}>
                    <Icon size={18} />
                    <span>{link.platform}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>

      <style jsx="true">{`
        .about-page {
          padding-top: 4rem;
          padding-bottom: 6rem;
        }

        .about-panel {
          padding: 0;
          overflow: hidden;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 0;
          align-items: stretch;
        }

        .about-image {
          height: 100%;
          border-right: 1px solid var(--border-subtle);
          background: var(--border-subtle);
        }

        .about-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.2);
          transition: var(--transition);
        }

        .about-image img:hover {
          filter: grayscale(0);
        }

        .image-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          padding: 4rem;
          text-align: center;
          font-weight: 700;
          letter-spacing: 0.25em;
          font-size: 0.8rem;
          opacity: 0.5;
        }

        .about-text {
          padding: 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bio {
          font-size: 1.15rem;
          line-height: 1.8;
          color: var(--text);
          margin-bottom: 3.5rem;
          white-space: pre-wrap;
          font-weight: 450;
          opacity: 0.9;
        }

        .contact-section-title {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--accent);
          font-weight: 800;
          margin-bottom: 1.5rem;
          display: block;
        }

        .contact-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .contact-item {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .contact-item label {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 700;
          letter-spacing: 0.05em;
          opacity: 0.7;
        }

        .contact-item span, .contact-item a {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--primary);
        }

        .socials {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .social-icon-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1.4rem;
          background: var(--bg-panel);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .social-icon-link:hover {
          background: var(--bg);
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        @media (max-width: 1024px) {
          .about-page { padding-bottom: 12rem; } /* Safe-zone for Lens Pod */
          .about-grid { grid-template-columns: 1fr; }
          .about-image { border-right: none; border-bottom: 1px solid var(--border-subtle); height: 500px; }
          .about-text { padding: 3rem 2rem; }
        }

        @media (max-width: 768px) {
          .about-image { height: 400px; }
          .bio { font-size: 1rem; margin-bottom: 2.5rem; }
        }
      `}</style>
    </div>
  </section>
  );
};

export default About;
