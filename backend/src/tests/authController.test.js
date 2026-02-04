import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser } from '../controllers/authController.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
vi.mock('../config/db.js', () => ({
    default: {
        query: vi.fn(),
    },
}));

vi.mock('bcryptjs');
vi.mock('jsonwebtoken');

import pool from '../config/db.js';

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        vi.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                full_name: 'John Doe',
                email: 'john@example.com',
                password: 'SecurePass123',
                role: 'patient',
            };

            pool.query
                .mockResolvedValueOnce({ rows: [] }) // User doesn't exist
                .mockResolvedValueOnce({
                    rows: [
                        {
                            user_id: '123',
                            full_name: 'John Doe',
                            email: 'john@example.com',
                            role: 'patient',
                        },
                    ],
                });

            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            jwt.sign.mockReturnValue('jwt-token');

            await registerUser(req, res);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('SecurePass123', 'salt');
            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(jwt.sign).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: 'jwt-token',
                    user: expect.objectContaining({
                        email: 'john@example.com',
                    }),
                })
            );
        });

        it('should return 400 if user already exists', async () => {
            req.body = {
                full_name: 'John Doe',
                email: 'existing@example.com',
                password: 'SecurePass123',
            };

            pool.query.mockResolvedValueOnce({
                rows: [{ email: 'existing@example.com' }],
            });

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User already exists',
            });
        });

        it('should handle database errors', async () => {
            req.body = {
                full_name: 'John Doe',
                email: 'john@example.com',
                password: 'SecurePass123',
            };

            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server error',
            });
        });
    });

    describe('loginUser', () => {
        it('should login user with valid credentials', async () => {
            req.body = {
                email: 'john@example.com',
                password: 'SecurePass123',
            };

            pool.query.mockResolvedValueOnce({
                rows: [
                    {
                        user_id: '123',
                        full_name: 'John Doe',
                        email: 'john@example.com',
                        password_hash: 'hashedPassword',
                        role: 'patient',
                    },
                ],
            });

            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('jwt-token');

            await loginUser(req, res);

            expect(pool.query).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalledWith('SecurePass123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: 'jwt-token',
                })
            );
        });

        it('should return 401 for invalid email', async () => {
            req.body = {
                email: 'nonexistent@example.com',
                password: 'password',
            };

            pool.query.mockResolvedValueOnce({ rows: [] });

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid credentials',
            });
        });

        it('should return 401 for invalid password', async () => {
            req.body = {
                email: 'john@example.com',
                password: 'wrongPassword',
            };

            pool.query.mockResolvedValueOnce({
                rows: [
                    {
                        user_id: '123',
                        password_hash: 'hashedPassword',
                    },
                ],
            });

            bcrypt.compare.mockResolvedValue(false);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid credentials',
            });
        });
    });
});
