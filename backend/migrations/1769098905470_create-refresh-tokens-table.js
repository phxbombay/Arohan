/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('refresh_tokens', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        token_hash: { type: 'varchar(255)', notNull: true },
        expires_at: { type: 'timestamptz', notNull: true },
        created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
        revoked_at: { type: 'timestamptz', default: null },
    });
    pgm.createIndex('refresh_tokens', 'user_id');
    pgm.createIndex('refresh_tokens', 'token_hash');
};

export const down = (pgm) => {
    pgm.dropTable('refresh_tokens');
};
