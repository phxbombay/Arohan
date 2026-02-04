import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://arohan-health.com'; // Production domain

const routes = [
    '/',
    '/how-it-works',
    '/products',
    '/pricing',
    '/about',
    '/contact',
    '/for-elderly',
    '/for-doctors',
    '/for-corporate',
    '/partners',
    '/impact',
    '/early-access',
    '/nearby-hospitals',
    '/partner-hospitals',
    '/faq',
    '/help-center',
    '/privacy',
    '/terms',
    '/blog'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
    <url>
        <loc>${DOMAIN}${route}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>`).join('')}
</urlset>`;

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');

fs.writeFileSync(outputPath, sitemap);
console.log(`Sitemap generated at ${outputPath}`);
