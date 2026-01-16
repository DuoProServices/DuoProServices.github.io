import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEOHelmet({ 
  title, 
  description, 
  keywords, 
  image = '/og-image.jpg',
  url 
}: SEOHelmetProps) {
  const { language } = useLanguage();
  
  const defaultTitles = {
    en: 'DuoProServices - Canadian Tax Services | Personal & Small Business Tax Returns',
    fr: 'DuoProServices - Services fiscaux canadiens | Déclarations fiscales personnelles et petites entreprises'
  };
  
  const defaultDescriptions = {
    en: 'Professional Canadian tax services for individuals, newcomers, and small businesses. Expert tax preparation, GST/HST filing, and personalized tax planning in English and French.',
    fr: 'Services fiscaux canadiens professionnels pour particuliers, nouveaux arrivants et petites entreprises. Préparation fiscale experte, déclaration TPS/TVH et planification fiscale personnalisée en anglais et français.'
  };
  
  const defaultKeywords = {
    en: 'canadian tax services, tax preparation canada, personal tax return, small business tax, GST HST filing, tax accountant, tax consultant, newcomer taxes canada, bilingual tax services',
    fr: 'services fiscaux canadiens, préparation fiscale canada, déclaration impôt personnel, impôt petite entreprise, déclaration TPS TVH, comptable fiscal, consultant fiscal, impôts nouveaux arrivants canada, services fiscaux bilingues'
  };
  
  const pageTitle = title || defaultTitles[language];
  const pageDescription = description || defaultDescriptions[language];
  const pageKeywords = keywords || defaultKeywords[language];
  const pageUrl = url || `https://duoproservices.ca${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  
  // Structured Data for Local Business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "name": "DuoProServices",
    "description": pageDescription,
    "url": "https://duoproservices.ca",
    "logo": "https://duoproservices.ca/logo.png",
    "image": `https://duoproservices.ca${image}`,
    "telephone": "+1-XXX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CA"
    },
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "Canada"
    },
    "availableLanguage": ["English", "French"],
    "serviceType": [
      "Personal Tax Return",
      "Small Business Tax",
      "GST/HST Filing",
      "Tax Planning",
      "Tax Consulting"
    ],
    "sameAs": [
      "https://facebook.com/duoproservices",
      "https://linkedin.com/company/duoproservices"
    ]
  };
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Language */}
      <html lang={language === 'fr' ? 'fr-CA' : 'en-CA'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`https://duoproservices.ca${image}`} />
      <meta property="og:locale" content={language === 'fr' ? 'fr_CA' : 'en_CA'} />
      <meta property="og:site_name" content="DuoProServices" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={`https://duoproservices.ca${image}`} />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="CA" />
      <meta name="geo.placename" content="Canada" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content={language === 'fr' ? 'French' : 'English'} />
      <meta name="author" content="DuoProServices" />
      <meta name="copyright" content="DuoProServices © 2026" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
