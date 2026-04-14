import ConfigurableHeader from '../components/ConfigurableHeader';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bna-black flex flex-col">
      <ConfigurableHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
}
