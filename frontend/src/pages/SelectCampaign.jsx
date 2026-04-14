import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { selectCampaign } from '../api/auth';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';

export default function SelectCampaign() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('pendingCampaigns');
    if (stored) setCampaigns(JSON.parse(stored));
    else navigate('/login');
  }, []);

  async function handleSelect(campaign_id) {
    setLoading(true);
    setError('');
    try {
      const { data } = await selectCampaign({ campaign_id });
      login(data.accessToken, data.refreshToken);
      localStorage.removeItem('pendingCampaigns');
      navigate('/employee/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to select campaign');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white text-center mb-2">Select Campaign</h1>
        <p className="text-bna-secondary text-center mb-8">Choose which campaign you are working on today</p>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {campaigns.map(c => (
            <button key={c.id} onClick={() => handleSelect(c.id)} disabled={loading}
              className="bg-bna-dark border-2 border-bna-border hover:border-bna-teal rounded-xl p-6 text-left transition-colors">
              <h3 className="text-lg font-semibold text-white">{c.name}</h3>
              <p className="text-bna-secondary text-sm mt-1">Active Campaign</p>
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
