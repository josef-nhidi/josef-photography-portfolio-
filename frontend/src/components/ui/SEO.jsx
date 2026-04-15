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
  settings, 
  schema, // Custom JSON-LD schema object
}) => {
  const siteName = settings?.site_title || 'Josef Nhidi Photography';
  const defaultDescription = settings?.seo_description ||
    'Professional photography by Josef Nhidi. Specializing in premium portraits and events, Youssef Nhidi captures the essence of every moment with a cinematic and high-end aesthetic.';
  const defaultKeywords = settings?.seo_keywords || 
    'Josef Nhidi, Youssef Nhidi, photography, portrait photographer, event photographer, luxury photography, professional portfolio';
  
  const defaultImage = '/og-image.png'; 
  const siteUrl = 'https://josefnhidi.me'; 

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || (image?.startsWith('http') ? image : `${siteUrl}${defaultImage}`);
  const metaUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;

  // Create Default Schema (Photographer / LocalBusiness)
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Photographer",
    "name": "Josef Nhidi",
    "url": siteUrl,
    "image": metaImage,
    "description": defaultDescription,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Paris", // Default locality
      "addressCountry": "FR"
    },
    "sameAs": [
      "https://instagram.com/josefnhidi", // Placeholders, real ones will be picked up from settings if available
      "https://linkedin.com/in/josefnhidi"
    ]
  };

  // Create Breadcrumb Schema
  const breadcrumbSchema = url && url !== '/' ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Portfolios",
        "item": `${siteUrl}/portraits`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title || "Gallery",
        "item": metaUrl
      }
    ]
  } : null;

  const finalSchema = schema || defaultSchema;

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

      {/* ── OPEN GRAPH ── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {articlePublishedAt && (
        <meta property="article:published_time" content={articlePublishedAt} />
      )}

      {/* ── TWITTER CARD ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:creator" content="@josefnhidi" />

      {/* ── STRUCTURED DATA (JSON-LD) ── */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* ── EXTRAS ── */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="theme-color" content={settings?.primary_color || "#0a0a0a"} />
      <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
    </Helmet>
  );
};

export default SEO;
