import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  articlePublishedAt,
  settings, // Pass settings as a prop for dynamic controls
}) => {
  const siteName = settings?.site_title || 'Josef Nhidi Photography';
  const defaultDescription = settings?.seo_description ||
    'Professional photography by Josef Nhidi (also known as Youssef Nhidi). Specializing in premium portraits and events, Youssef Nhidi captures the essence of every moment.';
  const defaultKeywords = settings?.seo_keywords || 
    'Josef Nhidi, Youssef Nhidi, Nhidi, Josef, Youssef, photography, portrait photographer, event photographer, portfolio';
  
  const defaultImage = '/og-image.png'; 
  const siteUrl = 'https://josefnhidi.com'; // Update to your actual domain

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || `${siteUrl}${defaultImage}`;
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* ── PRIMARY META ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="Josef Nhidi" />
      <link rel="canonical" href={metaUrl} />
      {settings?.google_verification_tag && (
        <meta name="google-site-verification" content={settings.google_verification_tag} />
      )}

      {/* ── OPEN GRAPH (Facebook, LinkedIn, WhatsApp previews) ── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      {articlePublishedAt && (
        <meta property="article:published_time" content={articlePublishedAt} />
      )}

      {/* ── TWITTER CARD ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* ── EXTRAS ── */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content={settings?.primary_color || "#0a0a0a"} />
    </Helmet>
  );
};

export default SEO;
