exports.up = function(knex) {
  return knex.schema.createTable('documents', t => {
    t.increments('id').primary();
    t.integer('employee_id').notNullable().references('id').inTable('employees').onDelete('CASCADE');
    t.enu('document_type', ['id_copy','bank_proof','residence','contract']).notNullable();
    t.string('file_path').notNullable();
    t.string('original_filename').notNullable();
    t.timestamp('uploaded_at').defaultTo(knex.fn.now());
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('documents');
};
