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
  schema,
}) => {
  const siteName = settings?.site_title || 'Josef Nhidi Photography';

  const defaultDescription =
    settings?.seo_description ||
    'Professional photography by Josef Nhidi, based in Tunisia. Specializing in portraits, events, and luxury visual storytelling.';

  const defaultKeywords =
    settings?.seo_keywords ||
    'Josef Nhidi, Youssef Nhidi, photographer Tunisia, portrait photographer Tunisia, event photographer Tunisia';

  const siteUrl = 'https://josefnhidi.me';
  const defaultImage = '/og-image.png';

  // ✅ FIXED IMAGE LOGIC
  let metaImage;
  if (image) {
    metaImage = image.startsWith('http')
      ? image
      : `${siteUrl}${image}`;
  } else {
    metaImage = `${siteUrl}${defaultImage}`;
  }

  // ✅ URL FIX
  let metaUrl;
  if (url) {
    metaUrl = url.startsWith('http')
      ? url
      : `${siteUrl}${url}`;
  } else {
    metaUrl = siteUrl;
  }

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;

  // ✅ TUNISIA LOCAL BUSINESS SCHEMA
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Josef Nhidi",
    "url": siteUrl,
    "image": metaImage,
    "description": metaDescription,
    "telephone": "+21652287170", // ⚠️ حط رقمك
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Gabès",
      "addressCountry": "TN"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Tunisia"
    },
    "sameAs": [
      settings?.instagram || "https://www.instagram.com/josef_nhidi",
      settings?.linkedin || "https://www.linkedin.com/in/youssef-nhidi"
    ]
  };

  // ✅ BREADCRUMB
  const breadcrumbSchema =
    url && url !== '/'
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": siteUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": title || "Page",
              "item": metaUrl
            }
          ]
        }
      : null;

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* ✅ PRIMARY META */}
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={metaDescription} />
      <meta key="author" name="author" content="Josef Nhidi" />
      <link key="canonical" rel="canonical" href={metaUrl} />

      {settings?.google_verification_tag && (
        <meta
          key="google-verify"
          name="google-site-verification"
          content={settings.google_verification_tag}
        />
      )}

      {/* ✅ OPEN GRAPH */}
      <meta key="og-type" property="og:type" content={type} />
      <meta key="og-title" property="og:title" content={fullTitle} />
      <meta key="og-description" property="og:description" content={metaDescription} />
      <meta key="og-image" property="og:image" content={metaImage} />
      <meta key="og-url" property="og:url" content={metaUrl} />
      <meta key="og-site-name" property="og:site_name" content={siteName} />
      <meta key="og-locale" property="og:locale" content="fr_FR" />

      {/* ✅ TWITTER */}
      <meta key="twitter-card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter-title" name="twitter:title" content={fullTitle} />
      <meta key="twitter-description" name="twitter:description" content={metaDescription} />
      <meta key="twitter-image" name="twitter:image" content={metaImage} />

      {/* ✅ ROBOTS */}
      <meta key="robots" name="robots" content="index, follow, max-image-preview:large" />

      {/* ✅ STRUCTURED DATA */}
      <script key="schema-main" type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>

      {breadcrumbSchema && (
        <script key="schema-breadcrumb" type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* ✅ EXTRA */}
      <meta
        key="theme-color"
        name="theme-color"
        content={settings?.primary_color || "#000000"}
      />
    </Helmet>
  );
};

export default SEO;