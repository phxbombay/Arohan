
import pool from './src/config/db.js';

const migrate = async () => {
    console.log('🔄 Starting Database Migration...');
    try {
        // Create Blogs Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                featured_image VARCHAR(500),
                category VARCHAR(50) DEFAULT 'Healthcare',
                tags TEXT[], 
                author_name VARCHAR(100) DEFAULT 'Arohan Team',
                status VARCHAR(20) DEFAULT 'draft',
                view_count INTEGER DEFAULT 0,
                publish_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
        `);
        console.log('✅ Blogs table created.');

        // Seeding Sample Blog
        const existing = await pool.query('SELECT count(*) FROM blogs');
        if (parseInt(existing.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO blogs (title, slug, content, excerpt, category, status, publish_date)
                VALUES (
                    'Welcome to Arohan Health',
                    'welcome-to-arohan',
                    '<p>We are excited to launch our new health platform...</p>',
                    'Introduction to our platform.',
                    'Product Updates',
                    'published',
                    NOW()
                )
            `);
            console.log('🌱 Sample blog seeded.');
        }

        console.log('✅ Migration Complete.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    }
};

migrate();
