import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, Info } from 'lucide-react';
import logoUrl from '../assets/hope-logo.jpeg';

// Frontend-only demo sign-in screen. No credentials are checked anywhere:
// after basic form validation the user is simply taken to the dashboard.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (e = email, p = password) => {
    const next: { email?: string; password?: string } = {};
    if (!e.trim()) next.email = 'Email address is required.';
    else if (!EMAIL_RE.test(e.trim())) next.email = 'Enter a valid email address.';
    if (!p) next.password = 'Password is required.';
    return next;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: '#F0F5F8' }}>
      {/* Brand panel */}
      <div className="flex flex-col justify-between px-8 py-8 lg:w-[44%] lg:min-h-screen lg:px-14 lg:py-12 text-white" style={{ background: '#0C2337' }}>
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Hope Foundation" className="w-11 h-11 rounded-lg object-cover" />
          <div>
            <div className="font-bold text-lg leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>HOPE</div>
            <div className="text-[11px] font-semibold tracking-wider" style={{ color: '#1AACB8' }}>Foundation</div>
          </div>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-4xl font-extrabold leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
            NGO Management System
          </h1>
          <p className="mt-4 text-base text-slate-300 max-w-md">
            Projects, events, beneficiaries, donors, people and occasions — managed together in one place.
          </p>
        </div>
        <p className="hidden lg:block text-xs text-slate-400">© Hope Foundation</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="card w-full max-w-md">
          <div className="card-body" style={{ padding: '32px' }}>
            <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>Sign in</h2>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>Welcome back. Sign in to continue to the NGO Management System.</p>

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor="login-email" className="form-label">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email" type="email" autoComplete="email" className="form-input" style={{ paddingLeft: 36 }}
                    placeholder="you@organisation.org" value={email}
                    onChange={ev => { setEmail(ev.target.value); if (errors.email) setErrors(p => ({ ...p, email: validate(ev.target.value, password).email })); }}
                    aria-invalid={!!errors.email} aria-describedby={errors.email ? 'login-email-err' : undefined}
                  />
                </div>
                {errors.email && <p id="login-email-err" role="alert" className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="login-password" className="form-label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password" type={show ? 'text' : 'password'} autoComplete="current-password" className="form-input"
                    style={{ paddingLeft: 36, paddingRight: 40 }} placeholder="Enter your password" value={password}
                    onChange={ev => { setPassword(ev.target.value); if (errors.password) setErrors(p => ({ ...p, password: validate(email, ev.target.value).password })); }}
                    aria-invalid={!!errors.password} aria-describedby={errors.password ? 'login-password-err' : undefined}
                  />
                  <button type="button" onClick={() => setShow(s => !s)}
                    aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-500 hover:bg-slate-100">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p id="login-password-err" role="alert" className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.password}</p>}
              </div>

              <button type="submit" className="btn-primary w-full justify-center" style={{ padding: '11px 18px', fontSize: 14.5 }}>
                <LogIn size={16} /> Sign In
              </button>
            </form>

            <div className="mt-5 flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs" style={{ background: '#E6F7F9', color: '#0D8A95' }}>
              <Info size={14} className="mt-0.5 flex-shrink-0" />
              <span>Demo mode: this is a frontend-only preview. No credentials are verified and no account is created.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
