import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../api/auth';

export default function LoginAdmin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginAdmin(form);
      login(data.accessToken, data.refreshToken);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" placeholder="admin" value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))} required />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? 'Logging in...' : 'Login'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/login')} className="w-full">← Back</Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
