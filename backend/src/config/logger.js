import winston from 'winston';
import net from 'net';

class LogstashTransport extends winston.Transport {
    constructor(opts) {
        super(opts);
        this.host = opts.host || 'logstash';
        this.port = opts.port || 5000;
        this.client = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 1000; // Start with 1 second
        this.maxReconnectDelay = 30000; // Max 30 seconds
        this.connect();
    }

    connect() {
        if (this.client && !this.client.destroyed) {
            this.client.destroy();
        }

        this.client = new net.Socket();
        this.client.setTimeout(5000); // 5 second connection timeout

        this.client.connect(this.port, this.host, () => {
            this.connected = true;
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000; // Reset delay on successful connection
            console.log(`✅ Connected to Logstash at ${this.host}:${this.port}`);
        });

        this.client.on('error', (err) => {
            this.connected = false;
            // Only log error on first attempt or every 5th attempt to reduce spam
            if (this.reconnectAttempts === 0 || this.reconnectAttempts % 5 === 0) {
                console.warn(`⚠️  Logstash connection error (attempt ${this.reconnectAttempts + 1}): ${err.message}`);
            }
            this.client.destroy();
        });

        this.client.on('timeout', () => {
            this.connected = false;
            console.warn('⚠️  Logstash connection timeout');
            this.client.destroy();
        });

        this.client.on('close', () => {
            this.connected = false;

            // Exponential backoff with max limit
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = Math.min(
                    this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts),
                    this.maxReconnectDelay
                );

                setTimeout(() => this.connect(), delay);
            } else {
                console.error('❌ Max Logstash reconnection attempts reached. Logs will only be written to console and files.');
            }
        });
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        if (this.connected && this.client && !this.client.destroyed && this.client.writable) {
            try {
                this.client.write(JSON.stringify(info) + '\n');
            } catch (e) {
                // Silently fail - logs still go to console/files
            }
        }

        callback();
    }
}

const { combine, timestamp, json, printf, colorize, errors } = winston.format;

// Custom format for console logging
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;

    // Add stack trace if error
    if (stack) {
        msg += `\n${stack}`;
    }

    // Add metadata if exists
    if (Object.keys(metadata).length > 0) {
        msg += `\n${JSON.stringify(metadata, null, 2)}`;
    }

    return msg;
});

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json()
    ),
    defaultMeta: { service: 'arohan-backend' },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleFormat
            )
        }),
        // Write errors to error.log
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(
                timestamp(),
                json()
            )
        }),
        // Write all logs to combined.log
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: combine(
                timestamp(),
                json()
            )
        }),
        // Send logs to Logstash
        // new LogstashTransport({
        //     host: 'logstash',
        //     port: 5000
        // })
    ]
});

// If not in production, also log to console with colors
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            consoleFormat
        )
    }));
}

export default logger;
