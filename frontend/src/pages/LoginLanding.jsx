import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

export default function LoginLanding() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Welcome to BnA Campaign System</h1>
        <div className="grid gap-4">
          <button
            onClick={() => navigate('/login/official')}
            className="bg-bna-dark border-2 border-bna-teal rounded-xl p-8 text-center hover:bg-bna-btn transition-colors cursor-pointer"
          >
            <div className="text-bna-teal text-4xl mb-3">👔</div>
            <h2 className="text-xl font-semibold text-white mb-1">Official Representative Login</h2>
            <p className="text-bna-secondary text-sm">For permanent BnA employees working across campaigns</p>
          </button>
          <button
            onClick={() => navigate('/login/guest')}
            className="bg-bna-dark border-2 border-bna-border rounded-xl p-8 text-center hover:bg-bna-btn transition-colors cursor-pointer"
          >
            <div className="text-white text-4xl mb-3">🎯</div>
            <h2 className="text-xl font-semibold text-white mb-1">Guest / Temporary Employee Login</h2>
            <p className="text-bna-secondary text-sm">For contract workers assigned to a specific campaign</p>
          </button>
          <button
            onClick={() => navigate('/login/admin')}
            className="text-bna-secondary text-sm underline text-center hover:text-white transition-colors"
          >
            Admin Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
