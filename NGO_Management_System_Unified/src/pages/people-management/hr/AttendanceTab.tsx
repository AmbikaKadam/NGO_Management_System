import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Avatar, DataTable, FilterBar, ProgressBar, SelectField, StatusBadge, ACCENT, type Column } from '../../../components/people';
import { attendanceHistory, type Employee, type LeaveRecord } from './data';

interface Props { employees: Employee[]; leaves: LeaveRecord[]; onLeave: (id: string, s: 'Approved' | 'Rejected') => void }

export default function AttendanceTab({ employees, leaves, onLeave }: Props) {
  const [search, setSearch] = useState(''); const [empId, setEmpId] = useState(employees[0]?.id ?? '');
  const emp = employees.find(e => e.id === empId) ?? employees[0];
  const rows = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const attCols: Column<Employee>[] = [
    { header: 'Employee', render: e => <div className="flex items-center gap-2"><Avatar name={e.name} color={ACCENT.hr} size={30} /><span className="font-semibold text-slate-800">{e.name}</span></div> },
    { header: 'Department', render: e => e.dept },
    { header: 'Attendance', className: 'min-w-[160px]', render: e => <ProgressBar value={e.attendance} color={e.attendance >= 95 ? '#10B981' : e.attendance >= 90 ? '#F59E0B' : '#EF4444'} /> },
    { header: 'Status', render: e => <StatusBadge status={e.status} /> },
  ];
  const leaveCols: Column<LeaveRecord>[] = [
    { header: 'Employee', render: l => <span className="font-semibold text-slate-800">{l.name}</span> },
    { header: 'Type', render: l => l.type },
    { header: 'Period', render: l => `${l.from} – ${l.to} (${l.days}d)` },
    { header: 'Reason', render: l => l.reason },
    { header: 'Status', render: l => <StatusBadge status={l.status} /> },
    { header: 'Actions', render: l => l.status === 'Pending' ? (
      <div className="flex gap-1">
        <button className="p-1.5 rounded bg-teal-50 text-teal-700 hover:bg-teal-100" aria-label={`Approve leave for ${l.name}`} onClick={() => onLeave(l.id, 'Approved')}><Check size={14} /></button>
        <button className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100" aria-label={`Reject leave for ${l.name}`} onClick={() => onLeave(l.id, 'Rejected')}><X size={14} /></button>
      </div>) : <span className="text-xs text-slate-400">—</span> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="card overflow-hidden">
        <div className="card-header"><h2 className="card-title">Attendance</h2></div>
        <div className="p-4"><FilterBar search={search} onSearch={setSearch} placeholder="Search employee…" /></div>
        <DataTable columns={attCols} rows={rows} rowKey={e => e.id} />
      </div>
      <div className="card overflow-hidden">
        <div className="card-header"><h2 className="card-title">Leave Records</h2><span className="text-xs text-slate-400">{leaves.filter(l => l.status === 'Pending').length} pending</span></div>
        <DataTable columns={leaveCols} rows={leaves} rowKey={l => l.id} emptyTitle="No leave requests" />
      </div>
      {emp && <div className="card">
        <div className="card-header"><h2 className="card-title">Attendance History</h2><div className="w-52"><SelectField label="Choose employee" hideLabel value={emp.id} onChange={setEmpId} options={employees.map(e => e.id)} /></div></div>
        <div className="card-body">
          <p className="text-xs text-slate-500 mb-2">{emp.name} · last 6 months</p>
          <div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={attendanceHistory(emp)}><CartesianGrid strokeDasharray="3 3" stroke="#E8EEF4" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="percent" name="Attendance %" fill="#1AACB8" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </div>
      </div>}
    </div>
  );
}
