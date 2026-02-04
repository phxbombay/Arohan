import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireRole, requireAdmin, requireDoctor, requireAuth } from '../middleware/rbac.js';

describe('RBAC Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: null,
            path: '/test',
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
    });

    describe('requireRole', () => {
        it('should return 401 if no user in request', () => {
            const middleware = requireRole(['admin']);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Not authorized, please login',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 403 if user role not in allowed roles', () => {
            req.user = {
                user_id: '123',
                role: 'patient',
            };

            const middleware = requireRole(['admin', 'doctor']);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Access denied. Insufficient permissions.',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next() if user role is allowed', () => {
            req.user = {
                user_id: '123',
                role: 'admin',
            };

            const middleware = requireRole(['admin', 'doctor']);
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should allow multiple roles', () => {
            const middleware = requireRole(['patient', 'doctor', 'admin']);

            ['patient', 'doctor', 'admin'].forEach((role) => {
                req.user = { user_id: '123', role };
                next.mockClear();

                middleware(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('requireAdmin', () => {
        it('should allow admin users', () => {
            req.user = { user_id: '123', role: 'admin' };
            requireAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should deny non-admin users', () => {
            req.user = { user_id: '123', role: 'patient' };
            requireAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('requireDoctor', () => {
        it('should allow doctor users', () => {
            req.user = { user_id: '123', role: 'doctor' };
            requireDoctor(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should allow admin users', () => {
            req.user = { user_id: '123', role: 'admin' };
            requireDoctor(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should deny patient users', () => {
            req.user = { user_id: '123', role: 'patient' };
            requireDoctor(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('requireAuth', () => {
        it('should allow any authenticated user', () => {
            const roles = ['patient', 'doctor', 'admin'];

            roles.forEach((role) => {
                req.user = { user_id: '123', role };
                next.mockClear();

                requireAuth(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });

        it('should deny unauthenticated users', () => {
            req.user = null;
            requireAuth(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
        });
    });
});
