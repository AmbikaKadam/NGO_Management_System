import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '../types/project';

interface RoleCtx { role: Role; setRole: (r: Role) => void; canEdit: boolean; isAdmin: boolean }
const Ctx = createContext<RoleCtx | null>(null);
const KEY = 'ngo.role';

/** Placeholder for real auth: backend will supply the role from the session/JWT. */
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    try { const v = localStorage.getItem(KEY); if (v === 'Admin' || v === 'Project Manager' || v === 'Viewer') return v; } catch { /* ignore */ }
    return 'Admin';
  });
  const value = useMemo<RoleCtx>(() => ({
    role, canEdit: role !== 'Viewer', isAdmin: role === 'Admin',
    setRole: (r: Role) => { setRoleState(r); try { localStorage.setItem(KEY, r); } catch { /* ignore */ } },
  }), [role]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useRole(): RoleCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useRole must be used inside <RoleProvider>');
  return c;
}
