import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonicalUrl, ogImage, type = 'website', jsonLd }) => {
  const siteUrl = 'https://antilabs.in'; // Replace with actual domain
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const fullOgImage = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/favicon.jpeg`;

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AntiLabs",
    "url": siteUrl,
    "logo": `${siteUrl}/favicon.jpeg`,
    "description": description || "AntiLabs delivers enterprise-grade cybersecurity, cloud architecture, and custom software."
  };

  return (
    <Helmet>
      <title>{title ? `${title} | AntiLabs` : 'AntiLabs — Next-Gen IT Solutions'}</title>
      <meta name="description" content={description || "AntiLabs delivers enterprise-grade cybersecurity, cloud architecture, and custom software — built to scale with your ambitions."} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || 'AntiLabs — Next-Gen IT Solutions'} />
      <meta property="og:description" content={description || "AntiLabs delivers enterprise-grade cybersecurity, cloud architecture, and custom software."} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'AntiLabs — Next-Gen IT Solutions'} />
      <meta name="twitter:description" content={description || "AntiLabs delivers enterprise-grade cybersecurity, cloud architecture, and custom software."} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
