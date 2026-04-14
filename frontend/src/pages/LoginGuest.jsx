import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { loginGuest } from '../api/auth';
import axios from 'axios';

export default function LoginGuest() {
  const [form, setForm] = useState({ username: '', password: '', campaign_id: '' });
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/admin/campaigns').catch(() => {}).then(res => {
      if (res?.data) setCampaigns(res.data.filter(c => c.is_active));
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginGuest(form);
      login(data.accessToken, data.refreshToken);
      navigate('/employee/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">Guest / Temporary Employee Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-bna-secondary">Campaign</label>
            <select value={form.campaign_id} onChange={e => setForm(p => ({...p, campaign_id: e.target.value}))} required className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white focus:outline-none focus:border-bna-teal">
              <option value="">Select campaign...</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Employee ID / Username" placeholder="username" value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))} required />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? 'Logging in...' : 'Login'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/login')} className="w-full">← Back</Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
