import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginLanding from './pages/LoginLanding';
import LoginOfficial from './pages/LoginOfficial';
import LoginGuest from './pages/LoginGuest';
import LoginAdmin from './pages/LoginAdmin';
import SelectCampaign from './pages/SelectCampaign';
import EmployeeHome from './pages/employee/Home';
import EmployeeProfile from './pages/employee/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeBna from './pages/admin/EmployeeBna';
import EmployeeSpot from './pages/admin/EmployeeSpot';
import Logs from './pages/admin/Logs';
import Reports from './pages/admin/Reports';
import Campaigns from './pages/admin/Campaigns';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginLanding />} />
          <Route path="/login/official" element={<LoginOfficial />} />
          <Route path="/login/guest" element={<LoginGuest />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/select-campaign" element={<ProtectedRoute><SelectCampaign /></ProtectedRoute>} />
          <Route path="/employee/home" element={<ProtectedRoute><EmployeeHome /></ProtectedRoute>} />
          <Route path="/employee/profile" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/employees/bna" element={<ProtectedRoute adminOnly><EmployeeBna /></ProtectedRoute>} />
          <Route path="/admin/employees/spot" element={<ProtectedRoute adminOnly><EmployeeSpot /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute adminOnly><Logs /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />
          <Route path="/admin/campaigns" element={<ProtectedRoute adminOnly><Campaigns /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
