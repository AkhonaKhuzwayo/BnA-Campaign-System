export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-bna-dark border border-bna-border rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
