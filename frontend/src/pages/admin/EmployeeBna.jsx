import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { getEmployees, createEmployee, updateEmployee } from '../../api/admin';

export default function EmployeeBna() {
  const [employees, setEmployees] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function fetchEmployees() {
    getEmployees({ type: 'bna' }).then(r => setEmployees(r.data)).catch(() => {});
  }

  useEffect(() => { fetchEmployees(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await createEmployee({ ...form, is_bna_official: true });
      setCredentials(data);
      setShowCreate(false);
      setForm({ first_name: '', last_name: '', phone: '', email: '' });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.error || 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(emp) {
    await updateEmployee(emp.id, { is_active: !emp.is_active });
    fetchEmployees();
  }

  const columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'is_active', label: 'Status', render: r => <span className={`text-xs px-2 py-0.5 rounded ${r.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{r.is_active ? 'Active' : 'Disabled'}</span> },
    { key: 'actions', label: '', render: r => <Button variant="ghost" onClick={() => toggleActive(r)} className="text-xs py-1 px-2">{r.is_active ? 'Disable' : 'Enable'}</Button> }
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">BnA Representatives</h1>
        <Button variant="primary" onClick={() => setShowCreate(true)}>+ Add Employee</Button>
      </div>
      <Card><DataTable columns={columns} data={employees} /></Card>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create BnA Representative">
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={form.first_name} onChange={e => setForm(p => ({...p, first_name: e.target.value}))} required />
            <Input label="Last Name" value={form.last_name} onChange={e => setForm(p => ({...p, last_name: e.target.value}))} required />
          </div>
          <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Create'}</Button>
        </form>
      </Modal>
      <Modal open={!!credentials} onClose={() => setCredentials(null)} title="Employee Created – Credentials">
        <div className="space-y-3">
          <p className="text-bna-secondary text-sm">Save these credentials — password will not be shown again.</p>
          <div className="bg-bna-black rounded p-3 space-y-2">
            <div className="flex justify-between"><span className="text-bna-secondary text-sm">Username:</span><span className="text-white font-mono">{credentials?.username}</span></div>
            <div className="flex justify-between"><span className="text-bna-secondary text-sm">Password:</span><span className="text-white font-mono">{credentials?.password}</span></div>
          </div>
          <Button variant="primary" className="w-full" onClick={() => { navigator.clipboard.writeText(`Username: ${credentials?.username}\nPassword: ${credentials?.password}`); setCopied(true); }}>
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
