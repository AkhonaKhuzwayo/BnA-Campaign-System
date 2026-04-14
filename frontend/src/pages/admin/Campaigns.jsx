import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { getCampaignsAdmin, createCampaign, updateCampaign } from '../../api/admin';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  function fetchCampaigns() { getCampaignsAdmin().then(r => setCampaigns(r.data)).catch(() => {}); }
  useEffect(() => { fetchCampaigns(); }, []);

  async function handleCreate(e) {
    e.preventDefault(); setLoading(true);
    try { await createCampaign({ name }); setShowCreate(false); setName(''); fetchCampaigns(); }
    catch {} finally { setLoading(false); }
  }

  async function toggle(c) { await updateCampaign(c.id, { is_active: !c.is_active }); fetchCampaigns(); }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'is_active', label: 'Status', render: r => <span className={`text-xs px-2 py-0.5 rounded ${r.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{r.is_active ? 'Active' : 'Inactive'}</span> },
    { key: 'actions', label: '', render: r => <Button variant="ghost" onClick={() => toggle(r)} className="text-xs py-1 px-2">{r.is_active ? 'Deactivate' : 'Activate'}</Button> }
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Campaigns</h1>
        <Button variant="primary" onClick={() => setShowCreate(true)}>+ New Campaign</Button>
      </div>
      <Card><DataTable columns={columns} data={campaigns} /></Card>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Campaign">
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Campaign Name" value={name} onChange={e => setName(e.target.value)} required />
          <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Create'}</Button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
