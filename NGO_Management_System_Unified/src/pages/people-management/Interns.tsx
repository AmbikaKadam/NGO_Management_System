import { useState } from 'react';
import { PageHeader, PageTabs, ACCENT } from '../../components/people';
import usePersistentState from '../../hooks/usePersistentState';
import DashboardTab from './intern/DashboardTab';
import ApplicationsTab from './intern/ApplicationsTab';
import InternListTab from './intern/InternListTab';
import WorkTab from './intern/WorkTab';
import FeedbackTab from './intern/FeedbackTab';
import CompletionTab from './intern/CompletionTab';
import ReportsTab from './intern/ReportsTab';
import { initialApplicants, initialInterns, initialTasks, type Applicant, type Intern, type Stage, type Task, type TaskStatus } from './intern/data';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' }, { id: 'applications', label: 'Applications' }, { id: 'list', label: 'Intern List' },
  { id: 'work', label: 'Internship Work' }, { id: 'feedback', label: 'Attendance & Feedback' }, { id: 'completion', label: 'Completion & Certificate' }, { id: 'reports', label: 'Reports' },
];
const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function InternsPage() {
  const [tab, setTab] = useState('dashboard');
  const [applicants, setApplicants] = usePersistentState<Applicant[]>('people.interns.applicants', initialApplicants);
  const [interns, setInterns] = usePersistentState<Intern[]>('people.interns.interns', initialInterns);
  const [tasks, setTasks] = usePersistentState<Task[]>('people.interns.tasks', initialTasks);

  const moveApplicant = (id: string, stage: Stage) => {
    const a = applicants.find(x => x.id === id); if (!a || a.stage === stage) return;
    setApplicants(p => p.map(x => x.id === id ? { ...x, stage, history: [...x.history, { date: today(), event: `Moved to ${stage}` }] } : x));
    if (stage === 'Selected' && !interns.some(i => i.email === a.email)) {
      setInterns(p => [...p, { id: `INT-${String(p.length + 1).padStart(3, '0')}`, name: a.name, email: a.email, dept: a.dept, mentor: 'To be assigned', start: 'TBD', end: 'TBD', status: 'Active', project: 'Onboarding', progress: 0, attendance: 100, rating: 0, feedback: [], finalFeedback: '', certificate: 'Pending', college: a.college }]);
    }
  };
  const patch = (id: string, p: Partial<Intern>) => setInterns(prev => prev.map(i => i.id === id ? { ...i, ...p } : i));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Intern Management" subtitle="Applications, interns, internship work, feedback and certificates" />
      <PageTabs tabs={TABS} active={tab} onChange={setTab} accent={ACCENT.intern} />
      {tab === 'dashboard' && <DashboardTab applicants={applicants} interns={interns} />}
      {tab === 'applications' && <ApplicationsTab applicants={applicants} onMove={moveApplicant} />}
      {tab === 'list' && <InternListTab interns={interns} />}
      {tab === 'work' && <WorkTab interns={interns} tasks={tasks} onTask={(id: string, s: TaskStatus) => setTasks(p => p.map(t => t.id === id ? { ...t, status: s } : t))} />}
      {tab === 'feedback' && <FeedbackTab interns={interns} onFeedback={(id, text) => setInterns(p => p.map(i => i.id === id ? { ...i, feedback: [{ date: today(), text }, ...i.feedback] } : i))} />}
      {tab === 'completion' && <CompletionTab interns={interns} onFinal={(id, t) => patch(id, { finalFeedback: t })} onCert={id => patch(id, { certificate: 'Generated' })} />}
      {tab === 'reports' && <ReportsTab applicants={applicants} interns={interns} />}
    </div>
  );
}
