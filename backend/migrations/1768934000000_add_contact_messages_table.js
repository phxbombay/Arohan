exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('contact_messages', {
        id: 'id',
        name: { type: 'text', notNull: true },
        email: { type: 'text', notNull: true },
        phone: { type: 'text' },
        message: { type: 'text', notNull: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('contact_messages');
};
