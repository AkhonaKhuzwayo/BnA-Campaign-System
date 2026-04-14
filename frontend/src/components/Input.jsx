export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm text-bna-secondary">{label}</label>}
      <input
        {...props}
        className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white placeholder-bna-secondary focus:outline-none focus:border-bna-teal"
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}
