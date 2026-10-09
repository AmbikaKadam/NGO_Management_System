import { ShieldCheck } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import type { Role } from '../../types/project';

/** Prototype-only role switcher; replace with real auth. Viewer hides all edit controls. */
export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-slate-500" title="Prototype role switcher">
      <ShieldCheck size={14} /><span className="sr-only sm:not-sr-only">Role</span>
      <select value={role} onChange={e => setRole(e.target.value as Role)} className="form-input !py-1.5 !w-auto !text-xs" aria-label="Switch role (prototype)">
        <option>Admin</option><option>Project Manager</option><option>Viewer</option>
      </select>
    </label>
  );
}
