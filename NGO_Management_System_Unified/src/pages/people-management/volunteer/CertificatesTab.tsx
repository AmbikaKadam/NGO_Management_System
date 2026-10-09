import { useState } from 'react';
import { Award, Medal } from 'lucide-react';
import { DataTable, SelectField, StatusBadge, TextField, ACCENT, type Column } from '../../../components/people';
import type { Recognition, Volunteer } from './data';

interface Props { volunteers: Volunteer[]; items: Recognition[]; onAdd: (kind: Recognition['kind'], volunteerId: string, title: string) => void }

export default function CertificatesTab({ volunteers, items, onAdd }: Props) {
  const [id, setId] = useState(volunteers[0]?.id ?? ''); const [title, setTitle] = useState(''); const [kind, setKind] = useState<Recognition['kind']>('Certificate');
  const name = (v: string) => volunteers.find(x => x.id === v)?.name ?? v;
  const sel = volunteers.find(v => v.id === id);
  const cols: Column<Recognition>[] = [
    { header: 'Volunteer', render: r => <span className="font-semibold text-slate-800">{name(r.volunteerId)}</span> }, { header: 'Title', render: r => r.title },
    { header: 'Type', render: r => <StatusBadge status={r.kind === 'Certificate' ? 'Issued' : 'Awarded'} /> }, { header: 'Kind', render: r => r.kind }, { header: 'Date', render: r => <span className="text-xs">{r.date}</span> },
  ];
  const sub = (k: Recognition['kind'][]) => items.filter(i => k.includes(i.kind));
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <form className="card" onSubmit={e => { e.preventDefault(); onAdd(kind, id, title.trim() || (kind === 'Certificate' ? 'Certificate of Appreciation' : 'Recognition')); setTitle(''); window.print(); }}>
          <div className="card-header"><h2 className="card-title">Generate Certificate / Recognition</h2></div>
          <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField label="Volunteer" value={id} onChange={setId} options={volunteers.map(v => v.id)} />
            <SelectField label="Type" value={kind} onChange={v => setKind(v as Recognition['kind'])} options={['Certificate', 'Award', 'Recognition']} />
            <TextField label="Title" value={title} onChange={setTitle} wide placeholder="e.g. 100 Hours Milestone" />
            <button className="btn-primary w-fit" type="submit">Generate & print</button></div></form>
        <div className="card"><div className="card-header"><h2 className="card-title">Preview</h2></div>
          <div className="card-body"><div data-certificate className="rounded-[14px] p-6 text-center" style={{ border: `3px double ${ACCENT.volunteer}` }} aria-label="Certificate preview">
            <Award size={26} className="mx-auto" style={{ color: ACCENT.volunteer }} />
            <div className="text-[11px] tracking-widest uppercase text-slate-400 mt-2">Hope Foundation</div>
            <div className="text-lg font-extrabold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{title.trim() || `${kind} of Appreciation`}</div>
            <div className="text-xl font-extrabold text-primary-dark my-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{sel?.name}</div>
            <p className="text-xs text-slate-500">in recognition of {sel?.hours} hours of dedicated service.</p></div></div></div>
      </div>
      <div className="card overflow-hidden"><div className="card-header"><h2 className="card-title">Certificate History</h2></div><DataTable columns={cols} rows={sub(['Certificate'])} rowKey={r => r.id} emptyTitle="No certificates yet" /></div>
      <div className="card overflow-hidden"><div className="card-header"><h2 className="card-title flex items-center gap-2"><Medal size={16} /> Awards & Recognition</h2></div><DataTable columns={cols} rows={sub(['Award', 'Recognition'])} rowKey={r => r.id} emptyTitle="No awards yet" /></div>
    </div>
  );
}
