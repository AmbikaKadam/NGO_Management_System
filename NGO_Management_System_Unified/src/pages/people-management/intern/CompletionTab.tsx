import { useState } from 'react';
import { Award } from 'lucide-react';
import { DataTable, SelectField, StatusBadge, TextAreaField, ACCENT, type Column } from '../../../components/people';
import type { Intern } from './data';

interface Props { interns: Intern[]; onFinal: (id: string, text: string) => void; onCert: (id: string) => void }

export default function CompletionTab({ interns, onFinal, onCert }: Props) {
  const [id, setId] = useState(interns.find(i => i.status === 'Completed')?.id ?? interns[0]?.id ?? '');
  const sel = interns.find(i => i.id === id);
  const [draft, setDraft] = useState(sel?.finalFeedback ?? '');
  const pick = (v: string) => { setId(v); setDraft(interns.find(i => i.id === v)?.finalFeedback ?? ''); };
  const cols: Column<Intern>[] = [
    { header: 'Intern', render: i => <span className="font-semibold text-slate-800">{i.name}</span> },
    { header: 'Completion', render: i => <StatusBadge status={i.status} /> },
    { header: 'Final feedback', render: i => i.finalFeedback ? 'Recorded' : <span className="text-slate-400">Pending</span> },
    { header: 'Certificate', render: i => <StatusBadge status={i.certificate} /> },
  ];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <div className="card overflow-hidden"><div className="card-header"><h2 className="card-title">Completion Status</h2></div><DataTable columns={cols} rows={interns} rowKey={i => i.id} onRowClick={i => pick(i.id)} /></div>
      {sel && <div className="flex flex-col gap-5">
        <div className="card"><div className="card-header"><h2 className="card-title">Final Feedback</h2></div>
          <form className="card-body flex flex-col gap-3" onSubmit={e => { e.preventDefault(); onFinal(sel.id, draft.trim()); }}>
            <SelectField label="Intern" value={id} onChange={pick} options={interns.map(i => i.id)} />
            <TextAreaField label={`Final feedback for ${sel.name}`} value={draft} onChange={setDraft} />
            <button className="btn-secondary w-fit" type="submit">Save feedback</button>
          </form></div>
        <div className="card"><div className="card-header"><h2 className="card-title">Certificate</h2><StatusBadge status={sel.certificate} /></div>
          <div className="card-body flex flex-col gap-4">
            <div data-certificate className="rounded-[14px] p-6 text-center bg-white" style={{ border: `3px double ${ACCENT.intern}` }} aria-label="Certificate preview">
              <Award size={28} className="mx-auto" style={{ color: ACCENT.intern }} />
              <div className="text-[11px] tracking-widest uppercase text-slate-400 mt-2">Hope Foundation</div>
              <div className="text-lg font-extrabold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Certificate of Internship</div>
              <p className="text-xs text-slate-500 mt-2">This is to certify that</p>
              <div className="text-xl font-extrabold text-primary-dark my-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{sel.name}</div>
              <p className="text-xs text-slate-500">completed an internship in {sel.dept} from {sel.start} to {sel.end}.</p>
              {sel.certificate === 'Pending' && <div className="text-[11px] text-amber-600 mt-3 font-semibold">DRAFT PREVIEW</div>}
            </div>
            <button className="btn-primary w-fit disabled:opacity-50" disabled={sel.status !== 'Completed'} onClick={() => { onCert(sel.id); window.print(); }}>
              {sel.certificate === 'Generated' ? 'Print / save certificate' : 'Generate & print certificate'}</button>
            {sel.status !== 'Completed' && <p className="text-xs text-slate-500">Available once the internship is completed.</p>}
          </div></div>
      </div>}
    </div>
  );
}
