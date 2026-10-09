import { useState } from 'react';
import { TrendingUp, Target, DollarSign, Star, Plus, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const outcomeData = [
  { month: 'May', contributions: 48, conversions: 32, pledges: 15 },
  { month: 'Jun', contributions: 55, conversions: 38, pledges: 22 },
  { month: 'Jul', contributions: 62, conversions: 44, pledges: 28 },
  { month: 'Aug', contributions: 70, conversions: 52, pledges: 35 },
  { month: 'Sep', contributions: 68, conversions: 49, pledges: 31 },
  { month: 'Oct', contributions: 74, conversions: 56, pledges: 38 },
];

const materialLogs = [
  { donor: 'Tata Trust', item: 'School Bags (500 sets)', project: 'Girls Education', date: '5 Oct 2025', value: '₹1,50,000' },
  { donor: 'Ramesh Gupta', item: 'Medical Kits (50 units)', project: 'Healthcare Outreach', date: '2 Oct 2025', value: '₹80,000' },
  { donor: 'HCL Foundation', item: 'Laptops (30 units)', project: 'Digital Literacy', date: '28 Sep 2025', value: '₹9,00,000' },
];

const pledges = [
  { donor: 'Birla Charitable', amount: '₹2,00,000', cause: 'Rural Dev', dueDate: '31 Dec 2025', status: 'Confirmed', campaign: 'Diwali Drive' },
  { donor: 'Sunita Mehra', amount: '₹50,000', cause: 'Women Empowerment', dueDate: '30 Nov 2025', status: 'Verbal', campaign: 'General' },
  { donor: 'Anonymous CSR', amount: '₹5,00,000', cause: 'Education', dueDate: '15 Jan 2026', status: 'Pending', campaign: 'Corporate CSR Match' },
];

const pledgeStyle: Record<string, string> = {
  Confirmed: 'badge badge-green',
  Verbal: 'badge badge-yellow',
  Pending: 'badge badge-gray',
  Converted: 'badge badge-teal',
};

export default function OutcomesPage() {
  const [activeTab, setActiveTab] = useState('tracking');

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Outcomes & Conversion</h1>
          <p className="page-subtitle">Track engagement outcomes, pledges, material donations, and revenue conversion</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Log Outcome</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Conversion Rate (Oct)', value: '75.7%', color: '#10B981' },
          { label: 'Pledges Captured', value: '38', color: '#1AACB8' },
          { label: 'Material Value (Oct)', value: '₹11.3L', color: '#6366F1' },
          { label: 'Revenue Streams', value: '4 active', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-2xl font-extrabold" style={{ color: s.color, fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar w-fit">
        {['tracking', 'pledges', 'material', 'revenue'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'tracking' && (
        <>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Outcome Tracking – May to October 2025</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={outcomeData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="contributions" stroke="#1AACB8" strokeWidth={2.5} dot={{ r: 3 }} name="Contributions" />
                  <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} name="Conversions" />
                  <Line type="monotone" dataKey="pledges" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} name="Pledges" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-6 justify-center mt-2">
                {[
                  { label: 'Contributions', color: '#1AACB8' },
                  { label: 'Conversions', color: '#10B981' },
                  { label: 'Pledges', color: '#F59E0B' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-0.5 rounded" style={{ background: l.color, display: 'inline-block' }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Response Rate', value: '82%', icon: '📊' },
              { label: 'Avg Gift (Individual)', value: '₹18,400', icon: '💝' },
              { label: 'Cause Matched', value: '94%', icon: '🎯' },
              { label: 'Follow-up Scheduled', value: '87%', icon: '📅' },
            ].map(s => (
              <div key={s.label} className="stat-card flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-xl font-extrabold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'pledges' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">Pledge Tracking</span>
            <button className="btn-primary text-xs py-1.5"><Plus size={13} /> Log Pledge</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>Donor</th><th>Pledge Amount</th><th>Cause</th><th>Campaign</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {pledges.map((p, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-800">{p.donor}</td>
                    <td className="font-bold text-slate-700">{p.amount}</td>
                    <td className="text-xs">{p.cause}</td>
                    <td className="text-xs text-slate-600">{p.campaign}</td>
                    <td className="text-xs">{p.dueDate}</td>
                    <td><span className={pledgeStyle[p.status]}>{p.status}</span></td>
                    <td>
                      <button className="btn-secondary text-xs py-1">Convert to Donation</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'material' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">Material & Time Donations</span>
            <button className="btn-primary text-xs py-1.5"><Plus size={13} /> Log Material</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>Donor</th><th>Item / Description</th><th>Project</th><th>Date</th><th>Estimated Value</th></tr>
              </thead>
              <tbody>
                {materialLogs.map((m, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-800">{m.donor}</td>
                    <td>{m.item}</td>
                    <td className="text-xs text-slate-600">{m.project}</td>
                    <td className="text-xs">{m.date}</td>
                    <td className="font-bold text-slate-700">{m.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { stream: 'Public Donations', sources: ['Individual Donors', 'Crowdfunding', 'Online Platforms', 'Events & Marathons'], icon: '👥', total: '₹1.2 Cr' },
            { stream: 'Corporate Giving', sources: ['CSR Funds', 'Employee Giving', 'Matching Grants', 'Brand Sponsorships'], icon: '🏢', total: '₹1.4 Cr' },
            { stream: 'Self-Funding', sources: ['Social Businesses', 'Training Fees', 'Course Fees', 'Memberships', 'Awards'], icon: '💼', total: '₹40L' },
            { stream: 'Grants & Funding', sources: ['Government Grants', 'Foreign Grants', 'Corpus / Endowment'], icon: '🎗️', total: '₹55L' },
          ].map(s => (
            <div key={s.stream} className="card">
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.stream}</div>
                    <div className="text-xs text-slate-400">Total: {s.total}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {s.sources.map(src => (
                    <div key={src} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="text-teal-500 flex-shrink-0" />
                      {src}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
