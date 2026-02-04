import { createClient } from 'redis';
import logger from './logger.js';

let redisClient;

const initRedis = async () => {
    if (redisClient) return redisClient;

    const url = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = createClient({
        url,
    });

    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    redisClient.on('connect', () => logger.info('Redis Client Connected'));

    await redisClient.connect();

    return redisClient;
};

export const getCache = async (key) => {
    if (!redisClient) await initRedis();
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error('Redis Get Error', error);
        return null;
    }
};

export const setCache = async (key, value, options = {}) => {
    if (!redisClient) await initRedis();
    try {
        const { ttl = 3600 } = options;
        await redisClient.set(key, JSON.stringify(value), {
            EX: ttl,
        });
    } catch (error) {
        logger.error('Redis Set Error', error);
    }
};

export default { initRedis, getCache, setCache };
