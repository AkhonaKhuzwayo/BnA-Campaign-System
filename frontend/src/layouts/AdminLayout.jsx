import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfigurableHeader from '../components/ConfigurableHeader';
import {
  HomeIcon, UsersIcon, DocumentTextIcon, ChartBarIcon,
  ClipboardDocumentListIcon, ArrowRightOnRectangleIcon, FolderIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', Icon: HomeIcon },
    { to: '/admin/employees/bna', label: 'BnA Reps', Icon: UsersIcon },
    { to: '/admin/employees/spot', label: 'Spot Employees', Icon: UsersIcon },
    { to: '/admin/logs', label: 'Activity Logs', Icon: ClipboardDocumentListIcon },
    { to: '/admin/reports', label: 'Reports', Icon: DocumentTextIcon },
    { to: '/admin/campaigns', label: 'Campaigns', Icon: FolderIcon },
  ];

  return (
    <div className="min-h-screen bg-bna-black flex flex-col">
      <ConfigurableHeader />
      <div className="flex flex-1">
        <nav className="bg-bna-dark border-r border-bna-border w-56 flex-shrink-0 hidden md:flex flex-col p-4 gap-1">
          {navItems.map(({ to, label, Icon }) => (
            <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${location.pathname.startsWith(to) ? 'bg-bna-btn text-white' : 'text-bna-secondary hover:text-white hover:bg-bna-btn/50'}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded text-sm text-bna-secondary hover:text-white hover:bg-bna-btn/50 mt-auto">
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </nav>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
