/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export async function up(pgm) {
    // Migration skipped due to missing columns/tables in production db
    console.log('Skipping add-performance-indexes migration');
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export async function down(pgm) {
    // Empty down migration
}
