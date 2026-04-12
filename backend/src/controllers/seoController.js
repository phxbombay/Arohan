/**
 * SEO XML Controller
 * Used to dynamically serve the Single Page Application's route map
 * directly back to Googlebot crawlers for optimum web indexing.
 */

export const generateSitemap = (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || 'https://arohanhealth.com';
    
    const staticRoutes = [
      '',
      '/about',
      '/projects',
      '/api-integration',
      '/elderly-families',
      '/healthcare-professionals',
      '/corporate-insurance',
      '/pricing',
      '/how-it-works',
      '/contact'
    ];

    let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXML += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Map through physical endpoints.
    // In a future scale-up, database query mapping (i.e. /blog/post-1) would trigger here.
    staticRoutes.forEach(route => {
      sitemapXML += `  <url>\n`;
      sitemapXML += `    <loc>${baseUrl}${route}</loc>\n`;
      sitemapXML += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemapXML += `    <changefreq>weekly</changefreq>\n`;
      sitemapXML += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
      sitemapXML += `  </url>\n`;
    });

    sitemapXML += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(sitemapXML);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate sitemap XML map' });
  }
};
