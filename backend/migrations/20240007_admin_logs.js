exports.up = function(knex) {
  return knex.schema.createTable('admin_logs', t => {
    t.increments('id').primary();
    t.integer('admin_id').references('id').inTable('employees').onDelete('SET NULL').nullable();
    t.string('action').notNullable();
    t.string('target_id').nullable();
    t.timestamp('timestamp').defaultTo(knex.fn.now());
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('admin_logs');
};
