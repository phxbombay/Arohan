import express from 'express';
import { registerUser, loginUser, refreshToken, logoutUser } from '../controllers/authController.js';
import { validate, registerSchema, loginSchema } from '../validators/schemas.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { setupTwoFactor, verifyTwoFactor, validateTwoFactor } from '../controllers/twoFactorController.js';
import { requireAuth } from '../middleware/rbac.js';

const router = express.Router();

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: SecurePass123
 *                 description: Must contain uppercase, lowercase, and number
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, admin]
 *                 default: patient
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', authLimiter, validate(registerSchema), registerUser);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);

// ... previous routes ...

/**
 * @swagger
 * /auth/2fa/setup:
 *   post:
 *     summary: Setup 2FA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR code generated
 */
router.post('/2fa/setup', requireAuth, setupTwoFactor);

/**
 * @swagger
 * /auth/2fa/verify:
 *   post:
 *     summary: Verify and enable 2FA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA enabled
 */
router.post('/2fa/verify', requireAuth, verifyTwoFactor);

/**
 * @swagger
 * /auth/2fa/validate:
 *   post:
 *     summary: Validate 2FA token during login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token valid
 */
router.post('/2fa/validate', validateTwoFactor);

export default router;
