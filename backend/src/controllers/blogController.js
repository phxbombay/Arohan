import pool from '../config/db.js';
import crypto from 'crypto';

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
            publishDate
        } = req.body;

        // Validation
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, and category are required'
            });
        }

        const id = crypto.randomUUID();
        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const authorName = author?.name || 'Arohan Team';
        const finalStatus = status || 'draft';
        const finalPublishDate = publishDate || new Date();

        // Create blog post
        await pool.query(
            `INSERT INTO blogs 
            (id, title, slug, content, excerpt, featured_image, category, tags, author_name, status, publish_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, finalSlug, content, excerpt, featuredImage, category, JSON.stringify(tags || []), authorName, finalStatus, finalPublishDate]
        );

        return res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: { id, title, slug: finalSlug, status: finalStatus }
        });

    } catch (error) {
        console.error('Create Blog Error:', error);

        // Handle duplicate slug error (MySQL error 1062)
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
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
        let countQuery = 'SELECT COUNT(*) as count FROM blogs';
        const params = [];
        const conditions = [];

        // Filter by status
        if (status && status !== 'all') {
            params.push(status);
            conditions.push(`status = ?`);
        }

        // Filter by category
        if (category) {
            params.push(category);
            conditions.push(`category = ?`);
        }

        // Search in title
        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(title LIKE ?)`);
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

        query += ` LIMIT ? OFFSET ?`;
        const queryParams = [...params, limitVal, offset];

        // Execute queries
        const [blogs] = await pool.query(query, queryParams);
        const [countResult] = await pool.query(countQuery, params);

        const total = parseInt(countResult[0].count);

        return res.status(200).json({
            success: true,
            data: blogs,
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

        const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ?', [slug]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Increment view count async
        pool.query('UPDATE blogs SET view_count = view_count + 1 WHERE slug = ?', [slug]).catch(err => console.error('View count update error:', err));

        return res.status(200).json({
            success: true,
            data: rows[0]
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

        const query = `
            UPDATE blogs 
            SET title = COALESCE(?, title),
                content = COALESCE(?, content),
                status = COALESCE(?, status),
                category = COALESCE(?, category),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        const [result] = await pool.query(query, [title, content, status, category, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog post updated successfully'
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

        const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
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
        const [rows] = await pool.query('SELECT DISTINCT category FROM blogs');
        const categories = rows.map(row => row.category);

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
