exports.up = function(knex) {
  return knex.schema.createTable('activations', t => {
    t.increments('id').primary();
    t.integer('employee_id').notNullable().references('id').inTable('employees').onDelete('CASCADE');
    t.integer('campaign_id').references('id').inTable('campaigns').onDelete('SET NULL').nullable();
    t.enu('location', ['DUT','UKZN','MUT']).notNullable();
    t.string('customer_first_name').notNullable();
    t.string('customer_surname').notNullable();
    t.string('customer_id_number');
    t.timestamp('activation_time').defaultTo(knex.fn.now());
    t.string('batch_id').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('activations');
};
