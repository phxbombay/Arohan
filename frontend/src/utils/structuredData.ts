// JSON-LD Structured Data Generator
// Generates Schema.org structured data for SEO

export const generateOrganizationSchema = (): Record<string, any> => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hasprana Health Care Solutions Private Limited",
    "alternateName": "Arohan",
    "url": "https://arohan-health.com",
    "logo": "https://arohan-health.com/logo.png",
    "description": "AI-powered wearable emergency detection and first-aid platform for elderly care",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "addressCountry": "IN"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXX-XXXXX",
        "contactType": "Customer Service",
        "email": "info@haspranahealth.com",
        "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
        "https://www.linkedin.com/company/haspranahealth",
        "https://twitter.com/arohanhealth"
    ],
    "founder": [
        {
            "@type": "Person",
            "name": "Eswar Prasad M",
            "jobTitle": "R&D Director"
        },
        {
            "@type": "Person",
            "name": "Mrudhula U",
            "jobTitle": "CEO"
        }
    ]
});

export const generateProductSchema = (): Record<string, any> => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Arohan Wearable Emergency Detection Device",
    "description": "AI-powered wearable plugin chip for instant fall & cardiac emergency detection with 24/7 monitoring",
    "brand": {
        "@type": "Brand",
        "name": "Arohan"
    },
    "offers": {
        "@type": "Offer",
        "url": "https://arohan-health.com/products",
        "priceCurrency": "INR",
        "price": "0",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
            "@type": "Organization",
            "name": "Hasprana Health Care Solutions"
        }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127"
    },
    "image": "https://arohan-health.com/arohan-device.jpg"
});

interface FAQ {
    question: string;
    answer: string;
}

export const generateFAQSchema = (faqs: FAQ[]): Record<string, any> => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
});

interface BreadcrumbItem {
    name: string;
    url: string;
}

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]): Record<string, any> => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
    }))
});

interface Article {
    title: string;
    author: string;
    date: string;
    image: string;
}

export const generateArticleSchema = (article: Article): Record<string, any> => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": {
        "@type": "Person",
        "name": article.author
    },
    "datePublished": article.date,
    "image": article.image,
    "publisher": {
        "@type": "Organization",
        "name": "Arohan Health",
        "logo": {
            "@type": "ImageObject",
            "url": "https://arohan-health.com/logo.png"
        }
    }
});

export const generateLocalBusinessSchema = (): Record<string, any> => ({
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Arohan - Hasprana Health Care Solutions",
    "image": "https://arohan-health.com/office.jpg",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Technology Park",
        "addressLocality": "Bengaluru",
        "addressRegion": "KA",
        "postalCode": "560001",
        "addressCountry": "IN"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 12.9716,
        "longitude": 77.5946
    },
    "telephone": "+91-XXXXX-XXXXX",
    "priceRange": "₹₹"
});
