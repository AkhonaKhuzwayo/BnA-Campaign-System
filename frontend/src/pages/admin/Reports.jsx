import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import { getDailyReport, getWeeklyReport, getMonthlyReport, downloadPDF, downloadExcel } from '../../api/admin';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Reports() {
  const [type, setType] = useState('daily');
  const [param, setParam] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true); setError('');
    try {
      let res;
      if (type === 'daily') res = await getDailyReport(param);
      else if (type === 'weekly') res = await getWeeklyReport(param);
      else res = await getMonthlyReport(param.slice(0, 7));
      setReport(res.data);
    } catch { setError('Failed to generate report'); }
    finally { setLoading(false); }
  }

  const empCols = [
    { key: 'name', label: 'Employee' },
    { key: 'campaign', label: 'Campaign' },
    { key: 'activations', label: 'Activations' },
    { key: 'clockedIn', label: 'Clocked In', render: r => r.clockedIn ? new Date(r.clockedIn).toLocaleTimeString() : '-' },
    { key: 'clockedOut', label: 'Clocked Out', render: r => r.clockedOut ? new Date(r.clockedOut).toLocaleTimeString() : '-' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Reports</h1>
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-bna-secondary">Report Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white focus:outline-none focus:border-bna-teal">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-bna-secondary">{type === 'monthly' ? 'Month' : type === 'weekly' ? 'Start Date' : 'Date'}</label>
            <input type={type === 'monthly' ? 'month' : 'date'} value={type === 'monthly' ? param.slice(0,7) : param}
              onChange={e => setParam(e.target.value)}
              className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white focus:outline-none focus:border-bna-teal" />
          </div>
          <Button onClick={generate} variant="primary" disabled={loading}>{loading ? 'Generating...' : 'Generate Report'}</Button>
          {report && (
            <>
              <a href={downloadPDF(type === 'daily' ? param : new Date().toISOString().slice(0,10))} target="_blank" rel="noreferrer">
                <Button variant="ghost">⬇ PDF</Button>
              </a>
              <a href={downloadExcel(type === 'daily' ? param : new Date().toISOString().slice(0,10))} target="_blank" rel="noreferrer">
                <Button variant="ghost">⬇ Excel</Button>
              </a>
            </>
          )}
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </Card>
      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <p className="text-bna-secondary text-sm">Total Activations</p>
              <p className="text-3xl font-bold text-bna-teal">{report.summary.totalActivations}</p>
            </Card>
            <Card>
              <p className="text-bna-secondary text-sm">Active Employees</p>
              <p className="text-3xl font-bold text-white">{report.summary.totalEmployees}</p>
            </Card>
          </div>
          {report.byDay?.length > 0 && (
            <Card>
              <h2 className="font-semibold text-white mb-4">Activations Over Period</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={report.byDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="date" stroke="#B0B0B0" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#B0B0B0" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2A2A', color: '#fff' }} />
                  <Bar dataKey="activations" fill="#00A8A8" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
          <Card>
            <h2 className="font-semibold text-white mb-4">By Employee</h2>
            <DataTable columns={empCols} data={report.byEmployee} emptyMessage="No employee data." />
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
