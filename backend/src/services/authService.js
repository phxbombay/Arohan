import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { userRepository } from '../repositories/userRepository.js';
import { tokenRepository } from '../repositories/tokenRepository.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import logger from '../config/logger.js';
import { ConflictError, AuthenticationError, NotFoundError } from '../utils/errors.js';

/**
 * Authentication Service - Business Logic Layer
 * Handles all authentication-related business logic
 */

export const authService = {
    /**
     * Register a new user
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    async register(userData) {
        const { full_name, email, password, role = 'patient' } = userData;

        // Check if user exists
        const exists = await userRepository.emailExists(email);
        if (exists) {
            throw new ConflictError('User with this email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const user = await userRepository.create({
            full_name,
            email,
            password_hash,
            role
        });

        // Generate tokens
        const accessToken = generateAccessToken(user.user_id);
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        // Store refresh token
        await tokenRepository.create(user.user_id, refreshTokenHash);

        return {
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    },

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    async login(email, password) {
        // Find user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.user_id);
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        // Store refresh token
        await tokenRepository.create(user.user_id, refreshTokenHash);

        const loginResult = {
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };

        logger.info('AuthService login() - Returning result', {
            hasRole: !!loginResult.user.role,
            role: loginResult.user.role,
            userKeys: Object.keys(loginResult.user)
        });

        return loginResult;
    },

    /**
     * Refresh access token
     * @param {string} refreshToken 
     * @returns {Promise<Object>}
     */
    async refreshAccessToken(refreshToken) {
        if (!refreshToken) {
            throw new AuthenticationError('Refresh token required');
        }

        // Hash and find token
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const storedToken = await tokenRepository.findValid(refreshTokenHash);

        if (!storedToken) {
            throw new AuthenticationError('Invalid or expired refresh token');
        }

        // Get user
        const user = await userRepository.findById(storedToken.user_id);
        if (!user) {
            throw new NotFoundError('User');
        }

        // Revoke old token (token rotation)
        await tokenRepository.revoke(storedToken.id);

        // Generate new tokens
        const newAccessToken = generateAccessToken(user.user_id);
        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

        // Store new refresh token
        await tokenRepository.create(user.user_id, newRefreshTokenHash);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    },

    /**
     * Logout user
     * @param {string} refreshToken 
     * @returns {Promise<boolean>}
     */
    async logout(refreshToken) {
        if (!refreshToken) {
            return true; // Already logged out
        }

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await tokenRepository.revokeByHash(refreshTokenHash);

        return true;
    },

    /**
     * Logout from all devices
     * @param {string} userId 
     * @returns {Promise<number>}
     */
    async logoutAllDevices(userId) {
        return await tokenRepository.revokeAllForUser(userId);
    }
};

