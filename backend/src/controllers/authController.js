import { authService } from '../services/authService.js';
import logger from '../config/logger.js';

/**
 * Helper to set refresh token cookie
 */
const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    res.cookie('refreshToken', token, cookieOptions);
};

// @desc    Register a new user
// @route   POST /v1/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { full_name, email, password, role } = req.body;

        const result = await authService.register({
            full_name,
            email,
            password,
            role
        });

        setTokenCookie(res, result.refreshToken);

        res.status(201).json({
            user_id: result.user.user_id,
            full_name: result.user.full_name,
            email: result.user.email,
            role: result.user.role,
            accessToken: result.accessToken
        });
    } catch (error) {
        logger.error('Register Error:', { error: error.message, stack: error.stack });
        next(error);
    }
};

// @desc    Login user
// @route   POST /v1/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        logger.info('Login attempt', { email });

        const result = await authService.login(email, password);

        setTokenCookie(res, result.refreshToken);

        const loginResponse = {
            user_id: result.user.user_id,
            full_name: result.user.full_name,
            email: result.user.email,
            role: result.user.role,
            accessToken: result.accessToken
        };

        logger.info('Login successful - sending response', {
            email: loginResponse.email,
            role: loginResponse.role,
            roleType: typeof loginResponse.role
        });

        res.json(loginResponse);
    } catch (error) {
        logger.error('Login Error:', { error: error.message, stack: error.stack });
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /v1/auth/refresh-token
// @access  Public (via Cookie)
export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        const result = await authService.refreshAccessToken(refreshToken);

        setTokenCookie(res, result.refreshToken);

        res.json({
            accessToken: result.accessToken
        });
    } catch (error) {
        res.clearCookie('refreshToken');
        logger.error('Refresh Token Error:', { error: error.message });
        next(error);
    }
};

// @desc    Logout user
// @route   POST /v1/auth/logout
// @access  Public
export const logoutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        await authService.logout(refreshToken);

        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Logout Error:', { error: error.message });
        next(error);
    }
};
