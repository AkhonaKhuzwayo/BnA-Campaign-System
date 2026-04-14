export default function Button({ children, onClick, type = 'button', variant = 'default', disabled, className = '' }) {
  const base = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-bna-teal disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    default: 'bg-bna-btn hover:bg-bna-btn-hover text-white',
    primary: 'bg-bna-teal hover:bg-teal-600 text-white',
    danger: 'bg-red-700 hover:bg-red-600 text-white',
    ghost: 'bg-transparent border border-bna-border text-bna-secondary hover:text-white hover:border-white'
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
