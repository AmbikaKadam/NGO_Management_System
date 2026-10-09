import { useState } from 'react';
import { Plus, Target, TrendingUp, Calendar, Star } from 'lucide-react';

const campaigns = [
  { id: 'CMP-001', name: 'Diwali Giving Drive', type: 'Fundraiser', cause: 'General Fund', target: 50_00_000, raised: 38_50_000, donors: 284, startDate: '10 Oct 2025', endDate: '12 Nov 2025', status: 'Active' },
  { id: 'CMP-002', name: 'School Kit Drive', type: 'Material', cause: 'Education', target: 10_00_000, raised: 10_00_000, donors: 128, startDate: '1 Jul 2025', endDate: '15 Aug 2025', status: 'Completed' },
  { id: 'CMP-003', name: 'Water for All – Q4', type: 'Project', cause: 'Clean Water', target: 15_00_000, raised: 6_75_000, donors: 92, startDate: '1 Oct 2025', endDate: '31 Dec 2025', status: 'Active' },
  { id: 'CMP-004', name: 'Corporate CSR Match', type: 'Matching', cause: 'Multiple', target: 25_00_000, raised: 18_20_000, donors: 42, startDate: '1 Sep 2025', endDate: '30 Nov 2025', status: 'Active' },
  { id: 'CMP-005', name: 'Health Emergency Relief', type: 'Emergency', cause: 'Healthcare', target: 8_00_000, raised: 8_00_000, donors: 540, startDate: '5 Aug 2025', endDate: '20 Aug 2025', status: 'Completed' },
];

const causes = [
  { id: 'CSE-001', name: 'Clean Water & Sanitation', projects: 3, budget: '₹28L', donors: 312, status: 'Active' },
  { id: 'CSE-002', name: 'Quality Education', projects: 6, budget: '₹45L', donors: 580, status: 'Active' },
  { id: 'CSE-003', name: 'Women Empowerment', projects: 4, budget: '₹32L', donors: 248, status: 'Active' },
  { id: 'CSE-004', name: 'Child Nutrition', projects: 2, budget: '₹18L', donors: 194, status: 'Active' },
];

const statusStyle: Record<string, string> = {
  Active: 'badge badge-teal',
  Completed: 'badge badge-green',
  Planned: 'badge badge-blue',
  Paused: 'badge badge-yellow',
};

const typeStyle: Record<string, string> = {
  Fundraiser: 'badge badge-teal',
  Material: 'badge badge-green',
  Project: 'badge badge-blue',
  Matching: 'badge badge-purple',
  Emergency: 'badge badge-red',
};

function pct(raised: number, target: number) {
  return Math.min(100, Math.round((raised / target) * 100));
}

function fmt(n: number) {
  return `₹${(n / 1_00_000).toFixed(1)}L`;
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState('campaigns');

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Campaigns & Causes</h1>
          <p className="page-subtitle">Launch fundraising campaigns and track cause-based giving</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> New Campaign</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Campaigns', value: '9', color: '#1AACB8' },
          { label: 'Total Raised (All)', value: '₹1.8Cr', color: '#10B981' },
          { label: 'Unique Donors', value: '1,840', color: '#6366F1' },
          { label: 'Causes Funded', value: '12', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-2xl font-extrabold" style={{ color: s.color, fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar w-fit">
        {['campaigns', 'causes', 'projects'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map(c => (
            <div key={c.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className={typeStyle[c.type]}>{c.type}</span>
                  <span className={statusStyle[c.status]}>{c.status}</span>
                </div>
                <div className="font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{c.name}</div>
                <div className="text-xs text-slate-500">Cause: {c.cause}</div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{fmt(c.raised)} raised</span>
                    <span className="text-slate-400">of {fmt(c.target)} goal</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{
                      width: `${pct(c.raised, c.target)}%`,
                      background: c.status === 'Completed' ? '#10B981' : '#1AACB8'
                    }} />
                  </div>
                  <div className="text-right text-xs text-slate-400 mt-1">{pct(c.raised, c.target)}% funded</div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>👤 {c.donors} donors</span>
                  <span>📅 {c.endDate}</span>
                </div>

                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 text-xs py-1.5">View Details</button>
                  <button className="btn-primary flex-1 text-xs py-1.5">Donate</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'causes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {causes.map(c => (
            <div key={c.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{c.name}</div>
                  <span className="badge badge-teal">{c.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="font-bold text-slate-800">{c.projects}</div>
                    <div className="text-slate-400">Projects</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="font-bold text-slate-800">{c.budget}</div>
                    <div className="text-slate-400">Budget</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="font-bold text-slate-800">{c.donors}</div>
                    <div className="text-slate-400">Donors</div>
                  </div>
                </div>
                <button className="btn-secondary text-xs py-1.5">View Cause Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Donor–Project Mapping</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>Donor</th><th>→</th><th>Cause</th><th>→</th><th>Project</th><th>→</th><th>Campaign</th></tr>
              </thead>
              <tbody>
                {[
                  { donor: 'Tata Trust', cause: 'Education', project: 'Digital Literacy Drive', campaign: 'School Kit Drive' },
                  { donor: 'Infosys Foundation', cause: 'Clean Water', project: 'Clean Water Initiative', campaign: 'Water for All – Q4' },
                  { donor: 'Ramesh Gupta', cause: 'Healthcare', project: 'Healthcare Outreach', campaign: 'Diwali Giving Drive' },
                  { donor: 'HCL Foundation', cause: 'Skill Dev', project: 'Women Empowerment Hub', campaign: 'Corporate CSR Match' },
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-800">{r.donor}</td>
                    <td className="text-slate-300 text-center">→</td>
                    <td><span className="badge badge-green">{r.cause}</span></td>
                    <td className="text-slate-300 text-center">→</td>
                    <td className="text-sm text-slate-700">{r.project}</td>
                    <td className="text-slate-300 text-center">→</td>
                    <td className="text-sm text-slate-600">{r.campaign}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
