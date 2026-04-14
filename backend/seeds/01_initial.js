const bcrypt = require('bcryptjs');
exports.seed = async function(knex) {
  await knex('admin_logs').del();
  await knex('activation_photos').del();
  await knex('activations').del();
  await knex('clock_sessions').del();
  await knex('documents').del();
  await knex('employees').del();
  await knex('campaigns').del();
  await knex('campaigns').insert([
    { id: 1, name: 'Spot Money', is_active: true },
    { id: 2, name: 'Gumtree', is_active: true }
  ]);
  const hash = await bcrypt.hash('admin1234', 10);
  await knex('employees').insert([{
    first_name: 'Admin',
    last_name: 'User',
    phone: '',
    email: 'admin@bna.co.za',
    is_bna_official: false,
    campaign_id: null,
    username: 'admin',
    password_hash: hash,
    is_admin: true,
    is_active: true
  }]);
};
