const db = require('../config/db');

async function getReportData({ from, to }) {
  const activations = await db('activations')
    .select('activations.*',
      db.raw("e.first_name || ' ' || e.last_name as employee_name"),
      'c.name as campaign_name')
    .join('employees as e', 'activations.employee_id', 'e.id')
    .leftJoin('campaigns as c', 'activations.campaign_id', 'c.id')
    .where('activations.activation_time', '>=', from)
    .where('activations.activation_time', '<=', to)
    .orderBy('activations.activation_time');

  const clocks = await db('clock_sessions')
    .select('clock_sessions.*',
      db.raw("e.first_name || ' ' || e.last_name as employee_name"),
      'c.name as campaign_name')
    .join('employees as e', 'clock_sessions.employee_id', 'e.id')
    .leftJoin('campaigns as c', 'clock_sessions.campaign_id', 'c.id')
    .where('clock_sessions.clock_in_time', '>=', from)
    .where('clock_sessions.clock_in_time', '<=', to);

  const byEmployee = {};
  for (const a of activations) {
    if (!byEmployee[a.employee_id]) byEmployee[a.employee_id] = { name: a.employee_name, campaign: a.campaign_name, activations: 0, clockedIn: null, clockedOut: null };
    byEmployee[a.employee_id].activations++;
  }
  for (const s of clocks) {
    if (!byEmployee[s.employee_id]) byEmployee[s.employee_id] = { name: s.employee_name, campaign: s.campaign_name, activations: 0, clockedIn: null, clockedOut: null };
    if (!byEmployee[s.employee_id].clockedIn) byEmployee[s.employee_id].clockedIn = s.clock_in_time;
    if (s.clock_out_time) byEmployee[s.employee_id].clockedOut = s.clock_out_time;
  }

  const byDay = {};
  for (const a of activations) {
    const day = a.activation_time ? a.activation_time.toString().slice(0,10) : 'unknown';
    byDay[day] = (byDay[day] || 0) + 1;
  }

  return {
    summary: {
      totalActivations: activations.length,
      totalEmployees: Object.keys(byEmployee).length,
      period: { from, to }
    },
    byEmployee: Object.values(byEmployee),
    byDay: Object.entries(byDay).map(([date, activations]) => ({ date, activations })),
    activations,
    clocks
  };
}

module.exports = { getReportData };
