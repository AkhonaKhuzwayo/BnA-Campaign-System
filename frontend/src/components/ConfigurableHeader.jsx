export default function ConfigurableHeader({ campaignName }) {
  return (
    <header className="bg-bna-dark border-b border-bna-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-bna-btn flex items-center justify-center text-bna-teal font-bold text-lg">B</div>
        <div>
          <span className="text-white font-semibold text-lg">BnA Campaign System</span>
          {campaignName && <span className="ml-2 text-xs text-bna-secondary bg-bna-btn px-2 py-0.5 rounded">{campaignName}</span>}
        </div>
      </div>
    </header>
  );
}
