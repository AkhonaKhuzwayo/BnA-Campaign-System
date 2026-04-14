import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import { getLogs, getActivations, getCampaignsAdmin } from '../../api/admin';

export default function Logs() {
  const [tab, setTab] = useState('clock');
  const [logs, setLogs] = useState([]);
  const [activations, setActivations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [filters, setFilters] = useState({ campaign_id: '', from: '', to: '' });

  useEffect(() => { getCampaignsAdmin().then(r => setCampaigns(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    const params = {};
    if (filters.campaign_id) params.campaign_id = filters.campaign_id;
    if (filters.from) params.from = filters.from + 'T00:00:00Z';
    if (filters.to) params.to = filters.to + 'T23:59:59Z';
    getLogs(params).then(r => setLogs(r.data)).catch(() => {});
    getActivations(params).then(r => setActivations(r.data)).catch(() => {});
  }, [filters]);

  const clockCols = [
    { key: 'employee_name', label: 'Employee' },
    { key: 'campaign_name', label: 'Campaign' },
    { key: 'clock_in_time', label: 'Clock In', render: r => r.clock_in_time ? new Date(r.clock_in_time).toLocaleString() : '-' },
    { key: 'clock_out_time', label: 'Clock Out', render: r => r.clock_out_time ? new Date(r.clock_out_time).toLocaleString() : '-' },
  ];

  const actCols = [
    { key: 'employee_name', label: 'Employee' },
    { key: 'campaign_name', label: 'Campaign' },
    { key: 'location', label: 'Location' },
    { key: 'customer_first_name', label: 'First Name' },
    { key: 'customer_surname', label: 'Surname' },
    { key: 'customer_id_number', label: 'ID Number' },
    { key: 'activation_time', label: 'Time', render: r => r.activation_time ? new Date(r.activation_time).toLocaleString() : '-' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Activity Logs</h1>
      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={filters.campaign_id} onChange={e => setFilters(p => ({...p, campaign_id: e.target.value}))}
          className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-bna-teal">
          <option value="">All Campaigns</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" value={filters.from} onChange={e => setFilters(p => ({...p, from: e.target.value}))}
          className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-bna-teal" />
        <input type="date" value={filters.to} onChange={e => setFilters(p => ({...p, to: e.target.value}))}
          className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-bna-teal" />
      </div>
      <div className="flex gap-2 mb-4">
        {['clock', 'activations'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded text-sm capitalize ${tab === t ? 'bg-bna-teal text-white' : 'bg-bna-btn text-bna-secondary hover:text-white'}`}>{t === 'clock' ? 'Clock Sessions' : 'Activations'}</button>
        ))}
      </div>
      <Card>
        {tab === 'clock' && <DataTable columns={clockCols} data={logs} emptyMessage="No clock sessions found." />}
        {tab === 'activations' && <DataTable columns={actCols} data={activations} emptyMessage="No activations found." />}
      </Card>
    </AdminLayout>
  );
}
