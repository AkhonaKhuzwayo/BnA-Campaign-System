exports.up = function(knex) {
  return knex.schema.createTable('employees', t => {
    t.increments('id').primary();
    t.string('first_name').notNullable();
    t.string('last_name').notNullable();
    t.string('phone');
    t.string('email');
    t.text('home_address');
    t.boolean('is_bna_official').defaultTo(false);
    t.integer('campaign_id').references('id').inTable('campaigns').onDelete('SET NULL').nullable();
    t.string('username').unique().notNullable();
    t.string('password_hash').notNullable();
    t.boolean('is_admin').defaultTo(false);
    t.boolean('is_active').defaultTo(true);
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('employees');
};
