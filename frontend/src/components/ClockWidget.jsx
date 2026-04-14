import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { clockIn, clockOut, getClockStatus } from '../api/employee';
import Button from './Button';
import Card from './Card';

export default function ClockWidget() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchStatus() {
    try {
      const { data } = await getClockStatus();
      setStatus(data);
    } catch {}
  }

  useEffect(() => { fetchStatus(); }, []);

  async function handleClock() {
    setLoading(true);
    setError('');
    try {
      if (status?.status === 'in') {
        await clockOut();
      } else {
        await clockIn();
      }
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.error || 'Clock action failed');
    } finally {
      setLoading(false);
    }
  }

  const isClockedIn = status?.status === 'in';
  const lastTime = isClockedIn ? status?.session?.clock_in_time : status?.lastSession?.clock_out_time;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ClockIcon className="w-5 h-5 text-bna-teal" />
        <h3 className="font-semibold text-white">Time Tracking</h3>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isClockedIn ? 'bg-green-400' : 'bg-red-400'}`}></span>
        <span className="text-sm text-bna-secondary">{isClockedIn ? 'Clocked In' : 'Clocked Out'}</span>
      </div>
      {lastTime && (
        <p className="text-xs text-bna-secondary">
          Last action: {new Date(lastTime).toLocaleString()}
        </p>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <Button onClick={handleClock} disabled={loading} variant={isClockedIn ? 'danger' : 'primary'}>
        {loading ? 'Processing...' : isClockedIn ? 'Clock Out' : 'Clock In'}
      </Button>
    </Card>
  );
}
