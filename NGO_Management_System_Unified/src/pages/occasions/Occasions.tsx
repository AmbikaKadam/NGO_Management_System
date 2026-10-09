import { useState } from 'react';
import { Gift, Bell, Calendar, Star, Plus } from 'lucide-react';

const upcomingOccasions = [
  { name: 'Ramesh Gupta', occasion: 'Birthday', date: '15 Oct 2025', type: 'Individual', daysLeft: 8, lastEngagement: '3 months ago', priority: 'High' },
  { name: 'Tata Trust Anniversary', occasion: 'Corporate Anniversary', date: '18 Oct 2025', type: 'Corporate', daysLeft: 11, lastEngagement: '6 months ago', priority: 'High' },
  { name: 'Sunita Mehra', occasion: 'Birthday', date: '22 Oct 2025', type: 'Individual', daysLeft: 15, lastEngagement: '1 month ago', priority: 'Medium' },
  { name: 'HCL Foundation Day', occasion: 'Foundation Day', date: '1 Nov 2025', type: 'Corporate', daysLeft: 25, lastEngagement: '2 months ago', priority: 'Medium' },
  { name: 'Meena Kapoor', occasion: 'Birthday', date: '5 Nov 2025', type: 'Individual', daysLeft: 29, lastEngagement: '8 months ago', priority: 'High' },
];

const greetingTemplates = [
  { name: 'Birthday – Individual', preview: 'Dear [Name], Wishing you a very happy birthday! On this special day, we at Hope Foundation...' },
  { name: 'Corporate Anniversary', preview: 'Dear [Organisation], As you celebrate this important milestone, we are grateful for your...' },
  { name: 'Festive Greetings (Diwali)', preview: 'Dear [Name], As the festival of lights approaches, we extend our warmest wishes to you...' },
  { name: 'Year-end Thank You', preview: 'Dear [Name], As we approach the end of 2025, we want to take a moment to thank you...' },
  { name: 'New Year Greeting', preview: 'Dear [Name], As we welcome a new year, we are filled with hope and gratitude for supporters like you...' },
];

const priorityStyle: Record<string, string> = {
  High: 'badge badge-red',
  Medium: 'badge badge-yellow',
  Low: 'badge badge-gray',
};

export default function OccasionsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [reminderDays, setReminderDays] = useState(7);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Occasions & Calendar</h1>
          <p className="page-subtitle">Track birthdays, anniversaries, and special occasions for personalized donor engagement</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Add Occasion</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Occasions This Month', value: '12', icon: '🎂', color: '#EC4899' },
          { label: 'Reminders Sent (Oct)', value: '8', icon: '🔔', color: '#1AACB8' },
          { label: 'Greetings Delivered', value: '6', icon: '✉️', color: '#10B981' },
          { label: 'Upcoming (30 days)', value: '5', icon: '📅', color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="text-2xl font-extrabold" style={{ color: s.color, fontFamily: 'Nunito, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reminder config */}
      <div className="card">
        <div className="card-body flex items-center gap-4 flex-wrap">
          <Bell size={18} style={{ color: '#1AACB8' }} />
          <span className="text-sm font-semibold text-slate-700">Reminder window:</span>
          <div className="flex gap-2">
            {[3, 5, 7, 14].map(d => (
              <button key={d}
                onClick={() => setReminderDays(d)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  reminderDays === d ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-200'
                }`}>{d} days before</button>
            ))}
          </div>
          <span className="text-xs text-slate-400 ml-auto">Auto-alerts enabled ✓</span>
        </div>
      </div>

      <div className="tab-bar w-fit">
        {['upcoming', 'templates', 'settings'].map(t => (
          <button key={t} className={`tab-item capitalize ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'upcoming' && (
        <div className="flex flex-col gap-3">
          {upcomingOccasions.map((o, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: '#FCE7F3' }}>
                  <Gift size={22} style={{ color: '#EC4899' }} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{o.name}</div>
                  <div className="text-xs text-slate-500">{o.occasion} · {o.date} · Last contact: {o.lastEngagement}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-lg font-extrabold" style={{ color: '#1AACB8', fontFamily: 'Nunito, sans-serif' }}>{o.daysLeft}</div>
                    <div className="text-[10px] text-slate-400">days left</div>
                  </div>
                  <span className={priorityStyle[o.priority]}>{o.priority}</span>
                  <button className="btn-primary text-xs py-1.5">Send Greeting</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {greetingTemplates.map((t, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Star size={15} style={{ color: '#F59E0B' }} />
                  <span className="font-bold text-slate-800 text-sm">{t.name}</span>
                </div>
                <p className="text-xs text-slate-500 italic leading-relaxed">{t.preview}</p>
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 text-xs py-1.5">Edit Template</button>
                  <button className="btn-primary flex-1 text-xs py-1.5">Use Template</button>
                </div>
              </div>
            </div>
          ))}
          <div className="card border-2 border-dashed border-slate-200 hover:border-teal-300 transition-all cursor-pointer">
            <div className="card-body flex flex-col items-center justify-center gap-2 min-h-[120px] text-slate-400 hover:text-teal-500 transition-colors">
              <Plus size={24} />
              <span className="text-sm font-semibold">Create New Template</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card">
          <div className="card-header"><span className="card-title">Occasion Settings</span></div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Reminder Email Template', 'Default Reminder Days', 'Auto-send on Birthday', 'CC to Department Head', 'Track Engagement After Send'].map(f => (
              <div key={f} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-sm text-slate-700">{f}</span>
                <div className="w-10 h-5 rounded-full bg-teal-400 relative cursor-pointer flex-shrink-0">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
