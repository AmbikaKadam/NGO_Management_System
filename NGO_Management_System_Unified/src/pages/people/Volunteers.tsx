import { useState } from 'react';
import { Plus, Search, Star, Award, Clock, CheckCircle2, XCircle } from 'lucide-react';

const volunteers = [
  { id: 'VOL-001', name: 'Ritu Sharma', skills: ['Teaching', 'First Aid'], projects: ['Digital Literacy Drive'], events: 8, hours: 245, status: 'Active', since: 'Jan 2023', rating: 4.8 },
  { id: 'VOL-002', name: 'Karan Malhotra', skills: ['Web Dev', 'Data Entry'], projects: ['Clean Water Initiative'], events: 5, hours: 180, status: 'Active', since: 'Mar 2023', rating: 4.5 },
  { id: 'VOL-003', name: 'Sneha Pillai', skills: ['Counseling', 'Communication'], projects: ['Women Empowerment Hub'], events: 12, hours: 380, status: 'Active', since: 'Jun 2022', rating: 4.9 },
  { id: 'VOL-004', name: 'Arun Kumar', skills: ['Photography', 'Social Media'], projects: [], events: 3, hours: 45, status: 'Inactive', since: 'Aug 2024', rating: 3.8 },
  { id: 'VOL-005', name: 'Divya Nair', skills: ['Medical', 'Community Health'], projects: ['Healthcare Outreach'], events: 20, hours: 510, status: 'Active', since: 'Oct 2021', rating: 5.0 },
  { id: 'VOL-006', name: 'Manish Rao', skills: ['Construction', 'Logistics'], projects: ['School Renovation – Nashik'], events: 6, hours: 220, status: 'Active', since: 'Apr 2023', rating: 4.3 },
];

const applications = [
  { name: 'Tanvi Gupta', skills: 'Education, Child Care', applied: '5 Oct 2025', status: 'New' },
  { name: 'Suresh Patil', skills: 'Agriculture, Rural Development', applied: '3 Oct 2025', status: 'Under Review' },
  { name: 'Preethi Raj', skills: 'IT Support, Data Analysis', applied: '1 Oct 2025', status: 'Approved' },
];

export default function VolunteersPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [search, setSearch] = useState('');

  const filtered = volunteers.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Volunteer Management</h1>
          <p className="page-subtitle">Recruit, assign, and recognize volunteers across projects</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Add Volunteer</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Volunteers', value: '1,284', color: '#1AACB8' },
          { label: 'Active This Month', value: '842', color: '#10B981' },
          { label: 'Total Hours (Oct)', value: '14,820', color: '#6366F1' },
          { label: 'Pending Applications', value: '23', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-2xl font-extrabold" style={{ color: s.color, fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar w-fit">
        {['list', 'applications', 'assignments', 'certificates'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'list' && (
        <>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="form-input pl-9 max-w-sm" placeholder="Search volunteers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(v => (
              <div key={v.id} className="card hover:shadow-md transition-shadow">
                <div className="card-body flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ background: v.status === 'Active' ? '#1AACB8' : '#94A3B8' }}>
                      {v.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-sm">{v.name}</div>
                      <div className="text-xs text-slate-400">{v.id} · since {v.since}</div>
                    </div>
                    <span className={v.status === 'Active' ? 'badge badge-green' : 'badge badge-gray'}>{v.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {v.skills.map(s => (
                      <span key={s} className="badge badge-teal text-[10px]">{s}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="font-bold text-slate-800">{v.events}</div>
                      <div className="text-slate-400">Events</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="font-bold text-slate-800">{v.hours}</div>
                      <div className="text-slate-400">Hours</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="font-bold text-slate-800 flex items-center justify-center gap-0.5">
                        {v.rating} <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="text-slate-400">Rating</div>
                    </div>
                  </div>
                  {v.projects.length > 0 && (
                    <div className="text-xs text-slate-500">
                      Assigned: {v.projects.join(', ')}
                    </div>
                  )}
                  <button className="btn-secondary text-xs py-1.5">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'applications' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">Volunteer Applications</span>
            <button className="btn-primary text-xs py-1.5">Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>Name</th><th>Skills</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {applications.map((a, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-800">{a.name}</td>
                    <td className="text-xs text-slate-500">{a.skills}</td>
                    <td className="text-xs">{a.applied}</td>
                    <td>
                      <span className={
                        a.status === 'Approved' ? 'badge badge-green' :
                        a.status === 'New' ? 'badge badge-gray' : 'badge badge-yellow'
                      }>{a.status}</span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-green-50 text-green-500"><CheckCircle2 size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-red-50 text-red-400"><XCircle size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Project & Event Assignments</span>
            <button className="btn-primary text-xs py-1.5"><Plus size={13} /> Assign</button>
          </div>
          <div className="card-body">
            <div className="flex flex-col gap-3">
              {volunteers.filter(v => v.projects.length > 0).map(v => (
                <div key={v.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: '#1AACB8' }}>
                    {v.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-800">{v.name}</div>
                    <div className="text-xs text-slate-400">{v.projects.join(' · ')}</div>
                  </div>
                  <div className="text-xs text-slate-500">{v.hours}h logged</div>
                  <button className="btn-secondary text-xs py-1">Reassign</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Certificates & Recognition</span>
          </div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
            {volunteers.filter(v => v.hours >= 200).map(v => (
              <div key={v.id} className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-teal-200 bg-teal-50">
                <Award size={32} style={{ color: '#1AACB8' }} />
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{v.name}</div>
                  <div className="text-xs text-slate-500">{v.hours}+ hours contributed</div>
                </div>
                <button className="btn-primary text-xs py-1.5">Generate</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
