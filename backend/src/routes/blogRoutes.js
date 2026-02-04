import express from 'express';
import * as blogController from '../controllers/blogController.js';

const router = express.Router();

/**
 * @route   POST /api/blog
 * @desc    Create new blog post
 * @access  Admin only (add auth middleware)
 */
router.post('/', blogController.createPost);

/**
 * @route   GET /api/blog
 * @desc    Get all blog posts with filters
 * @access  Public
 * @query   page, limit, category, tag, status, search
 */
router.get('/', blogController.getAllPosts);

/**
 * @route   GET /api/blog/categories
 * @desc    Get all unique categories
 * @access  Public
 */
router.get('/categories', blogController.getCategories);

/**
 * @route   GET /api/blog/:slug
 * @desc    Get single blog post by slug
 * @access  Public
 */
router.get('/:slug', blogController.getPostBySlug);

/**
 * @route   PUT /api/blog/:id
 * @desc    Update blog post
 * @access  Admin only (add auth middleware)
 */
router.put('/:id', blogController.updatePost);

/**
 * @route   DELETE /api/blog/:id
 * @desc    Delete blog post
 * @access  Admin only (add auth middleware)
 */
router.delete('/:id', blogController.deletePost);

export default router;
