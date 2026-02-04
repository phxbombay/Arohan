/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export async function up(pgm) {
    pgm.addColumns('users', {
        two_factor_secret: {
            type: 'varchar(255)',
            notNull: false,
        },
        two_factor_enabled: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export async function down(pgm) {
    pgm.dropColumns('users', ['two_factor_secret', 'two_factor_enabled']);
}
