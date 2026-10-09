import { useState } from 'react';
import { Plus, Search, Users, Building2, Clock, TrendingUp, Eye, Edit2 } from 'lucide-react';

const departments = [
  { name: 'Project Management', head: 'Priya Sharma', employees: 12, active: 11 },
  { name: 'Administration', head: 'Ravi Kumar', employees: 8, active: 8 },
  { name: 'Finance', head: 'Anita Gupta', employees: 6, active: 5 },
  { name: 'HR', head: 'Sunita Roy', employees: 7, active: 7 },
  { name: 'Data & Tech', head: 'Rahul Mehta', employees: 9, active: 9 },
  { name: 'Marketing', head: 'Deepika Rao', employees: 5, active: 4 },
  { name: 'Operations', head: 'Vikram Singh', employees: 14, active: 13 },
  { name: 'Risk Management', head: 'Asha Iyer', employees: 4, active: 4 },
  { name: 'Research & Innovation', head: 'Dr. Arjun Nair', employees: 6, active: 6 },
];

const employees = [
  { id: 'EMP-001', name: 'Priya Sharma', dept: 'Project Management', role: 'Senior PM', status: 'Active', joinDate: '1 Mar 2022', attendance: '96%', email: 'priya@hopefoundation.org' },
  { id: 'EMP-002', name: 'Rahul Mehta', dept: 'Data & Tech', role: 'Tech Lead', status: 'Active', joinDate: '15 Jan 2023', attendance: '98%', email: 'rahul@hopefoundation.org' },
  { id: 'EMP-003', name: 'Sunita Roy', dept: 'HR', role: 'HR Manager', status: 'Active', joinDate: '1 Jun 2021', attendance: '94%', email: 'sunita@hopefoundation.org' },
  { id: 'EMP-004', name: 'Vikram Singh', dept: 'Operations', role: 'Ops Manager', status: 'Active', joinDate: '10 Apr 2020', attendance: '97%', email: 'vikram@hopefoundation.org' },
  { id: 'EMP-005', name: 'Anita Patel', dept: 'Project Management', role: 'Health PM', status: 'Active', joinDate: '1 Sep 2023', attendance: '92%', email: 'anita@hopefoundation.org' },
  { id: 'EMP-006', name: 'Amit Kumar', dept: 'Finance', role: 'Finance Officer', status: 'On Leave', joinDate: '15 Jul 2022', attendance: '88%', email: 'amit@hopefoundation.org' },
  { id: 'EMP-007', name: 'Deepika Rao', dept: 'Marketing', role: 'Marketing Lead', status: 'Active', joinDate: '20 Feb 2024', attendance: '95%', email: 'deepika@hopefoundation.org' },
  { id: 'EMP-008', name: 'Asha Iyer', dept: 'Risk Management', role: 'Risk Analyst', status: 'Active', joinDate: '5 Nov 2022', attendance: '91%', email: 'asha@hopefoundation.org' },
];

const statusStyle: Record<string, string> = {
  Active: 'badge badge-green',
  'On Leave': 'badge badge-yellow',
  Inactive: 'badge badge-gray',
};

const pendingRequirements = [
  { role: 'Data Analyst', dept: 'Data & Tech', urgency: 'High', openedDate: '1 Oct 2025', status: 'Accepting Applications' },
  { role: 'Field Coordinator', dept: 'Operations', urgency: 'Medium', openedDate: '25 Sep 2025', status: 'Shortlisting' },
  { role: 'Finance Assistant', dept: 'Finance', urgency: 'Low', openedDate: '15 Sep 2025', status: 'Accepting Applications' },
];

export default function HRPage() {
  const [activeTab, setActiveTab] = useState('employees');
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">HR Management</h1>
          <p className="page-subtitle">Manage employees, departments, attendance, and performance</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Add Employee</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: '71', icon: <Users size={18} style={{ color: '#1AACB8' }} />, bg: '#E6F7F9' },
          { label: 'Departments', value: '9', icon: <Building2 size={18} style={{ color: '#6366F1' }} />, bg: '#EEF2FF' },
          { label: 'Avg Attendance', value: '94.5%', icon: <Clock size={18} style={{ color: '#10B981' }} />, bg: '#ECFDF5' },
          { label: 'Open Positions', value: '3', icon: <TrendingUp size={18} style={{ color: '#F59E0B' }} />, bg: '#FFFBEB' },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="text-xl font-extrabold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar w-fit">
        {['employees', 'departments', 'requirements', 'attendance'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'employees' && (
        <>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="form-input pl-9 max-w-sm" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Department</th><th>Role</th><th>Status</th><th>Join Date</th><th>Attendance</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id}>
                      <td className="text-xs text-slate-400">{e.id}</td>
                      <td>
                        <div className="font-semibold text-slate-800">{e.name}</div>
                        <div className="text-[11px] text-slate-400">{e.email}</div>
                      </td>
                      <td>{e.dept}</td>
                      <td>{e.role}</td>
                      <td><span className={statusStyle[e.status]}>{e.status}</span></td>
                      <td className="text-xs">{e.joinDate}</td>
                      <td>
                        <span className={`font-semibold text-sm ${parseFloat(e.attendance) >= 95 ? 'text-green-600' : parseFloat(e.attendance) >= 90 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {e.attendance}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded hover:bg-teal-50 text-slate-400 hover:text-teal-600"><Eye size={14} /></button>
                          <button className="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Edit2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((d, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#E6F7F9' }}>
                    <Building2 size={18} style={{ color: '#1AACB8' }} />
                  </div>
                  <span className="badge badge-teal">{d.employees} staff</span>
                </div>
                <div className="font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{d.name}</div>
                <div className="text-xs text-slate-500">Head: {d.head}</div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-full h-1.5 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-teal-400" style={{ width: `${(d.active / d.employees * 100).toFixed(0)}%` }} />
                  </div>
                  <span className="text-slate-500 whitespace-nowrap">{d.active}/{d.employees} active</span>
                </div>
                <button className="btn-secondary text-xs py-1.5">View Department</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'requirements' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">Open HR Requirements</span>
            <button className="btn-primary text-xs py-1.5"><Plus size={13} /> Add Requirement</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>Role</th><th>Department</th><th>Urgency</th><th>Opened On</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {pendingRequirements.map((r, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-800">{r.role}</td>
                    <td>{r.dept}</td>
                    <td><span className={r.urgency === 'High' ? 'badge badge-red' : r.urgency === 'Medium' ? 'badge badge-yellow' : 'badge badge-gray'}>{r.urgency}</span></td>
                    <td className="text-xs">{r.openedDate}</td>
                    <td><span className="badge badge-blue">{r.status}</span></td>
                    <td><button className="btn-secondary text-xs py-1">View Applicants</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Attendance – October 2025</span>
            <button className="btn-secondary text-xs">Export</button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: '#1AACB8' }}>
                    {e.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-800 truncate">{e.name}</div>
                    <div className="text-xs text-slate-400">{e.dept}</div>
                  </div>
                  <div className={`text-sm font-bold ${parseFloat(e.attendance) >= 95 ? 'text-green-600' : parseFloat(e.attendance) >= 90 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {e.attendance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
