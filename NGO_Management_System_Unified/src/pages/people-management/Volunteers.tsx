import { useState } from 'react';
import { PageHeader, PageTabs, ACCENT } from '../../components/people';
import usePersistentState from '../../hooks/usePersistentState';
import DashboardTab from './volunteer/DashboardTab';
import ApplicationsTab from './volunteer/ApplicationsTab';
import ListTab from './volunteer/ListTab';
import AssignmentsTab from './volunteer/AssignmentsTab';
import SkillsTab from './volunteer/SkillsTab';
import AttendanceTab from './volunteer/AttendanceTab';
import PerformanceTab from './volunteer/PerformanceTab';
import CertificatesTab from './volunteer/CertificatesTab';
import ReportsTab from './volunteer/ReportsTab';
import { initialApplications, initialAssignments, initialAttendance, initialRecognitions, initialVolunteers, today, type AppStatus, type Assignment, type AttendanceRec, type Recognition, type VApplication, type Volunteer } from './volunteer/data';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' }, { id: 'applications', label: 'Applications' }, { id: 'list', label: 'Volunteer List' }, { id: 'assignments', label: 'Assignments' },
  { id: 'skills', label: 'Skills & Availability' }, { id: 'attendance', label: 'Attendance' }, { id: 'performance', label: 'Performance & Feedback' }, { id: 'certificates', label: 'Certificates & Recognition' }, { id: 'reports', label: 'Reports' },
];

export default function VolunteersPage() {
  const [tab, setTab] = useState('dashboard');
  const [volunteers, setVolunteers] = usePersistentState<Volunteer[]>('people.volunteers.volunteers', initialVolunteers);
  const [applications, setApplications] = usePersistentState<VApplication[]>('people.volunteers.applications', initialApplications);
  const [assignments, setAssignments] = usePersistentState<Assignment[]>('people.volunteers.assignments', initialAssignments);
  const [records, setRecords] = usePersistentState<AttendanceRec[]>('people.volunteers.attendance', initialAttendance);
  const [recognitions, setRecognitions] = usePersistentState<Recognition[]>('people.volunteers.recognitions', initialRecognitions);

  const setApp = (id: string, status: AppStatus) => {
    const a = applications.find(x => x.id === id); if (!a) return;
    setApplications(p => p.map(x => x.id === id ? { ...x, status } : x));
    if (status === 'Approved' && !volunteers.some(v => v.email === a.email)) {
      setVolunteers(p => [...p, { id: `VOL-${String(p.length + 1).padStart(3, '0')}`, name: a.name, email: a.email, phone: '', city: 'Pune', age: 0, status: 'Active', joined: today(), skills: a.skills, availability: [], hours: 0, tasksDone: 0, tasksTotal: 1, rating: 0, feedback: [], history: [{ date: today(), event: 'Application approved' }] }]);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Volunteer Management" subtitle="Applications, assignments, availability, attendance and recognition" />
      <PageTabs tabs={TABS} active={tab} onChange={setTab} accent={ACCENT.volunteer} />
      {tab === 'dashboard' && <DashboardTab volunteers={volunteers} applications={applications} assignments={assignments} />}
      {tab === 'applications' && <ApplicationsTab applications={applications} onSet={setApp} />}
      {tab === 'list' && <ListTab volunteers={volunteers} />}
      {tab === 'assignments' && <AssignmentsTab volunteers={volunteers} assignments={assignments} onAdd={a => setAssignments(p => [a, ...p])} onStatus={(id, s) => setAssignments(p => p.map(a => a.id === id ? { ...a, status: s } : a))} />}
      {tab === 'skills' && <SkillsTab volunteers={volunteers} onToggle={(id, k) => setVolunteers(p => p.map(v => v.id === id ? { ...v, availability: v.availability.includes(k) ? v.availability.filter(x => x !== k) : [...v.availability, k] } : v))} />}
      {tab === 'attendance' && <AttendanceTab volunteers={volunteers} records={records} onMark={r => { setRecords(p => [r, ...p]); setVolunteers(p => p.map(v => v.id === r.volunteerId ? { ...v, hours: v.hours + r.hours } : v)); }} />}
      {tab === 'performance' && <PerformanceTab volunteers={volunteers} onFeedback={(id, text) => setVolunteers(p => p.map(v => v.id === id ? { ...v, feedback: [{ date: today(), text }, ...v.feedback] } : v))} />}
      {tab === 'certificates' && <CertificatesTab volunteers={volunteers} items={recognitions} onAdd={(kind, volunteerId, title) => setRecognitions(p => [{ id: `RC-${String(p.length + 1).padStart(3, '0')}`, volunteerId, title, kind, date: today() }, ...p])} />}
      {tab === 'reports' && <ReportsTab volunteers={volunteers} assignments={assignments} records={records} />}
    </div>
  );
}
