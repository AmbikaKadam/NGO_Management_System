import { useState } from 'react';
import { Star } from 'lucide-react';
import { DataTable, ProgressBar, SelectField, TextAreaField, ACCENT, EmptyState, type Column } from '../../../components/people';
import type { Intern } from './data';

export default function FeedbackTab({ interns, onFeedback }: { interns: Intern[]; onFeedback: (id: string, text: string) => void }) {
  const [id, setId] = useState(interns[0]?.id ?? ''); const [text, setText] = useState('');
  const sel = interns.find(i => i.id === id);
  const cols: Column<Intern>[] = [
    { header: 'Intern', render: i => <span className="font-semibold text-slate-800">{i.name}</span> },
    { header: 'Attendance', className: 'min-w-[150px]', render: i => <ProgressBar value={i.attendance} color={i.attendance >= 90 ? '#10B981' : '#F59E0B'} /> },
    { header: 'Progress', className: 'min-w-[150px]', render: i => <ProgressBar value={i.progress} color={ACCENT.intern} /> },
    { header: 'Performance', render: i => <span className="inline-flex items-center gap-1 font-semibold"><Star size={13} fill="#F59E0B" className="text-amber-500" />{i.rating.toFixed(1)}</span> },
  ];
  const submit = () => { if (!text.trim() || !sel) return; onFeedback(sel.id, text.trim()); setText(''); };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="card overflow-hidden xl:col-span-2"><div className="card-header"><h2 className="card-title">Attendance, Progress & Performance</h2></div><DataTable columns={cols} rows={interns} rowKey={i => i.id} /></div>
      <div className="card"><div className="card-header"><h2 className="card-title">Mentor Feedback</h2></div>
        <form className="card-body flex flex-col gap-3" onSubmit={e => { e.preventDefault(); submit(); }}>
          <SelectField label="Intern" value={id} onChange={setId} options={interns.map(i => i.id)} />
          <TextAreaField label="Add feedback" value={text} onChange={setText} />
          <button className="btn-primary w-fit" type="submit">Save feedback</button>
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-500">{sel?.name}</div>
            {sel && sel.feedback.length ? sel.feedback.map((f, i) => <div key={i} className="p-2.5 rounded-lg bg-slate-50 text-sm text-slate-700">{f.text}<div className="text-[11px] text-slate-400 mt-1">{f.date}</div></div>) : <EmptyState title="No feedback yet" />}
          </div>
        </form></div>
    </div>
  );
}
