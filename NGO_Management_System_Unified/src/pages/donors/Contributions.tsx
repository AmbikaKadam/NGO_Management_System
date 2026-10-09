import { useState } from 'react';
import { Plus, Search, Download, Filter } from 'lucide-react';

const contributions = [
  { id: 'TXN-2025-1892', donor: 'Tata Trust', type: 'Corporate', amount: '₹5,00,000', date: '15 Sep 2025', campaign: 'Digital Literacy Fund', mode: 'Bank Transfer', receipt: 'RCP-2025-1892', status: 'Confirmed' },
  { id: 'TXN-2025-1893', donor: 'Ramesh Gupta', type: 'Individual', amount: '₹50,000', date: '18 Sep 2025', campaign: 'Healthcare Outreach', mode: 'UPI', receipt: 'RCP-2025-1893', status: 'Confirmed' },
  { id: 'TXN-2025-1894', donor: 'Infosys Foundation', type: 'Corporate', amount: '₹3,00,000', date: '20 Sep 2025', campaign: 'Clean Water Initiative', mode: 'Cheque', receipt: 'RCP-2025-1894', status: 'Confirmed' },
  { id: 'TXN-2025-1895', donor: 'Sunita Mehra', type: 'Individual', amount: '₹25,000', date: '25 Sep 2025', campaign: 'Women Empowerment', mode: 'Online', receipt: 'Pending', status: 'Pending' },
  { id: 'TXN-2025-1896', donor: 'Anonymous', type: 'Individual', amount: '₹10,000', date: '1 Oct 2025', campaign: 'General Fund', mode: 'Cash', receipt: 'RCP-2025-1896', status: 'Confirmed' },
  { id: 'TXN-2025-1897', donor: 'HCL Foundation', type: 'Corporate', amount: '₹8,00,000', date: '5 Oct 2025', campaign: 'Skill Development', mode: 'Bank Transfer', receipt: 'RCP-2025-1897', status: 'Confirmed' },
  { id: 'TXN-2025-1898', donor: 'Birla Charitable', type: 'Organisation', amount: '₹2,00,000', date: '7 Oct 2025', campaign: 'Rural Development', mode: 'NEFT', receipt: 'Pending', status: 'Under Review' },
];

const typeStats = [
  { label: 'Individual Donations', value: '₹92L', count: 3420, color: '#1AACB8' },
  { label: 'Corporate CSR', value: '₹1.4Cr', count: 48, color: '#6366F1' },
  { label: 'Material Donations', value: '₹18L', count: 124, color: '#10B981' },
  { label: 'Crowdfunding', value: '₹28L', count: 892, color: '#F59E0B' },
];

const statusStyle: Record<string, string> = {
  Confirmed: 'badge badge-green',
  Pending: 'badge badge-yellow',
  'Under Review': 'badge badge-blue',
  Failed: 'badge badge-red',
};

export default function ContributionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = contributions.filter(c =>
    (statusFilter === 'All' || c.status === statusFilter) &&
    c.donor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Contributions & Donations</h1>
          <p className="page-subtitle">Record, track, and report all incoming donations</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary"><Download size={15} /> Export</button>
          <button className="btn-primary" onClick={() => setShowAdd(s => !s)}>
            <Plus size={16} /> Add Contribution
          </button>
        </div>
      </div>

      {/* Type stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {typeStats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-xl font-extrabold" style={{ color: s.color, fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            <div className="text-[11px] text-slate-400 mt-1">{s.count} transactions</div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Record New Contribution</span>
            <button onClick={() => setShowAdd(false)} className="text-slate-400">✕</button>
          </div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Donor Name', 'Date of Donation', 'Amount (₹)', 'Donation Type', 'Campaign / Cause', 'Payment Mode', 'Transaction / Reference ID', 'Notes'].map(f => (
              <div key={f}>
                <label className="form-label">{f}</label>
                <input className="form-input" placeholder={`Enter ${f.toLowerCase()}...`} />
              </div>
            ))}
            <div className="md:col-span-2 flex gap-3 pt-1">
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary">Save Contribution</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="form-input pl-9" placeholder="Search donor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['All', 'Confirmed', 'Pending', 'Under Review'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === s ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-200'
            }`}>{s}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Transaction ID</th><th>Donor</th><th>Type</th><th>Amount</th><th>Date</th>
                <th>Campaign</th><th>Mode</th><th>Receipt</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="text-xs font-mono text-slate-500">{c.id}</td>
                  <td className="font-semibold text-slate-800">{c.donor}</td>
                  <td><span className={c.type === 'Individual' ? 'badge badge-teal' : c.type === 'Corporate' ? 'badge badge-blue' : 'badge badge-green'}>{c.type}</span></td>
                  <td className="font-bold text-slate-800">{c.amount}</td>
                  <td className="text-xs">{c.date}</td>
                  <td className="text-xs text-slate-600 max-w-[130px] truncate">{c.campaign}</td>
                  <td className="text-xs">{c.mode}</td>
                  <td className="text-xs">{c.receipt.startsWith('RCP') ? (
                    <button className="text-teal-600 font-semibold hover:underline">{c.receipt}</button>
                  ) : c.receipt}</td>
                  <td><span className={statusStyle[c.status]}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          {filtered.length} records · Total visible: ₹{filtered.reduce((acc, c) => acc + parseFloat(c.amount.replace(/[₹,]/g, '')), 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
