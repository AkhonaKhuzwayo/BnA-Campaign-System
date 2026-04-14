exports.up = function(knex) {
  return knex.schema.createTable('activation_photos', t => {
    t.increments('id').primary();
    t.string('batch_id').notNullable();
    t.string('file_path').notNullable();
    t.timestamp('uploaded_at').defaultTo(knex.fn.now());
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('activation_photos');
};
