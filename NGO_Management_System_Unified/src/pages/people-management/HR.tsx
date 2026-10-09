import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, PageTabs, ACCENT } from '../../components/people';
import usePersistentState from '../../hooks/usePersistentState';
import DashboardTab from './hr/DashboardTab';
import DepartmentsTab from './hr/DepartmentsTab';
import EmployeesTab from './hr/EmployeesTab';
import RequirementsTab from './hr/RequirementsTab';
import AttendanceTab from './hr/AttendanceTab';
import PerformanceTab from './hr/PerformanceTab';
import ReportsTab from './hr/ReportsTab';
import { initialEmployees, initialLeaves, initialRequirements, type Employee, type LeaveRecord, type Requirement } from './hr/data';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' }, { id: 'departments', label: 'Departments' }, { id: 'employees', label: 'Employees' },
  { id: 'requirements', label: 'Requirements' }, { id: 'attendance', label: 'Attendance & Leave' }, { id: 'performance', label: 'Performance' }, { id: 'reports', label: 'Reports' },
];

export default function HRPage() {
  const [tab, setTab] = useState('dashboard');
  const [employees, setEmployees] = usePersistentState<Employee[]>('people.hr.employees', initialEmployees);
  const [requirements, setRequirements] = usePersistentState<Requirement[]>('people.hr.requirements', initialRequirements);
  const [leaves, setLeaves] = usePersistentState<LeaveRecord[]>('people.hr.leaves', initialLeaves);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="HR Management" subtitle="Manage employees, departments, requirements, attendance, and performance"
        action={<button className="btn-primary" onClick={() => { setTab('employees'); setAddOpen(true); }}><Plus size={16} /> Add Employee</button>} />
      <PageTabs tabs={TABS} active={tab} onChange={setTab} accent={ACCENT.hr} />
      {tab === 'dashboard' && <DashboardTab employees={employees} requirements={requirements} />}
      {tab === 'departments' && <DepartmentsTab employees={employees} requirements={requirements} />}
      {tab === 'employees' && <EmployeesTab employees={employees} leaves={leaves} onAdd={e => setEmployees(p => [e, ...p])} addOpen={addOpen} setAddOpen={setAddOpen} />}
      {tab === 'requirements' && <RequirementsTab requirements={requirements} onAdd={r => setRequirements(p => [r, ...p])} onStatus={(id, s) => setRequirements(p => p.map(r => r.id === id ? { ...r, status: s } : r))} />}
      {tab === 'attendance' && <AttendanceTab employees={employees} leaves={leaves} onLeave={(id, s) => setLeaves(p => p.map(l => l.id === id ? { ...l, status: s } : l))} />}
      {tab === 'performance' && <PerformanceTab employees={employees} />}
      {tab === 'reports' && <ReportsTab employees={employees} requirements={requirements} />}
    </div>
  );
}
