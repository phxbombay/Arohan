import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

export const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
};

export default { generateAccessToken, generateRefreshToken };
