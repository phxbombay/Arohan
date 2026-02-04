/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export async function up(pgm) {
    pgm.createTable('audit_logs', {
        id: {
            type: 'serial',
            primaryKey: true,
        },
        user_id: {
            type: 'uuid',
            notNull: false,
            references: 'users(user_id)',
            onDelete: 'SET NULL',
        },
        action: {
            type: 'varchar(100)',
            notNull: true,
        },
        resource: {
            type: 'varchar(100)',
            notNull: true,
        },
        ip_address: {
            type: 'varchar(45)',
            notNull: false,
        },
        user_agent: {
            type: 'text',
            notNull: false,
        },
        metadata: {
            type: 'jsonb',
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('NOW()'),
        },
    });

    // Create indexes for common queries
    pgm.createIndex('audit_logs', 'user_id');
    pgm.createIndex('audit_logs', 'action');
    pgm.createIndex('audit_logs', 'created_at');
    pgm.createIndex('audit_logs', ['user_id', 'created_at']);
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export async function down(pgm) {
    pgm.dropTable('audit_logs');
}
