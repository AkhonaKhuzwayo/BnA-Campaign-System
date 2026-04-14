exports.up = function(knex) {
  return knex.schema.createTable('campaigns', t => {
    t.increments('id').primary();
    t.string('name').notNullable().unique();
    t.boolean('is_active').defaultTo(true);
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('campaigns');
};
