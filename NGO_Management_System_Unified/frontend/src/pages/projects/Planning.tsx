import { useState } from 'react';
import { Target, Users, DollarSign, MapPin, BarChart2, Briefcase, ChevronRight } from 'lucide-react';

const planSections = [
  { icon: <Target size={18} />, title: 'Project Overview', color: '#1AACB8', fields: ['Project Name', 'Vision & Mission', 'SDG Goals', 'Project Duration', 'Location/Geography', 'Implementing Team'] },
  { icon: <Users size={18} />, title: 'Beneficiary', color: '#6366F1', fields: ['Primary Beneficiaries', 'Secondary Beneficiaries', 'Estimated Count', 'Selection Criteria', 'Beneficiary Needs'] },
  { icon: <BarChart2 size={18} />, title: 'Expected Impact', color: '#10B981', fields: ['Direct Beneficiary Impact', 'Indirect Beneficiary Impact', 'Societal Impact', 'Long-term Outcomes'] },
  { icon: <MapPin size={18} />, title: 'Stages / Phases', color: '#F59E0B', fields: ['Phase 1 Description', 'Phase 2 Description', 'Phase 3 Description', 'Milestones', 'Timeline'] },
  { icon: <Users size={18} />, title: 'Human Resources', color: '#EC4899', fields: ['Team Lead', 'Staff Assigned', 'Volunteers Required', 'External Consultants', 'Training Needs'] },
  { icon: <Briefcase size={18} />, title: 'Operations', color: '#8B5CF6', fields: ['Venue/Site', 'Equipment Needed', 'Logistics Plan', 'Transportation', 'Total Estimated Hours'] },
  { icon: <DollarSign size={18} />, title: 'Budget', color: '#14B8A6', fields: ['Personnel Costs', 'Material Costs', 'Operational Costs', 'Funding Sources', 'Contingency Reserve'] },
];

const deptAreas = ['Admin & Legal', 'HR', 'Planning & Monitoring', 'Finance', 'Fundraising', 'Operations', 'R&L', 'Innovation & Growth', 'Data & Tech'];

const projects = [
  { name: 'Clean Water Initiative', id: 'PRJ-001' },
  { name: 'Digital Literacy Drive', id: 'PRJ-002' },
  { name: 'Healthcare Outreach', id: 'PRJ-003' },
];

export default function PlanningPage() {
  const [selectedProject, setSelectedProject] = useState('PRJ-001');
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const section = planSections[activeSection];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="page-title">Detailed Project Planning</h1>
        <p className="page-subtitle">Build comprehensive project plans after proposal approval</p>
      </div>

      <div className="card">
        <div className="card-body flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="form-label mb-0">Project:</label>
            <select
              className="form-input w-64"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          </div>
          <span className="badge badge-green">Proposal Approved ✓</span>
        </div>
      </div>

      {/* Progress stepper */}
      <div className="card overflow-x-auto">
        <div className="card-body flex items-center gap-1 min-w-max">
          {planSections.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                i === activeSection
                  ? 'text-white border-transparent'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
              style={i === activeSection ? { background: section.color, borderColor: section.color } : {}}
            >
              {i < activeSection && <span className="text-green-500">✓</span>}
              <span>{i + 1}. {s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active section form */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl text-white" style={{ background: section.color }}>
              {section.icon}
            </div>
            <span className="card-title">{section.title}</span>
          </div>
          <div className="text-xs text-slate-400">Section {activeSection + 1} of {planSections.length}</div>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map(field => (
            <div key={field}>
              <label className="form-label">{field}</label>
              {field.toLowerCase().includes('description') || field.toLowerCase().includes('impact') || field.toLowerCase().includes('outcomes') ? (
                <textarea
                  className="form-input h-20 resize-none"
                  placeholder={`Enter ${field.toLowerCase()}...`}
                  value={formData[field] ?? ''}
                  onChange={e => setFormData(d => ({ ...d, [field]: e.target.value }))}
                />
              ) : (
                <input
                  className="form-input"
                  placeholder={`Enter ${field.toLowerCase()}...`}
                  value={formData[field] ?? ''}
                  onChange={e => setFormData(d => ({ ...d, [field]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            className="btn-secondary"
            onClick={() => setActiveSection(s => Math.max(0, s - 1))}
            disabled={activeSection === 0}
          >
            ← Previous
          </button>
          <button
            className="btn-primary"
            onClick={() => setActiveSection(s => Math.min(planSections.length - 1, s + 1))}
          >
            {activeSection === planSections.length - 1 ? 'Save Plan' : 'Save & Continue →'}
          </button>
        </div>
      </div>

      {/* Department responsibility area */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Department / Responsibility Areas</span>
          <span className="text-xs text-slate-400">{deptAreas.length} Departments</span>
        </div>
        <div className="card-body grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {deptAreas.map((dept, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-3 text-center hover:border-teal-300 hover:bg-teal-50 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ background: '#E6F7F9' }}>
                <Briefcase size={14} style={{ color: '#1AACB8' }} />
              </div>
              <div className="text-xs font-semibold text-slate-700">{dept}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
