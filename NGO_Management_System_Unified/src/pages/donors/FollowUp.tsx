import { useState } from 'react';
import { Plus, Phone, Mail, MessageSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const tasks = [
  { id: 'TSK-001', title: 'Call Ramesh Gupta re: Q4 pledge', type: 'Call', donor: 'Ramesh Gupta', priority: 'High', due: 'Today', status: 'Pending', assigned: 'Priya Sharma' },
  { id: 'TSK-002', title: 'Send thank-you email to Tata Trust', type: 'Email', donor: 'Tata Trust', priority: 'High', due: '9 Oct 2025', status: 'Pending', assigned: 'Sunita Roy' },
  { id: 'TSK-003', title: 'Follow-up on Birla pledge renewal', type: 'Call', donor: 'Birla Charitable', priority: 'Medium', due: '12 Oct 2025', status: 'Completed', assigned: 'Rahul Mehta' },
  { id: 'TSK-004', title: 'Schedule Infosys Q4 presentation', type: 'Meeting', donor: 'Infosys Foundation', priority: 'High', due: '15 Oct 2025', status: 'Pending', assigned: 'Admin' },
  { id: 'TSK-005', title: 'Send impact report to HCL Foundation', type: 'Email', donor: 'HCL Foundation', priority: 'Medium', due: '20 Oct 2025', status: 'Pending', assigned: 'Deepika Rao' },
];

const pipeline = [
  { stage: 'Identify', count: 42, color: '#94A3B8' },
  { stage: 'Profile', count: 28, color: '#6366F1' },
  { stage: 'Connect', count: 18, color: '#1AACB8' },
  { stage: 'Inspire', count: 12, color: '#F59E0B' },
  { stage: 'Engage', count: 8, color: '#10B981' },
  { stage: 'Maintain', count: 4820, color: '#059669' },
];

const reminders = [
  { donor: 'Ajay Verma', type: 'Lapsed Donor', message: 'No donation in 8+ months', action: 'Send Re-engagement Email', due: '10 Oct 2025' },
  { donor: 'Sunita Mehra', type: 'Pledge Due', message: 'November pledge upcoming', action: 'Payment Reminder', due: '1 Nov 2025' },
  { donor: 'Anonymous CSR', type: 'Communication', message: 'No response to last 2 emails', action: 'Follow-up Call', due: '12 Oct 2025' },
];

const priorityStyle: Record<string, string> = {
  High: 'badge badge-red',
  Medium: 'badge badge-yellow',
  Low: 'badge badge-gray',
};

const typeIcons: Record<string, React.ReactNode> = {
  Call: <Phone size={13} />,
  Email: <Mail size={13} />,
  Meeting: <MessageSquare size={13} />,
};

export default function FollowUpPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Follow-Up & Action Planning</h1>
          <p className="page-subtitle">Manage tasks, reminders, and donor engagement pipeline</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(s => !s)}>
          <Plus size={16} /> Create Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Tasks', value: '18', color: '#F59E0B' },
          { label: 'Completed Today', value: '5', color: '#10B981' },
          { label: 'Reminders Due', value: '3', color: '#EF4444' },
          { label: 'Donors in Pipeline', value: '110', color: '#1AACB8' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-2xl font-extrabold" style={{ color: s.color, fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Create Follow-Up Task</span>
            <button onClick={() => setShowAdd(false)} className="text-slate-400">✕</button>
          </div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Task Title', 'Donor Name', 'Task Type', 'Priority', 'Due Date', 'Assigned To'].map(f => (
              <div key={f}>
                <label className="form-label">{f}</label>
                <input className="form-input" placeholder={`Enter ${f.toLowerCase()}...`} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="form-label">Notes</label>
              <textarea className="form-input h-20 resize-none" placeholder="Additional context..." />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary">Create Task</button>
            </div>
          </div>
        </div>
      )}

      <div className="tab-bar w-fit">
        {['tasks', 'reminders', 'pipeline'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'tasks' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>Task</th><th>Type</th><th>Donor</th><th>Priority</th><th>Due</th><th>Assigned</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id}>
                    <td className="font-semibold text-slate-800 max-w-[200px]">{t.title}</td>
                    <td>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        {typeIcons[t.type]} <span className="text-xs">{t.type}</span>
                      </div>
                    </td>
                    <td className="text-sm text-slate-600">{t.donor}</td>
                    <td><span className={priorityStyle[t.priority]}>{t.priority}</span></td>
                    <td className="text-xs">{t.due}</td>
                    <td className="text-sm">{t.assigned}</td>
                    <td>
                      <span className={t.status === 'Completed' ? 'badge badge-green' : 'badge badge-yellow'}>{t.status}</span>
                    </td>
                    <td>
                      {t.status !== 'Completed' && (
                        <button className="p-1.5 rounded hover:bg-green-50 text-green-500">
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reminders' && (
        <div className="flex flex-col gap-3">
          {reminders.map((r, i) => (
            <div key={i} className="card">
              <div className="card-body flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="p-2.5 rounded-xl" style={{ background: '#FEF3C7' }}>
                  <AlertCircle size={20} style={{ color: '#F59E0B' }} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{r.donor}</div>
                  <div className="text-xs text-slate-500">{r.message}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Action</div>
                    <div className="text-xs font-semibold text-slate-700">{r.action}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Due</div>
                    <div className="text-xs font-semibold text-slate-700">{r.due}</div>
                  </div>
                  <button className="btn-primary text-xs py-1.5">Take Action</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Donor Engagement Pipeline</span>
            <span className="text-xs text-slate-400">All stages</span>
          </div>
          <div className="card-body">
            <div className="flex items-stretch gap-3 overflow-x-auto pb-2">
              {pipeline.map((stage, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[120px]">
                  <div className="w-full p-4 rounded-xl text-center border-2" style={{ borderColor: stage.color + '40', background: stage.color + '10' }}>
                    <div className="text-2xl font-extrabold" style={{ color: stage.color, fontFamily: 'Nunito, sans-serif' }}>{stage.count}</div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">{stage.stage}</div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="text-slate-300 text-xl font-light self-center">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
