import { useState } from 'react';
import { Plus, FileText, CheckCircle2, XCircle, Clock, ChevronDown } from 'lucide-react';
import usePersistentState from '../../hooks/usePersistentState';

interface Proposal {
  id: string; title: string; category: string; submittedBy: string; date: string; status: string;
  budget: string; impact: string; priority: string; overview?: string; geography?: string; startDate?: string; endDate?: string;
}

const initialProposals: Proposal[] = [
  { id: 'PP-2025-011', title: 'Mobile Health Clinics – Rural Rajasthan', category: 'Health', submittedBy: 'Dr. Anita Patel', date: '2 Oct 2025', status: 'Under Review', budget: '₹12,00,000', impact: '5,000 patients/year', priority: 'High' },
  { id: 'PP-2025-010', title: 'Girls Education Scholarship Fund', category: 'Education', submittedBy: 'Sunita Roy', date: '28 Sep 2025', status: 'Approved', budget: '₹6,50,000', impact: '200 girls/year', priority: 'High' },
  { id: 'PP-2025-009', title: 'Urban Waste Composting', category: 'Environment', submittedBy: 'Rahul Mehta', date: '20 Sep 2025', status: 'Draft', budget: '₹2,20,000', impact: '10 tonnes/month', priority: 'Medium' },
  { id: 'PP-2025-008', title: 'Farmer Digital Training', category: 'Agriculture', submittedBy: 'Vikram Singh', date: '15 Sep 2025', status: 'Rejected', budget: '₹3,80,000', impact: '400 farmers', priority: 'Medium' },
  { id: 'PP-2025-007', title: 'Elderly Day Care – Pune', category: 'Social', submittedBy: 'Amit Kumar', date: '10 Sep 2025', status: 'Approved', budget: '₹4,50,000', impact: '120 seniors', priority: 'High' },
  { id: 'PP-2025-006', title: 'Child Mental Health Program', category: 'Health', submittedBy: 'Priya Sharma', date: '5 Sep 2025', status: 'Under Review', budget: '₹1,90,000', impact: '300 children', priority: 'High' },
];

const statusStyle: Record<string, string> = {
  'Under Review': 'badge badge-yellow',
  'Approved': 'badge badge-green',
  'Draft': 'badge badge-gray',
  'Rejected': 'badge badge-red',
};

const statusIcons: Record<string, React.ReactNode> = {
  'Approved': <CheckCircle2 size={14} className="text-green-500" />,
  'Rejected': <XCircle size={14} className="text-red-500" />,
  'Under Review': <Clock size={14} className="text-yellow-500" />,
  'Draft': <FileText size={14} className="text-slate-400" />,
};

const priorityStyle: Record<string, string> = {
  High: 'badge badge-red',
  Medium: 'badge badge-yellow',
  Low: 'badge badge-gray',
};

const lifecycle = ['Draft', 'Submitted', 'Under Review', 'Financial Review', 'Approved/Rejected', 'Planning Starts'];

