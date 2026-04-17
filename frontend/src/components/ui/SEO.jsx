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
    'Professional photographer in Tunisia providing premium photography services for portraits and events. Cinematic visual storytelling by Josef Nhidi.';

  const defaultKeywords =
    settings?.seo_keywords ||
    'Josef Nhidi, Youssef Nhidi, photographer Tunisia, portrait photographer Tunisia, event photographer Tunisia, professional photography services';

  const siteUrl = 'https://josefnhidi.me';
  
  // ✅ LOGO / FAVICON LOGIC (Priority: Page Image > Site Logo > Default)
  const siteLogo = settings?.site_logo;
  const defaultImage = siteLogo || '/og-image.png';

  let metaImage;
  if (image) {
    metaImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  } else {
    metaImage = defaultImage.startsWith('http') ? defaultImage : `${siteUrl}${defaultImage}`;
  }

  // ✅ URL FIX
  let metaUrl;
  if (url) {
    metaUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
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

  const allSchemas = [finalSchema];
  if (breadcrumbSchema) {
    allSchemas.push(breadcrumbSchema);
  }

  return (
    <Helmet>
      {/* ✅ PRIMARY META */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="author" content="Josef Nhidi" />
      <link rel="canonical" href={metaUrl} />

      {/* ✅ DYNAMIC BRANDING (Favicon) */}
      {siteLogo && (
        <>
          <link rel="icon" type="image/webp" href={siteLogo} />
          <link rel="apple-touch-icon" href={siteLogo} />
        </>
      )}

      {settings?.google_verification_tag && (
        <meta
          name="google-site-verification"
          content={settings.google_verification_tag}
        />
      )}

      {/* ✅ OPEN GRAPH */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />

      {/* ✅ TWITTER */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* ✅ ROBOTS */}
      <meta name="robots" content="index, follow, max-image-preview:large" />

      {/* ✅ STRUCTURED DATA (Merged) */}
      <script type="application/ld+json">
        {JSON.stringify(allSchemas)}
      </script>

      {/* ✅ EXTRA */}
      <meta
        name="theme-color"
        content={settings?.primary_color || "#000000"}
      />
    </Helmet>
  );
};

export default SEO;