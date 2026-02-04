import pool from '../config/db.js';

/**
 * Create a new blog post
 * POST /api/blog
 */
export const createPost = async (req, res) => {
    try {
        const {
            title,
            slug,
            content,
            excerpt,
            featuredImage,
            category,
            tags,
            author, // author object or string
            status,
            publishDate,
            seo // Ignoring SEO for SQL simplicity for now, or store as JSON if needed
        } = req.body;

        // Validation
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, and category are required'
            });
        }

        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const authorName = author?.name || 'Arohan Team';
        const finalStatus = status || 'draft';
        const finalPublishDate = publishDate || new Date();

        // Create blog post
        const result = await pool.query(
            `INSERT INTO blogs 
            (title, slug, content, excerpt, featured_image, category, tags, author_name, status, publish_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [title, finalSlug, content, excerpt, featuredImage, category, tags || [], authorName, finalStatus, finalPublishDate]
        );

        return res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create Blog Error:', error);

        // Handle duplicate slug error (Postgres error 23505)
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'A blog post with this slug already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to create blog post',
            error: error.message
        });
    }
};

/**
 * Get all blog posts with filters and pagination
 * GET /api/blog
 */
export const getAllPosts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            status = 'published',
            search
        } = req.query;

        let query = 'SELECT * FROM blogs';
        let countQuery = 'SELECT COUNT(*) FROM blogs';
        const params = [];
        const conditions = [];

        // Filter by status
        if (status && status !== 'all') {
            params.push(status);
            conditions.push(`status = $${params.length}`);
        }

        // Filter by category
        if (category) {
            params.push(category);
            conditions.push(`category = $${params.length}`);
        }

        // Search in title
        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(title ILIKE $${params.length})`);
        }

        // Apply conditions
        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        // Sorting
        query += ' ORDER BY publish_date DESC';

        // Pagination
        const limitVal = parseInt(limit);
        const offset = (parseInt(page) - 1) * limitVal;

        params.push(limitVal);
        query += ` LIMIT $${params.length}`;

        params.push(offset);
        query += ` OFFSET $${params.length}`;

        // Execute queries
        const blogsResult = await pool.query(query, params); // Use sliced params for logic if needed, but here simple push works as LIMIT/OFFSET are last

        // Wait, params index must verify.
        // If status($1), cat($2), search($3), LIMIT($4), OFFSET($5)
        // Correct.

        // For count query, we need ONLY the filter params, not limit/offset
        const filterParams = params.slice(0, params.length - 2);
        const countResult = await pool.query(countQuery, filterParams);

        const total = parseInt(countResult.rows[0].count);

        return res.status(200).json({
            success: true,
            data: blogsResult.rows,
            pagination: {
                page: parseInt(page),
                limit: limitVal,
                total,
                pages: Math.ceil(total / limitVal)
            }
        });

    } catch (error) {
        console.error('Get Blogs Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blog posts',
            error: error.message
        });
    }
};

/**
 * Get single blog post by slug
 * GET /api/blog/:slug
 */
export const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await pool.query('SELECT * FROM blogs WHERE slug = $1', [slug]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Increment view count async
        await pool.query('UPDATE blogs SET view_count = view_count + 1 WHERE slug = $1', [slug]);

        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get Blog Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blog post',
            error: error.message
        });
    }
};

/**
 * Update blog post
 * PUT /api/blog/:id
 */
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, status, category } = req.body;

        // Dynamic update is complex in SQL without ORM, implementing simple required field update for now
        // Or using COALESCE

        const result = await pool.query(
            `UPDATE blogs 
            SET title = COALESCE($1, title),
                content = COALESCE($2, content),
                status = COALESCE($3, status),
                category = COALESCE($4, category),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *`,
            [title, content, status, category, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog post updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update Blog Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update blog post',
            error: error.message
        });
    }
};

/**
 * Delete blog post
 * DELETE /api/blog/:id
 */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog post deleted successfully'
        });

    } catch (error) {
        console.error('Delete Blog Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete blog post',
            error: error.message
        });
    }
};

/**
 * Get blog categories
 * GET /api/blog/categories
 */
export const getCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT category FROM blogs');
        const categories = result.rows.map(row => row.category);

        return res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('Get Categories Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};
