import { useState } from 'react';
import { Phone, Mail, Gift, MessageSquare, Camera, FileText, CheckCircle2, Clock, Plus } from 'lucide-react';

const taskCards = [
  { id: 'ENG-001', profile: 'Ramesh Gupta', occasion: 'Birthday – 15 Oct', type: 'Call', status: 'Pending', template: 'Birthday Greeting Call', assigned: 'Priya Sharma', remarks: '', priority: 'High' },
  { id: 'ENG-002', profile: 'Tata Trust', occasion: 'Annual CSR Meet', type: 'Visit', status: 'Completed', template: 'Corporate Relationship', assigned: 'Sunita Roy', remarks: 'Meeting went well. Interested in Q1 partnership.', priority: 'High' },
  { id: 'ENG-003', profile: 'Sunita Mehra', occasion: 'Birthday – 22 Oct', type: 'Gift', status: 'Pending', template: 'Gift + Letter', assigned: 'Rahul Mehta', remarks: '', priority: 'Medium' },
  { id: 'ENG-004', profile: 'HCL Foundation', occasion: 'Foundation Day', type: 'Email', status: 'Pending', template: 'Foundation Day Greetings', assigned: 'Deepika Rao', remarks: '', priority: 'Medium' },
  { id: 'ENG-005', profile: 'Meena Kapoor', occasion: 'Lapsed Donor', type: 'Call', status: 'Pending', template: 'Re-engagement Script', assigned: 'Priya Sharma', remarks: '', priority: 'High' },
];

const actionWorkspaceSteps = [
  { step: '1. Profile Context', icon: '👤', desc: 'View donor details, relationship, cause interests, contribution history' },
  { step: '2. Pre-Check (7 Days)', icon: '✅', desc: 'Alert sent, reviewed previous interactions, staff assigned, task selected' },
  { step: '3. Occasion Action', icon: '📞', desc: 'Make call/visit, send WhatsApp/message, deliver gift, use template' },
  { step: '4. Log Response', icon: '📝', desc: 'Record conversation, upload proof, rate response, mark task complete' },
  { step: '5. Outcome & Pledge', icon: '⭐', desc: 'Log contribution, capture pledge, link to cause/campaign, schedule follow-up' },
  { step: '6. Impact Feedback', icon: '💚', desc: 'Send thank-you note, share impact update, update next date' },
];

const typeIcons: Record<string, React.ReactNode> = {
  Call: <Phone size={14} />,
  Email: <Mail size={14} />,
  Gift: <Gift size={14} />,
  Visit: <MessageSquare size={14} />,
};

const typeStyle: Record<string, string> = {
  Call: 'badge badge-teal',
  Email: 'badge badge-blue',
  Gift: 'badge badge-purple',
  Visit: 'badge badge-green',
};

export default function EngagementPage() {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Engagement & Actions</h1>
          <p className="page-subtitle">End-to-end donor engagement journey from occasion to outcome</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Create Task</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Due Today', value: '3', color: '#EF4444' },
          { label: 'Completed This Week', value: '14', color: '#10B981' },
          { label: 'Call Logs (Oct)', value: '28', color: '#1AACB8' },
          { label: 'Avg Response Rating', value: '4.2 ★', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-2xl font-extrabold" style={{ color: s.color, fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar w-fit">
        {['tasks', 'workspace', 'logs'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {taskCards.map(task => (
            <div key={task.id} className={`card hover:shadow-md transition-shadow cursor-pointer ${activeTask === task.id ? 'ring-2 ring-teal-400' : ''}`}
              onClick={() => setActiveTask(t => t === task.id ? null : task.id)}>
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className={typeStyle[task.type]}>{task.type}</span>
                  <span className={task.status === 'Completed' ? 'badge badge-green' : 'badge badge-yellow'}>{task.status}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-800">{task.profile}</div>
                  <div className="text-xs text-slate-500">{task.occasion}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  {typeIcons[task.type]}
                  <span>{task.template}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Assigned: {task.assigned}</span>
                  <span className={task.priority === 'High' ? 'text-red-500 font-semibold' : 'text-yellow-600 font-semibold'}>{task.priority}</span>
                </div>
                {task.remarks && (
                  <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2 italic">{task.remarks}</div>
                )}
                {activeTask === task.id && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <textarea className="form-input h-16 resize-none text-xs" placeholder="Add remarks / notes..." />
                    <div className="flex gap-2">
                      <button className="btn-secondary flex-1 text-xs py-1.5">
                        <Camera size={12} /> Upload Proof
                      </button>
                      <button className="btn-primary flex-1 text-xs py-1.5">
                        <CheckCircle2 size={12} /> Mark Complete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'workspace' && (
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Action Workspace – End-to-End Donor Engagement</span>
            </div>
            <div className="card-body grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actionWorkspaceSteps.map((step, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="font-bold text-sm text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{step.step}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <span className="card-title">Communication Logs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr><th>Date</th><th>Donor</th><th>Type</th><th>Action Taken</th><th>Response</th><th>Rating</th><th>Outcome</th></tr>
              </thead>
              <tbody>
                {[
                  { date: '5 Oct', donor: 'Tata Trust', type: 'Visit', action: 'Annual meeting attended', response: 'Very Positive', rating: '5 ★', outcome: 'Q1 partnership agreed' },
                  { date: '2 Oct', donor: 'Ramesh Gupta', type: 'Call', action: 'Birthday greeting call', response: 'Positive', rating: '4 ★', outcome: 'Pledged ₹50,000' },
                  { date: '28 Sep', donor: 'Infosys Foundation', type: 'Email', action: 'Impact report shared', response: 'Acknowledged', rating: '3 ★', outcome: 'Awaiting Q4 renewal' },
                  { date: '20 Sep', donor: 'Birla Charitable', type: 'Call', action: 'Pledge renewal discussion', response: 'Positive', rating: '4 ★', outcome: 'Will renew Dec' },
                ].map((log, i) => (
                  <tr key={i}>
                    <td className="text-xs">{log.date}</td>
                    <td className="font-semibold text-slate-800">{log.donor}</td>
                    <td><span className={typeStyle[log.type] ?? 'badge badge-gray'}>{log.type}</span></td>
                    <td className="text-xs text-slate-600">{log.action}</td>
                    <td><span className="badge badge-blue">{log.response}</span></td>
                    <td className="font-semibold text-yellow-600">{log.rating}</td>
                    <td className="text-xs text-slate-600 max-w-[150px]">{log.outcome}</td>
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
