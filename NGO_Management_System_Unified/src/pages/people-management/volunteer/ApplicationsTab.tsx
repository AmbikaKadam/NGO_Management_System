import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { DataTable, StatusBadge, type Column } from '../../../components/people';
import { APP_STATUSES, type AppStatus, type VApplication } from './data';

export default function ApplicationsTab({ applications, onSet }: { applications: VApplication[]; onSet: (id: string, s: AppStatus) => void }) {
  const [pill, setPill] = useState<AppStatus>('New');
  const rows = applications.filter(a => a.status === pill);
  const cols: Column<VApplication>[] = [
    { header: 'Applicant', render: a => <div><div className="font-semibold text-slate-800">{a.name}</div><div className="text-[11px] text-slate-400">{a.email}</div></div> },
    { header: 'Skills', render: a => <div className="flex flex-wrap gap-1">{a.skills.map(s => <span key={s} className="badge badge-gray">{s}</span>)}</div> },
    { header: 'Motivation', render: a => <span className="text-xs text-slate-500">{a.motivation}</span> },
    { header: 'Applied', render: a => <span className="text-xs">{a.appliedOn}</span> },
    { header: 'Actions', render: a => (
      <div className="flex gap-1 items-center">
        {a.status === 'New' && <button className="btn-secondary !py-1 !px-2.5 !text-xs" onClick={() => onSet(a.id, 'Under Review')}>Start review</button>}
        {(a.status === 'New' || a.status === 'Under Review') && <>
          <button className="p-1.5 rounded bg-teal-50 text-teal-700 hover:bg-teal-100" aria-label={`Approve ${a.name}`} onClick={() => onSet(a.id, 'Approved')}><Check size={14} /></button>
          <button className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100" aria-label={`Reject ${a.name}`} onClick={() => onSet(a.id, 'Rejected')}><X size={14} /></button></>}
        {(a.status === 'Approved' || a.status === 'Rejected') && <StatusBadge status={a.status} />}
      </div>) },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Application status">
        {APP_STATUSES.map(s => (
          <button key={s} role="tab" aria-selected={pill === s} onClick={() => setPill(s)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${pill === s ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
            {s} <span className="ml-1 text-xs opacity-70">{applications.filter(a => a.status === s).length}</span></button>))}
      </div>
      <div className="card overflow-hidden"><DataTable columns={cols} rows={rows} rowKey={a => a.id} emptyTitle={`No ${pill.toLowerCase()} applications`} emptyHint="Applications moved here will appear in this list." /></div>
    </div>
  );
}
