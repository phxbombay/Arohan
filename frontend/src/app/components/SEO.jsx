import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * SEO Component with Open Graph and Twitter Card support
 * Provides comprehensive meta tags for SEO and social media sharing
 */
export function SEO({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author = 'Arohan Health',
    twitterCard = 'summary_large_image',
    twitterSite = '@ArohanHealth',
    locale = 'en_US',
    siteName = 'Arohan Health',
    canonical
}) {
    // Default values
    const defaultImage = 'https://arohanhealth.com/images/og-default.jpg';
    const defaultUrl = 'https://arohanhealth.com';
    const fullTitle = title ? `${title} | Arohan Health` : 'Arohan Health - Comprehensive Health Monitoring Platform';
    const fullUrl = url || canonical || defaultUrl;
    const ogImage = image || defaultImage;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {author && <meta name="author" content={author} />}

            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={locale} />

            {/* Twitter */}
            <meta property="twitter:card" content={twitterCard} />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />
            {twitterSite && <meta property="twitter:site" content={twitterSite} />}
            {author && <meta property="twitter:creator" content={twitterSite} />}

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>
    );
}

SEO.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.oneOf(['website', 'article', 'product', 'profile']),
    author: PropTypes.string,
    twitterCard: PropTypes.oneOf(['summary', 'summary_large_image', 'app', 'player']),
    twitterSite: PropTypes.string,
    locale: PropTypes.string,
    siteName: PropTypes.string,
    canonical: PropTypes.string
};

export default SEO;
