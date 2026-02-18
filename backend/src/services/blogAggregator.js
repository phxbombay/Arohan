import Parser from 'rss-parser';
import pool from '../config/db.js';
import crypto from 'crypto';

const parser = new Parser();

// Health-related RSS feeds to aggregate from
const healthFeeds = [
    'https://www.healthline.com/feeds/rss',
    'https://www.medicalnewstoday.com/rss',
    'https://health.harvard.edu/blog/feed',
    'https://www.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC',
    'https://www.mayoclinic.org/rss'
];

/**
 * Extract image URL from HTML content
 */
function extractImageFromContent(content) {
    if (!content) return null;
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
}

/**
 * Extract tags from item
 */
function extractTags(item) {
    const tags = [];
    if (item.categories) {
        tags.push(...item.categories);
    }
    return tags.slice(0, 5);
}

/**
 * Fetch articles from RSS feeds
 */
async function fetchFromFeeds() {
    let fetchedArticles = [];

    for (const feedUrl of healthFeeds) {
        try {
            console.log(`Fetching from: ${feedUrl}`);
            const feed = await parser.parseURL(feedUrl);

            const articles = feed.items.slice(0, 5).map(item => ({
                title: item.title || 'Untitled',
                content: item.content || item.contentSnippet || item.description || '',
                excerpt: (item.contentSnippet || item.description || '').substring(0, 250),
                link: item.link,
                publishDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                category: 'Healthcare',
                featuredImage: extractImageFromContent(item.content || item.description) || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
                author: {
                    name: item.creator || feed.title || 'External Source'
                },
                tags: extractTags(item),
                source: feedUrl,
                isExternal: true
            }));

            fetchedArticles = fetchedArticles.concat(articles);

        } catch (error) {
            console.error(`Error fetching from ${feedUrl}:`, error.message);
        }
    }

    return fetchedArticles;
}

/**
 * Generate unique slug
 */
function generateUniqueSlug(title, existingSlugs) {
    let baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

/**
 * Save articles to database
 */
async function saveArticlesToDatabase(articles) {
    let saved = 0;
    let skipped = 0;

    try {
        // Get existing slugs to avoid duplicates
        const [slugRows] = await pool.query('SELECT slug FROM blogs');
        const existingSlugs = slugRows.map(row => row.slug);

        for (const article of articles) {
            try {
                // Check if article already exists (by original link in external_source)
                // MySQL JSON matching
                const [existsRows] = await pool.query(
                    `SELECT id FROM blogs WHERE JSON_UNQUOTE(JSON_EXTRACT(external_source, "$.url")) = ?`,
                    [article.link]
                );

                if (existsRows.length > 0) {
                    skipped++;
                    continue;
                }

                // Generate unique slug
                const slug = generateUniqueSlug(article.title, existingSlugs);
                existingSlugs.push(slug);

                // External Source Object
                const externalSource = {
                    url: article.link,
                    fetchedFrom: article.source,
                    fetchedAt: new Date().toISOString()
                };

                // Author Name
                const authorName = article.author?.name || 'External Source';
                const id = crypto.randomUUID();

                // Create blog post
                await pool.query(
                    `INSERT INTO blogs 
                    (id, title, slug, content, excerpt, featured_image, category, tags, author_name, status, publish_date, external_source)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id,
                        article.title,
                        slug,
                        article.content,
                        article.excerpt,
                        article.featuredImage,
                        article.category,
                        JSON.stringify(article.tags || []),
                        authorName,
                        'published',
                        article.publishDate,
                        JSON.stringify(externalSource)
                    ]
                );

                saved++;

            } catch (error) {
                console.error(`Error saving article "${article.title}":`, error.message);
            }
        }
    } catch (dbError) {
        console.error('Database Error in Aggregator:', dbError);
    }

    return { saved, skipped };
}

/**
 * Main aggregation function
 */
export const aggregateHealthArticles = async (req, res) => {
    try {
        console.log('Starting health article aggregation...');

        // Fetch articles from RSS feeds
        const articles = await fetchFromFeeds();
        console.log(`Fetched ${articles.length} articles from RSS feeds`);

        // Save to database
        const result = await saveArticlesToDatabase(articles);

        console.log(`Aggregation complete: ${result.saved} saved, ${result.skipped} skipped`);

        if (res) {
            return res.status(200).json({
                success: true,
                message: 'Article aggregation completed',
                data: result
            });
        }

        return result;

    } catch (error) {
        console.error('Aggregation Error:', error);

        if (res) {
            return res.status(500).json({
                success: false,
                message: 'Failed to aggregate articles',
                error: error.message
            });
        }

        throw error;
    }
};

/**
 * Schedule daily aggregation (call this on server startup)
 */
export const scheduleDailyAggregation = () => {
    // Run immediately on startup (non-blocking)
    aggregateHealthArticles().catch(err => console.error('Initial aggregation failed:', err));

    // Then run every 24 hours
    setInterval(() => {
        console.log('Running scheduled health article aggregation...');
        aggregateHealthArticles().catch(err => console.error('Scheduled aggregation failed:', err));
    }, 24 * 60 * 60 * 1000);

    console.log('Daily health article aggregation scheduled');
};
