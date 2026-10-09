import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight } from 'lucide-react';

const monthlyDonations = [
  { month: 'Jan', individual: 120000, corporate: 280000 },
  { month: 'Feb', individual: 145000, corporate: 310000 },
  { month: 'Mar', individual: 132000, corporate: 290000 },
  { month: 'Apr', individual: 168000, corporate: 350000 },
  { month: 'May', individual: 155000, corporate: 420000 },
  { month: 'Jun', individual: 180000, corporate: 390000 },
  { month: 'Jul', individual: 195000, corporate: 410000 },
  { month: 'Aug', individual: 210000, corporate: 450000 },
  { month: 'Sep', individual: 228000, corporate: 480000 },
  { month: 'Oct', individual: 202000, corporate: 396000 },
];

const donorTypes = [
  { name: 'Individual', value: 68, color: '#1AACB8' },
  { name: 'Corporate', value: 18, color: '#6366F1' },
  { name: 'Organisation', value: 9, color: '#10B981' },
  { name: 'CSR', value: 5, color: '#F59E0B' },
];

const topDonors = [
  { name: 'Tata Trust', type: 'Corporate', amount: '₹15,00,000', cause: 'Education', status: 'Active' },
  { name: 'Infosys Foundation', type: 'Corporate', amount: '₹12,00,000', cause: 'Digital Literacy', status: 'Active' },
  { name: 'Ramesh Gupta', type: 'Individual', amount: '₹8,50,000', cause: 'Healthcare', status: 'Active' },
  { name: 'Birla Charitable', type: 'CSR', amount: '₹6,00,000', cause: 'Rural Dev', status: 'Active' },
  { name: 'Meena Kapoor', type: 'Individual', amount: '₹4,20,000', cause: 'Women Empowerment', status: 'Lapsed' },
];

export default function DonorDashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="page-title">Donor Management</h1>
        <p className="page-subtitle">Track donor relationships, contributions, and retention</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Donors', value: '4,820', sub: '+148 this month', icon: <Users size={18} />, up: true },
          { label: 'Total Raised (YTD)', value: '₹3.2 Cr', sub: '+22% vs last year', icon: <DollarSign size={18} />, up: true },
          { label: 'Avg Donation', value: '₹6,640', sub: '+8% vs last quarter', icon: <TrendingUp size={18} />, up: true },
          { label: 'Donor Retention', value: '72.4%', sub: '-3% vs last year', icon: <Target size={18} />, up: false },
        ].map(s => (
          <div key={s.label} className="stat-card flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl" style={{ background: '#E6F7F9' }}>
                <span style={{ color: '#1AACB8' }}>{s.icon}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                <ArrowUpRight size={11} className={s.up ? '' : 'rotate-180'} /> {s.sub.split(' ')[0]}
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <span className="card-title">Monthly Donations (Individual vs Corporate)</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyDonations} barGap={2}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => `₹${(Number(v) / 1000).toFixed(0)}k`}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="individual" fill="#1AACB8" radius={[3, 3, 0, 0]} name="Individual" barSize={14} />
                <Bar dataKey="corporate" fill="#6366F1" radius={[3, 3, 0, 0]} name="Corporate" barSize={14} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-6 justify-center mt-2">
              <div className="flex items-center gap-2 text-xs"><span className="w-3 h-3 rounded-full bg-teal-400" /> Individual</div>
              <div className="flex items-center gap-2 text-xs"><span className="w-3 h-3 rounded-full bg-indigo-500" /> Corporate</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Donor Types</span></div>
          <div className="card-body flex flex-col items-center gap-3">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={donorTypes} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value">
                  {donorTypes.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs w-full">
              {donorTypes.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-slate-500">{d.name}</span>
                  <span className="font-bold text-slate-700 ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top donors */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <span className="card-title">Top Donors</span>
          <button className="text-xs font-semibold" style={{ color: '#1AACB8' }}>View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr><th>Donor</th><th>Type</th><th>Total Contribution</th><th>Cause</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {topDonors.map((d, i) => (
                <tr key={i}>
                  <td className="font-semibold text-slate-800">{d.name}</td>
                  <td><span className={d.type === 'Individual' ? 'badge badge-teal' : d.type === 'Corporate' ? 'badge badge-blue' : 'badge badge-yellow'}>{d.type}</span></td>
                  <td className="font-bold text-slate-700">{d.amount}</td>
                  <td className="text-sm text-slate-600">{d.cause}</td>
                  <td><span className={d.status === 'Active' ? 'badge badge-green' : 'badge badge-red'}>{d.status}</span></td>
                  <td><button className="btn-secondary text-xs py-1">View Profile</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Revenue by Category', items: [{ k: 'Health Projects', v: '₹85L' }, { k: 'Education', v: '₹72L' }, { k: 'Environment', v: '₹48L' }, { k: 'Social Programs', v: '₹35L' }] },
          { label: 'Revenue by Stream', items: [{ k: 'Individual Donors', v: '₹92L' }, { k: 'Corporate CSR', v: '₹1.4Cr' }, { k: 'Government Grants', v: '₹55L' }, { k: 'Self-Funding', v: '₹18L' }] },
          { label: 'Geographic Distribution', items: [{ k: 'Maharashtra', v: '₹1.1Cr' }, { k: 'Delhi NCR', v: '₹78L' }, { k: 'Karnataka', v: '₹52L' }, { k: 'Rajasthan', v: '₹38L' }] },
        ].map(block => (
          <div key={block.label} className="card">
            <div className="card-header"><span className="card-title">{block.label}</span></div>
            <div className="card-body flex flex-col gap-2">
              {block.items.map(item => (
                <div key={item.k} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-600">{item.k}</span>
                  <span className="font-bold text-slate-800 text-sm">{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
