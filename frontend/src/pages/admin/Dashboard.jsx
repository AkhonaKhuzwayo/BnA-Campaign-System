import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import { getDailyReport } from '../../api/admin';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    getDailyReport(today).then(r => setReport(r.data)).catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-bna-secondary text-sm">Total Activations Today</p>
          <p className="text-3xl font-bold text-bna-teal mt-1">{report?.summary?.totalActivations ?? '—'}</p>
        </Card>
        <Card>
          <p className="text-bna-secondary text-sm">Employees Active Today</p>
          <p className="text-3xl font-bold text-white mt-1">{report?.summary?.totalEmployees ?? '—'}</p>
        </Card>
        <Card>
          <p className="text-bna-secondary text-sm">Report Date</p>
          <p className="text-xl font-semibold text-white mt-1">{today}</p>
        </Card>
      </div>
      {report?.byEmployee?.length > 0 && (
        <Card>
          <h2 className="font-semibold text-white mb-4">Activations by Employee</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={report.byEmployee}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="name" stroke="#B0B0B0" tick={{ fontSize: 11 }} />
              <YAxis stroke="#B0B0B0" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2A2A', color: '#fff' }} />
              <Bar dataKey="activations" fill="#00A8A8" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </AdminLayout>
  );
}