export default function ProposalsPage() {
  const [activeStatus, setActiveStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [proposals, setProposals] = usePersistentState<Proposal[]>('projects.proposals', initialProposals);
  const [form, setForm] = useState({ title: '', category: '', budget: '', impact: '', startDate: '', endDate: '', overview: '', geography: '' });

  const filtered = activeStatus === 'All' ? proposals : proposals.filter(p => p.status === activeStatus);
  const updateStatus = (id: string, status: string) => setProposals(current => current.map(proposal => proposal.id === id ? { ...proposal, status } : proposal));
  const submitProposal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const proposal: Proposal = {
      id: `PP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      title: form.title.trim(), category: form.category.trim(), submittedBy: 'Admin User', date,
      status: 'Under Review', budget: `₹${Number(form.budget).toLocaleString('en-IN')}`,
      impact: form.impact.trim(), priority: 'Medium', overview: form.overview.trim(), geography: form.geography.trim(),
      startDate: form.startDate, endDate: form.endDate,
    };
    setProposals(current => [proposal, ...current]);
    setForm({ title: '', category: '', budget: '', impact: '', startDate: '', endDate: '', overview: '', geography: '' });
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Project Proposals</h1>
          <p className="page-subtitle">Submit, review, and approve project proposals</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(s => !s)}>
          <Plus size={16} /> New Proposal
        </button>
      </div>

      {/* Lifecycle banner */}
      <div className="card">
        <div className="card-body">
          <p className="text-xs text-slate-500 font-semibold mb-3">Proposal Lifecycle</p>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {lifecycle.map((step, i) => (
              <div key={step} className="flex items-center gap-1 flex-shrink-0">
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                  ${i === 2 ? 'text-white' : 'bg-slate-100 text-slate-500'}`}
                  style={i === 2 ? { background: '#1AACB8' } : {}}>
                  {step}
                </div>
                {i < lifecycle.length - 1 && <span className="text-slate-300 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Proposal Form */}
      {showForm && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Create New Proposal</span>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>
          <form className="card-body grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submitProposal}>
            {[
              { key: 'title', label: 'Project Title', placeholder: 'e.g. Mobile Health Clinic', required: true },
              { key: 'category', label: 'Category', placeholder: 'Health / Education / Social...', required: true },
              { key: 'budget', label: 'Estimated Budget', placeholder: '₹0', required: true, type: 'number' },
              { key: 'impact', label: 'Expected Beneficiaries', placeholder: 'Number of people', required: true },
              { key: 'startDate', label: 'Start Date', placeholder: '', required: true, type: 'date' },
              { key: 'endDate', label: 'End Date', placeholder: '', required: true, type: 'date' },
            ].map(f => (
              <div key={f.label}>
                <label className="form-label" htmlFor={`proposal-${f.key}`}>{f.label}</label>
                <input id={`proposal-${f.key}`} required={f.required} min={f.type === 'number' ? '1' : f.key === 'endDate' ? form.startDate : undefined} type={f.type ?? 'text'} className="form-input" placeholder={f.placeholder} value={form[f.key as keyof typeof form]} onChange={event => setForm(current => ({ ...current, [f.key]: event.target.value }))} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="form-label" htmlFor="proposal-overview">Project Overview</label>
              <textarea id="proposal-overview" className="form-input h-24 resize-none" placeholder="Describe the project objective and expected outcomes..." value={form.overview} onChange={event => setForm(current => ({ ...current, overview: event.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="form-label" htmlFor="proposal-geography">Geographic Focus Area</label>
              <input id="proposal-geography" className="form-input" placeholder="States / cities / rural areas" value={form.geography} onChange={event => setForm(current => ({ ...current, geography: event.target.value }))} />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Submit Proposal</button>
            </div>
          </form>
        </div>
      )}

      {/* Status tabs */}
      <div className="tab-bar w-fit">
        {['All', 'Draft', 'Submitted', 'Under Review', 'Financial Review', 'Approved', 'Rejected'].map(s => (
          <button key={s} className={`tab-item ${activeStatus === s ? 'active' : ''}`}
            onClick={() => setActiveStatus(s)}>{s}</button>
        ))}
      </div>

      {/* Proposals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="card hover:shadow-md transition-shadow">
            <div className="card-body flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {statusIcons[p.status]}
                  <span className={statusStyle[p.status]}>{p.status}</span>
                </div>
                <span className={priorityStyle[p.priority]}>{p.priority}</span>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm leading-snug" style={{ fontFamily: 'Nunito, sans-serif' }}>{p.title}</div>
                <div className="text-xs text-slate-400 mt-1">{p.id} · {p.category}</div>
                {p.startDate && p.endDate && <div className="text-xs text-slate-500 mt-1">{new Date(`${p.startDate}T00:00:00`).toLocaleDateString('en-GB')} – {new Date(`${p.endDate}T00:00:00`).toLocaleDateString('en-GB')}</div>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-slate-400">Budget</div>
                  <div className="font-bold text-slate-700">{p.budget}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-slate-400">Impact</div>
                  <div className="font-bold text-slate-700">{p.impact}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>By: {p.submittedBy}</span>
                <span>{p.date}</span>
              </div>
              <div className="flex gap-2 pt-1">
                {!['Approved', 'Rejected'].includes(p.status) && <button className="btn-secondary flex-1 text-xs py-1.5" onClick={() => updateStatus(p.id, 'Under Review')}>Review</button>}
                {['Under Review', 'Financial Review'].includes(p.status) && (
                  <>
                    <button className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" onClick={() => updateStatus(p.id, 'Approved')}>Approve</button>
                    <button className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100" onClick={() => updateStatus(p.id, 'Rejected')}>Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
