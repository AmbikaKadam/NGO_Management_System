import { useState } from 'react';
import { Plus, Search, GraduationCap, CheckCircle2, Clock, XCircle } from 'lucide-react';

const interns = [
  { id: 'INT-001', name: 'Kavya Reddy', college: 'IIT Bombay', dept: 'Data & Tech', mentor: 'Rahul Mehta', start: '1 Sep 2025', end: '30 Nov 2025', status: 'Active', progress: 72, tasks: 18, completed: 13 },
  { id: 'INT-002', name: 'Arjun Sharma', college: 'Delhi University', dept: 'Project Management', mentor: 'Priya Sharma', start: '15 Aug 2025', end: '15 Nov 2025', status: 'Active', progress: 88, tasks: 24, completed: 21 },
  { id: 'INT-003', name: 'Meera Pillai', college: 'Symbiosis Pune', dept: 'Finance', mentor: 'Anita Gupta', start: '1 Oct 2025', end: '31 Dec 2025', status: 'Active', progress: 35, tasks: 12, completed: 4 },
  { id: 'INT-004', name: 'Rohit Jain', college: 'NIT Trichy', dept: 'Operations', mentor: 'Vikram Singh', start: '1 Jul 2025', end: '30 Sep 2025', status: 'Completed', progress: 100, tasks: 20, completed: 20 },
  { id: 'INT-005', name: 'Nisha Verma', college: 'BHU Varanasi', dept: 'HR', mentor: 'Sunita Roy', start: '1 Sep 2025', end: '30 Nov 2025', status: 'Active', progress: 60, tasks: 15, completed: 9 },
];

const applications = [
  { id: 'APP-2025-034', name: 'Aditya Kapoor', college: 'SRCC Delhi', dept: 'Finance', applied: '1 Oct 2025', status: 'Under Review' },
  { id: 'APP-2025-035', name: 'Pooja Nair', college: 'IIM Bangalore', dept: 'Marketing', applied: '3 Oct 2025', status: 'Shortlisted' },
  { id: 'APP-2025-036', name: 'Siddharth Rao', college: 'BITS Pilani', dept: 'Data & Tech', applied: '5 Oct 2025', status: 'New' },
];

const statusStyle: Record<string, string> = {
  Active: 'badge badge-teal',
  Completed: 'badge badge-green',
  'Under Review': 'badge badge-yellow',
  Shortlisted: 'badge badge-blue',
  New: 'badge badge-gray',
  Selected: 'badge badge-green',
  Rejected: 'badge badge-red',
};

export default function InternsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Intern Management</h1>
          <p className="page-subtitle">Manage internship applications, assignments, and completion</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Post Internship</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Interns', value: '28', color: '#1AACB8' },
          { label: 'Active Interns', value: '21', color: '#10B981' },
          { label: 'Pending Applications', value: '7', color: '#F59E0B' },
          { label: 'Completed This Year', value: '34', color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-2xl font-extrabold" style={{ color: s.color, fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar w-fit">
        {['active', 'applications', 'completed'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {interns.filter(i => i.status !== 'Completed').map(intern => (
            <div key={intern.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: '#1AACB8' }}>
                    {intern.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{intern.name}</div>
                    <div className="text-xs text-slate-400">{intern.college}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-slate-400">Department</div>
                    <div className="font-semibold text-slate-700">{intern.dept}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-slate-400">Mentor</div>
                    <div className="font-semibold text-slate-700">{intern.mentor}</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold">{intern.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${intern.progress}%`, background: '#1AACB8' }} />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tasks: {intern.completed}/{intern.tasks}</span>
                  <span>{intern.start} – {intern.end}</span>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 text-xs py-1.5">Profile</button>
                  <button className="btn-primary flex-1 text-xs py-1.5">Work Log</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">Internship Applications</span>
            <span className="badge badge-yellow">{applications.length} pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>ID</th><th>Applicant</th><th>College</th><th>Department</th><th>Applied On</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {applications.map(a => (
                  <tr key={a.id}>
                    <td className="text-xs text-slate-400">{a.id}</td>
                    <td className="font-semibold text-slate-800">{a.name}</td>
                    <td>{a.college}</td>
                    <td>{a.dept}</td>
                    <td className="text-xs">{a.applied}</td>
                    <td><span className={statusStyle[a.status]}>{a.status}</span></td>
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

      {activeTab === 'completed' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">Completed Internships</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>Name</th><th>College</th><th>Department</th><th>Period</th><th>Status</th><th>Certificate</th></tr>
              </thead>
              <tbody>
                {interns.filter(i => i.status === 'Completed').map(i => (
                  <tr key={i.id}>
                    <td className="font-semibold text-slate-800">{i.name}</td>
                    <td>{i.college}</td>
                    <td>{i.dept}</td>
                    <td className="text-xs">{i.start} – {i.end}</td>
                    <td><span className="badge badge-green">Completed</span></td>
                    <td><button className="btn-secondary text-xs py-1">Download</button></td>
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
