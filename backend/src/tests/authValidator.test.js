import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

describe('Auth Validator', () => {
    describe('registerSchema', () => {
        it('should accept valid registration data', () => {
            const validData = {
                full_name: 'John Doe',
                email: 'john@example.com',
                password: 'SecurePass123',
                role: 'patient',
            };

            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should trim and lowercase email', () => {
            const data = {
                full_name: 'John Doe',
                email: ' JOHN@EXAMPLE.COM ',
                password: 'SecurePass123',
            };

            const result = registerSchema.parse(data);
            expect(result.email).toBe('john@example.com');
        });

        it('should reject invalid email format', () => {
            const invalidData = {
                full_name: 'John Doe',
                email: 'not-an-email',
                password: 'SecurePass123',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error?.issues[0].path).toEqual(['email']);
        });

        it('should reject password without uppercase', () => {
            const data = {
                full_name: 'John Doe',
                email: 'john@example.com',
                password: 'weakpass123',
            };

            const result = registerSchema.safeParse(data);
            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toContain('uppercase');
        });

        it('should reject password without lowercase', () => {
            const data = {
                full_name: 'John Doe',
                email: 'john@example.com',
                password: 'WEAKPASS123',
            };

            const result = registerSchema.safeParse(data);
            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toContain('lowercase');
        });

        it('should reject password without number', () => {
            const data = {
                full_name: 'John Doe',
                email: 'john@example.com',
                password: 'WeakPassword',
            };

            const result = registerSchema.safeParse(data);
            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toContain('number');
        });

        it('should reject password shorter than 8 characters', () => {
            const data = {
                full_name: 'John Doe',
                email: 'john@example.com',
                password: 'Pass1',
            };

            const result = registerSchema.safeParse(data);
            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toContain('8 characters');
        });

        it('should reject name with special characters', () => {
            const data = {
                full_name: 'John@123',
                email: 'john@example.com',
                password: 'SecurePass123',
            };

            const result = registerSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should default role to patient', () => {
            const data = {
                full_name: 'John Doe',
                email: 'john@example.com',
                password: 'SecurePass123',
            };

            const result = registerSchema.parse(data);
            expect(result.role).toBe('patient');
        });

        it('should accept valid roles', () => {
            const roles = ['patient', 'doctor', 'admin'];

            roles.forEach((role) => {
                const data = {
                    full_name: 'John Doe',
                    email: 'john@example.com',
                    password: 'SecurePass123',
                    role,
                };

                const result = registerSchema.safeParse(data);
                expect(result.success).toBe(true);
            });
        });
    });

    describe('loginSchema', () => {
        it('should accept valid login data', () => {
            const validData = {
                email: 'john@example.com',
                password: 'SecurePass123',
            };

            const result = loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should trim and lowercase email', () => {
            const data = {
                email: ' JOHN@EXAMPLE.COM ',
                password: 'SomePassword',
            };

            const result = loginSchema.parse(data);
            expect(result.email).toBe('john@example.com');
        });

        it('should reject invalid email', () => {
            const data = {
                email: 'not-an-email',
                password: 'password',
            };

            const result = loginSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should reject empty password', () => {
            const data = {
                email: 'john@example.com',
                password: '',
            };

            const result = loginSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
});
