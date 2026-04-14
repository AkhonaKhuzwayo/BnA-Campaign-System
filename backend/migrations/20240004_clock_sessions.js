exports.up = function(knex) {
  return knex.schema.createTable('clock_sessions', t => {
    t.increments('id').primary();
    t.integer('employee_id').notNullable().references('id').inTable('employees').onDelete('CASCADE');
    t.integer('campaign_id').references('id').inTable('campaigns').onDelete('SET NULL').nullable();
    t.timestamp('clock_in_time').notNullable();
    t.timestamp('clock_out_time').nullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('clock_sessions');
};
