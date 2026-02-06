/**
 * SEO Utilities
 * Helper functions for generating SEO meta tags and structured data
 */

/**
 * Generate comprehensive meta tags for a page
 * @param {Object} page - Page configuration
 * @returns {Object} Meta tags object
 */
export const generateMetaTags = (page) => {
    const baseUrl = 'https://arohanhealth.com';
    const defaultImage = `${baseUrl}/og-image.jpg`;

    return {
        title: page.title ? `${page.title} | Arohan Health` : 'Arohan Health - AI-Powered Emergency Prevention',
        description: page.description || 'AI-powered wearable technology for emergency prevention and health monitoring. Peace of mind for families, independence for everyone.',
        keywords: page.keywords?.join(', ') || 'health monitoring, emergency prevention, AI wearable, fall detection, heart monitoring',
        canonical: `${baseUrl}${page.path}`,

        // Open Graph tags
        ogTitle: page.title || 'Arohan Health',
        ogDescription: page.description || 'AI-powered emergency prevention and health monitoring',
        ogImage: page.image || defaultImage,
        ogUrl: `${baseUrl}${page.path}`,
        ogType: page.type || 'website',

        // Twitter Card tags
        twitterCard: 'summary_large_image',
        twitterTitle: page.title || 'Arohan Health',
        twitterDescription: page.description || 'AI-powered emergency prevention',
        twitterImage: page.image || defaultImage,
        twitterSite: '@arohanhealth',
        twitterCreator: '@arohanhealth'
    };
};

/**
 * Generate JSON-LD structured data for Organization
 */
export const generateOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Arohan Health',
        url: 'https://arohanhealth.com',
        logo: 'https://arohanhealth.com/logo.png',
        description: 'AI-powered wearable technology for emergency prevention and health monitoring',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Bengaluru',
            addressLocality: 'Bengaluru',
            addressRegion: 'Karnataka',
            postalCode: '560001',
            addressCountry: 'IN'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-80-4567-8900',
            contactType: 'Customer Service',
            email: 'support@arohanhealth.com',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi', 'kn']
        },
        sameAs: [
            'https://facebook.com/arohanhealth',
            'https://twitter.com/arohanhealth',
            'https://instagram.com/arohanhealth',
            'https://linkedin.com/company/arohanhealth'
        ]
    };
};

/**
 * Generate JSON-LD structured data for Product
 */
export const generateProductSchema = (product) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name || 'Arohan Health Wearable',
        description: product.description || 'AI-powered health monitoring wearable with emergency prevention',
        image: product.image || 'https://arohanhealth.com/product-image.jpg',
        brand: {
            '@type': 'Brand',
            name: 'Arohan Health'
        },
        offers: {
            '@type': 'Offer',
            price: product.price || '0',
            priceCurrency: 'INR',
            availability: 'https://schema.org/PreOrder',
            url: 'https://arohanhealth.com/products'
        },
        aggregateRating: product.rating ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating.value,
            reviewCount: product.rating.count
        } : undefined
    };
};

/**
 * Generate JSON-LD structured data for FAQ
 */
export const generateFAQSchema = (faqs) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
};

/**
 * Generate JSON-LD structured data for Article/Blog Post
 */
export const generateArticleSchema = (article) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: article.image,
        author: {
            '@type': 'Person',
            name: article.author || 'Arohan Health Team'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Arohan Health',
            logo: {
                '@type': 'ImageObject',
                url: 'https://arohanhealth.com/logo.png'
            }
        },
        datePublished: article.publishedDate,
        dateModified: article.modifiedDate || article.publishedDate
    };
};

/**
 * Generate JSON-LD structured data for Breadcrumbs
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `https://arohanhealth.com${crumb.path}`
        }))
    };
};

/**
 * Generate JSON-LD structured data for Medical Organization
 */
export const generateMedicalOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'MedicalOrganization',
        name: 'Arohan Health',
        url: 'https://arohanhealth.com',
        description: 'Healthcare technology company specializing in AI-powered emergency prevention',
        medicalSpecialty: [
            'Emergency Medicine',
            'Cardiology',
            'Geriatrics',
            'Preventive Medicine'
        ],
        availableService: {
            '@type': 'MedicalTherapy',
            name: 'Health Monitoring and Emergency Prevention',
            description: 'Continuous health monitoring with AI-powered emergency detection and prevention'
        }
    };
};

export default {
    generateMetaTags,
    generateOrganizationSchema,
    generateProductSchema,
    generateFAQSchema,
    generateArticleSchema,
    generateBreadcrumbSchema,
    generateMedicalOrganizationSchema
};
