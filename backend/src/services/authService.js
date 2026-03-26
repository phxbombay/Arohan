import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import { userRepository } from '../repositories/userRepository.js';
import { tokenRepository } from '../repositories/tokenRepository.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { otpService } from './otpService.js';
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
        const { full_name, email, password, role = 'patient', phone_number } = userData;

        logger.info('AuthService register() - Start', { email, role, phone_number, passwordLength: password.length });

        // Check if user exists
        const exists = await userRepository.emailExists(email);
        if (exists) {
            logger.warn('AuthService register() - User exists', { email });
            throw new ConflictError('User with this email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        logger.info('AuthService register() - Password hashed', { hashLength: password_hash.length });

        // Create user (Active by default, no OTP)
        const user = await userRepository.create({
            full_name,
            email,
            password_hash,
            role,
            phone_number,
            is_active: true // Auto-activate
        });

        logger.info('AuthService register() - User created in DB', { userId: user.user_id });

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
            refreshToken,
            message: 'Registration successful'
        };
    },

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @param {string} [totpToken]
     * @returns {Promise<Object>}
     */
    async login(email, password, totpToken) {
        logger.info('AuthService login attempt', { email });

        // Find user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            logger.warn('AuthService login failure - User not found', { email });
            throw new AuthenticationError('Invalid email or password');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            logger.warn('AuthService login failure - Invalid password', { email });
            throw new AuthenticationError('Invalid email or password');
        }

        // Check if account is active
        if (!user.is_active) {
            throw new AuthenticationError('Account not verified. Please verify your account via OTP.', { unverified: true, email: user.email, user_id: user.user_id });
        }

        // Two-Factor Authentication interjection
        if (user.two_factor_enabled) {
            if (!totpToken) {
                logger.info('AuthService login() - 2FA required', { email });
                return {
                    twoFactorRequired: true,
                    user_id: user.user_id,
                    email: user.email,
                    role: user.role,
                    message: 'Two-factor authentication required.'
                };
            }

            const verified = speakeasy.totp.verify({
                secret: user.two_factor_secret,
                encoding: 'base32',
                token: totpToken,
            });

            if (!verified) {
                logger.warn('AuthService login failure - Invalid 2FA token', { email });
                throw new AuthenticationError('Invalid two-factor authentication code');
            }
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
     * Verify registration OTP
     */
    async verifyRegistration(userId, otpCode) {
        const verified = await otpService.verifyOTP(userId, otpCode, 'registration');
        if (!verified) {
            throw new AuthenticationError('Invalid or expired verification code');
        }

        await userRepository.activateAccount(userId);

        // Generate tokens for immediate login
        const user = await userRepository.findById(userId);
        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await tokenRepository.create(userId, refreshTokenHash);

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
     * Resend registration OTP
     */
    async resendRegistrationOTP(userId) {
        const user = await userRepository.findById(userId);
        // Fail silently if user doesn't exist or is already verified to prevent account enumeration
        if (!user || user.is_active) {
            return true;
        }

        await otpService.sendRegistrationOTP(user);
        return true;
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

