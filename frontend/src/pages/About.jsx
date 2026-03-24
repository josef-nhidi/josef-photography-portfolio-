import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Instagram, Linkedin, Mail, Globe, Twitter, Youtube, Facebook } from 'lucide-react';
import SEO from '../components/SEO';

const About = ({ settings }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get('/about');
        const data = response.data;
        if (data && typeof data.social_links === 'string') {
          try { data.social_links = JSON.parse(data.social_links); } catch(e) { data.social_links = []; }
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
        title="About Josef Nhidi"
        description="Learn about Josef Nhidi — a professional photographer with a passion for capturing authentic moments. View his biography, contact information, and social media links."
        keywords="Josef Nhidi, about the photographer, photography biography, contact photographer"
        url="/about"
        type="profile"
      />
      <div className="container about-grid">
        <div className="about-image">
          {content?.profile_image_url ? (
            <img src={content.profile_image_url} alt="Josef Nhidi" />
          ) : (
            <div className="image-placeholder">PROFILE PICTURE</div>
          )}
        </div>
        
        <div className="about-text">
          <header className="page-header" style={{ marginBottom: '3rem' }}>
            <span className="header-label">The Artist</span>
            <h1 className="header-title">Josef Nhidi</h1>
          </header>
          <div className="bio">
            {content?.bio || "Josef Nhidi is a passionate photographer specializing in portraits and events. With a keen eye for details and the soul of his subjects, he captures the fleeting to make it eternal."}
          </div>
          
          <div className="contact-info">
            {content?.email && <p><strong>Email:</strong> <a href={`mailto:${content.email}`}>{content.email}</a></p>}
            {content?.phone && <p><strong>Phone:</strong> {content.phone}</p>}
            {content?.address && <p><strong>Address:</strong> {content.address}</p>}
            
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
                      <Icon size={20} />
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
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .about-page {
          padding-top: 4rem;
          padding-bottom: 10rem;
        }

        @media (max-width: 900px) {
          .about-page {
            padding-top: 3rem;
            padding-bottom: 4rem;
          }
          .about-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }
          .socials {
            justify-content: center;
          }
          .bio {
            font-size: 1rem;
          }
        }

        .about-image img {
          width: 100%;
          height: auto;
          filter: grayscale(1);
          transition: var(--transition);
        }

        .about-image img:hover {
          filter: grayscale(0);
        }

        .image-placeholder {
          aspect-ratio: 4/5;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          letter-spacing: 5px;
        }

        .header-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 5px;
          color: var(--accent);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .header-title { 
          font-family: var(--font-display);
          font-size: 4rem; 
          line-height: 1;
          font-weight: 500;
          letter-spacing: -1px;
        }

        .subtitle {
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .bio {
          font-size: 1.1rem;
          opacity: 0.8;
          margin-bottom: 3rem;
          white-space: pre-wrap;
        }

        .contact-info p {
           margin-bottom: 0.5rem;
        }

        .socials {
           margin-top: 2rem;
           display: flex;
           gap: 1rem;
           flex-wrap: wrap;
        }

        .social-icon-link {
           display: inline-flex;
           align-items: center;
           gap: 0.6rem;
           padding: 0.6rem 1.2rem;
           border: 1px solid var(--border);
           color: var(--muted);
           font-size: 0.8rem;
           text-transform: uppercase;
           letter-spacing: 2px;
           font-weight: 600;
           transition: var(--transition);
        }

        .social-icon-link:hover {
           border-color: var(--accent);
           color: var(--accent);
           transform: translateY(-3px);
        }
      `}</style>
    </section>
  );
};

export default About;
