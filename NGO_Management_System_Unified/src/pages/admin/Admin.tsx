import { useState } from 'react';
import { Settings, Users, Shield, Bell, Database, Key, Plus, Edit2, Trash2 } from 'lucide-react';

const users = [
  { id: 'USR-001', name: 'Priya Sharma', email: 'priya@hopefoundation.org', role: 'Project Manager', dept: 'Project Management', status: 'Active', lastLogin: '7 Oct 2025, 9:12 AM', access: 'Full Project Access' },
  { id: 'USR-002', name: 'Rahul Mehta', email: 'rahul@hopefoundation.org', role: 'Tech Lead', dept: 'Data & Tech', status: 'Active', lastLogin: '7 Oct 2025, 8:45 AM', access: 'Full System Access' },
  { id: 'USR-003', name: 'Sunita Roy', email: 'sunita@hopefoundation.org', role: 'HR Manager', dept: 'HR', status: 'Active', lastLogin: '6 Oct 2025, 5:30 PM', access: 'HR & Volunteers' },
  { id: 'USR-004', name: 'Amit Kumar', email: 'amit@hopefoundation.org', role: 'Finance Officer', dept: 'Finance', status: 'Inactive', lastLogin: '1 Oct 2025, 11:00 AM', access: 'Finance & Budget' },
  { id: 'USR-005', name: 'Deepika Rao', email: 'deepika@hopefoundation.org', role: 'Marketing Lead', dept: 'Marketing', status: 'Active', lastLogin: '7 Oct 2025, 10:00 AM', access: 'Reports & Comms' },
];

const roles = [
  { name: 'Admin', users: 2, permissions: ['Full system access', 'User management', 'Settings', 'RBAC control'] },
  { name: 'Project Manager', users: 8, permissions: ['Create/manage projects', 'Assign teams', 'View reports', 'Budget access'] },
  { name: 'Staff', users: 45, permissions: ['Project activities', 'Task management', 'Communication', 'Personal reports'] },
  { name: 'Volunteer', users: 1284, permissions: ['Permitted project access', 'Attendance', 'Task completion'] },
  { name: 'Viewer', users: 18, permissions: ['Read-only access', 'View permitted reports'] },
];

const auditLogs = [
  { user: 'Rahul Mehta', action: 'Exported donor database', module: 'Donors', time: '7 Oct, 11:32 AM', ip: '192.168.1.102', risk: 'Medium' },
  { user: 'Priya Sharma', action: 'Approved project proposal PP-2025-010', module: 'Projects', time: '7 Oct, 10:15 AM', ip: '192.168.1.105', risk: 'Low' },
  { user: 'Admin', action: 'Created new user: Deepika Rao', module: 'Admin', time: '5 Oct, 3:20 PM', ip: '192.168.1.100', risk: 'Low' },
  { user: 'Amit Kumar', action: 'Deleted budget entry BUD-2025-042', module: 'Resources', time: '4 Oct, 2:45 PM', ip: '192.168.1.108', risk: 'High' },
];

const riskStyle: Record<string, string> = {
  Low: 'badge badge-green',
  Medium: 'badge badge-yellow',
  High: 'badge badge-red',
};

const systemSettings = [
  { category: 'Donor Categories', description: 'Individual, Corporate, Organisation, Partner, Advisor' },
  { category: 'Contribution Types', description: 'Cash, Cheque, NEFT, UPI, Material, Time' },
  { category: 'Campaign Settings', description: 'Campaign duration, goal tracking, matching rules' },
  { category: 'Notification Settings', description: 'Email alerts, WhatsApp, in-app notifications' },
  { category: 'Communication Settings', description: 'Email templates, reply-to, SMTP config' },
  { category: 'User Permissions', description: 'Role-based access control (RBAC) configuration' },
  { category: 'Data / Export Settings', description: 'Data retention, export formats, backup schedule' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Admin & Settings</h1>
          <p className="page-subtitle">User management, access control, audit logs, and system configuration</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Add User</button>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '74', icon: <Users size={18} />, color: '#1AACB8' },
          { label: 'Active Roles', value: '5', icon: <Shield size={18} />, color: '#6366F1' },
          { label: 'Audit Events (Today)', value: '28', icon: <Database size={18} />, color: '#F59E0B' },
          { label: 'Security Alerts', value: '2', icon: <Key size={18} />, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: s.color + '15' }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tab-bar w-fit">
        {['users', 'roles', 'audit', 'settings'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">User Management</span>
            <span className="text-xs text-slate-400">{users.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>ID</th><th>User</th><th>Role</th><th>Department</th><th>Access Level</th><th>Last Login</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="text-xs text-slate-400">{u.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs"
                          style={{ background: '#1AACB8' }}>{u.name[0]}</div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{u.role}</td>
                    <td className="text-xs text-slate-500">{u.dept}</td>
                    <td className="text-xs text-slate-600">{u.access}</td>
                    <td className="text-xs text-slate-400">{u.lastLogin}</td>
                    <td><span className={u.status === 'Active' ? 'badge badge-green' : 'badge badge-gray'}>{u.status}</span></td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Edit2 size={13} /></button>
                        <button className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {roles.map((role, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} style={{ color: '#1AACB8' }} />
                    <span className="font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{role.name}</span>
                  </div>
                  <span className="badge badge-teal">{role.users} users</span>
                </div>
                <div className="flex flex-col gap-1">
                  {role.permissions.map(p => (
                    <div key={p} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
                <button className="btn-secondary text-xs py-1.5">Edit Role</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">Audit Logs</span>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs py-1">Filter</button>
              <button className="btn-secondary text-xs py-1">Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>User</th><th>Action</th><th>Module</th><th>Time</th><th>Risk</th></tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-800">{log.user}</td>
                    <td className="text-sm text-slate-600">{log.action}</td>
                    <td><span className="badge badge-blue">{log.module}</span></td>
                    <td className="text-xs text-slate-400">{log.time}</td>
                    <td><span className={riskStyle[log.risk]}>{log.risk}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemSettings.map((s, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex items-center gap-4">
                <div className="p-2.5 rounded-xl" style={{ background: '#E6F7F9' }}>
                  <Settings size={16} style={{ color: '#1AACB8' }} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm">{s.category}</div>
                  <div className="text-xs text-slate-500">{s.description}</div>
                </div>
                <button className="btn-secondary text-xs py-1.5">Configure</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
