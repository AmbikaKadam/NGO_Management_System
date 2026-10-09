import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  FolderKanban,
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Star,
  Zap,
} from "lucide-react"

const donationTrend = [
  { month: "Apr", amount: 285000 },
  { month: "May", amount: 312000 },
  { month: "Jun", amount: 298000 },
  { month: "Jul", amount: 341000 },
  { month: "Aug", amount: 375000 },
  { month: "Sep", amount: 420000 },
  { month: "Oct", amount: 398000 },
]

const projectStatus = [
  { name: "Active", value: 12, color: "#1AACB8" },
  { name: "Planning", value: 5, color: "#6366F1" },
  { name: "Completed", value: 18, color: "#10B981" },
  { name: "On Hold", value: 3, color: "#F59E0B" },
]

const volunteerActivity = [
  { dept: "HR", hours: 120 },
  { dept: "Finance", hours: 85 },
  { dept: "Operations", hours: 200 },
  { dept: "Marketing", hours: 95 },
  { dept: "Research", hours: 140 },
  { dept: "Data & Tech", hours: 175 },
]

const recentProjects = [
  {
    name: "Clean Water Initiative",
    status: "Active",
    lead: "Priya Sharma",
    budget: "₹8,50,000",
    progress: 68,
    deadline: "31 Dec 2025",
  },
  {
    name: "Digital Literacy Drive",
    status: "Active",
    lead: "Rahul Mehta",
    budget: "₹3,20,000",
    progress: 45,
    deadline: "15 Feb 2026",
  },
  {
    name: "Healthcare Outreach",
    status: "Planning",
    lead: "Anita Patel",
    budget: "₹5,60,000",
    progress: 12,
    deadline: "1 Apr 2026",
  },
  {
    name: "School Renovation",
    status: "Completed",
    lead: "Vikram Singh",
    budget: "₹2,10,000",
    progress: 100,
    deadline: "10 Oct 2025",
  },
  {
    name: "Women Empowerment",
    status: "Active",
    lead: "Sunita Roy",
    budget: "₹4,75,000",
    progress: 55,
    deadline: "28 Feb 2026",
  },
]

const upcomingEvents = [
  {
    title: "Annual Donors Gala",
    date: "15 Nov 2025",
    location: "Mumbai",
    type: "Fundraiser",
  },
  {
    title: "Volunteer Orientation",
    date: "22 Oct 2025",
    location: "Delhi",
    type: "Training",
  },
  {
    title: "Board Review Meeting",
    date: "5 Nov 2025",
    location: "Online",
    type: "Meeting",
  },
  {
    title: "Health Camp – Dharavi",
    date: "28 Oct 2025",
    location: "Mumbai",
    type: "Outreach",
  },
]

const pendingTasks = [
  { task: "Review Q3 financial report", priority: "High", due: "Today" },
  {
    task: "Approve 3 new volunteer applications",
    priority: "Medium",
    due: "Tomorrow",
  },
  {
    task: "Submit CSR proposal to Tata Trust",
    priority: "High",
    due: "25 Oct",
  },
  {
    task: "Update beneficiary records – Pune batch",
    priority: "Low",
    due: "30 Oct",
  },
  {
    task: "Send thank-you letters to October donors",
    priority: "Medium",
    due: "28 Oct",
  },
]

function StatCard({
  icon,
  label,
  value,
  sub,
  up,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  up?: boolean
}) {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl" style={{ background: "#E6F7F9" }}>
          {icon}
        </div>
        {up !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}
          >
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {sub}
          </div>
        )}
      </div>
      <div>
        <div
          className="text-2xl font-extrabold text-slate-800"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {value}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      </div>
    </div>
  )
}

const statusClass: Record<string, string> = {
  Active: "badge badge-teal",
  Planning: "badge badge-blue",
  Completed: "badge badge-green",
  "On Hold": "badge badge-yellow",
}

const priorityClass: Record<string, string> = {
  High: "badge badge-red",
  Medium: "badge badge-yellow",
  Low: "badge badge-gray",
}

const eventTypeClass: Record<string, string> = {
  Fundraiser: "badge badge-teal",
  Training: "badge badge-blue",
  Meeting: "badge badge-gray",
  Outreach: "badge badge-green",
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showQuickActions, setShowQuickActions] = useState(false)
  const navigate = useNavigate()
  const todayLabel = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-5">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Welcome back, Admin 👋</h1>
          <p className="page-subtitle">
            Here's what's happening at Hope Foundation today — {todayLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-secondary text-sm"
            onClick={() => navigate("/events/calendar")}
          >
            <Calendar size={15} /> View Calendar
          </button>
          <button
            className="btn-primary text-sm"
            onClick={() => setShowQuickActions((open) => !open)}
            aria-expanded={showQuickActions}
          >
            <Zap size={15} /> Quick Action
          </button>
        </div>
      </div>
      {showQuickActions && (
        <div className="card">
          <div className="card-body flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 mr-2">
              Create:
            </span>
            {[
              ["Project", "/projects/create"],
              ["Event", "/events"],
              ["Beneficiary", "/beneficiaries"],
              ["Donor", "/donor-management/admin/directory"],
            ].map(([label, path]) => (
              <button
                key={path}
                type="button"
                className="btn-secondary text-sm"
                onClick={() => navigate(path)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div
        className="tab-bar w-fit"
        role="tablist"
        aria-label="Dashboard sections"
      >
        {(["overview", "projects", "donors", "people"] as const).map((tab) => (
          <button
            key={tab}
            id={`dashboard-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls="dashboard-tab-panel"
            className={`tab-item capitalize ${
              activeTab === tab ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section
        id="dashboard-tab-panel"
        role="tabpanel"
        aria-labelledby={`dashboard-tab-${activeTab}`}
        className="flex flex-col gap-5"
      >
        {activeTab === "overview" ? (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<FolderKanban size={20} style={{ color: "#1AACB8" }} />}
                label="Active Projects"
                value="38"
                sub="+3 this month"
                up={true}
              />
              <StatCard
                icon={<Users size={20} style={{ color: "#1AACB8" }} />}
                label="Total Volunteers"
                value="1,284"
                sub="+52 this month"
                up={true}
              />
              <StatCard
                icon={<Heart size={20} style={{ color: "#1AACB8" }} />}
                label="Beneficiaries Served"
                value="24,670"
                sub="+1,210 this quarter"
                up={true}
              />
              <StatCard
                icon={<DollarSign size={20} style={{ color: "#1AACB8" }} />}
                label="Funds Raised (Oct)"
                value="₹39.8L"
                sub="-5% vs Sep"
                up={false}
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Donation trend */}
              <div className="card lg:col-span-2">
                <div className="card-header">
                  <span className="card-title">Donation Trend</span>
                  <span className="badge badge-teal text-xs">
                    Last 7 Months
                  </span>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={donationTrend}>
                      <defs>
                        <linearGradient
                          id="tealGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1AACB8"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#1AACB8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        formatter={(v: any) => [
                          `₹${(Number(v) / 1000).toFixed(0)}k`,
                          "Donations",
                        ]}
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid #E2E8F0",
                          fontSize: 12,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#1AACB8"
                        strokeWidth={2.5}
                        fill="url(#tealGrad)"
                        dot={{ fill: "#1AACB8", r: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Project status pie */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Project Status</span>
                </div>
                <div className="card-body flex flex-col items-center gap-3">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={projectStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {projectStatus.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: 8, fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    {projectStatus.map((s) => (
                      <div key={s.name} className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: s.color }}
                        />
                        <span className="text-slate-500">{s.name}</span>
                        <span className="font-bold text-slate-700 ml-auto">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Volunteer activity + pending tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Volunteer hours by dept */}
              <div className="card lg:col-span-2">
                <div className="card-header">
                  <span className="card-title">
                    Volunteer Hours by Department
                  </span>
                  <span className="text-xs text-slate-400">This Month</span>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={volunteerActivity} barSize={28}>
                      <XAxis
                        dataKey="dept"
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, fontSize: 12 }}
                      />
                      <Bar
                        dataKey="hours"
                        fill="#1AACB8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pending actions */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Pending Actions</span>
                  <span className="badge badge-red text-xs">
                    {pendingTasks.length} tasks
                  </span>
                </div>
                <div className="flex flex-col divide-y divide-slate-100">
                  {pendingTasks.map((t, i) => (
                    <div key={i} className="px-5 py-3 flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm text-slate-700 leading-snug">
                          {t.task}
                        </span>
                        <span className={priorityClass[t.priority]}>
                          {t.priority}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Due: {t.due}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent projects + upcoming events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Projects table */}
              <div className="card lg:col-span-2 overflow-hidden">
                <div className="card-header">
                  <span className="card-title">Recent Projects</span>
                  <button
                    type="button"
                    onClick={() => navigate("/projects")}
                    className="text-xs font-semibold"
                    style={{ color: "#1AACB8" }}
                  >
                    View All →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Lead</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProjects.map((p, i) => (
                        <tr key={i}>
                          <td className="font-semibold text-slate-800">
                            {p.name}
                          </td>
                          <td>{p.lead}</td>
                          <td>
                            <span className={statusClass[p.status]}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${p.progress}%`,
                                    background:
                                      p.progress === 100
                                        ? "#10B981"
                                        : "#1AACB8",
                                  }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">
                                {p.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="text-slate-500 text-xs">
                            {p.deadline}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upcoming events */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Upcoming Events</span>
                  <button
                    type="button"
                    onClick={() => navigate("/events")}
                    className="text-xs font-semibold"
                    style={{ color: "#1AACB8" }}
                  >
                    View All →
                  </button>
                </div>
                <div className="flex flex-col gap-0 divide-y divide-slate-100">
                  {upcomingEvents.map((e, i) => (
                    <div key={i} className="px-5 py-3.5 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-800">
                          {e.title}
                        </span>
                        <span className={eventTypeClass[e.type]}>{e.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>📅 {e.date}</span>
                        <span>📍 {e.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick stats footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Proposals Under Review",
                  value: "7",
                  icon: <Clock size={16} style={{ color: "#6366F1" }} />,
                  bg: "#EEF2FF",
                },
                {
                  label: "Tasks Completed Today",
                  value: "23",
                  icon: <CheckCircle2 size={16} style={{ color: "#10B981" }} />,
                  bg: "#ECFDF5",
                },
                {
                  label: "New Beneficiaries (Oct)",
                  value: "312",
                  icon: <Heart size={16} style={{ color: "#EC4899" }} />,
                  bg: "#FCE7F3",
                },
                {
                  label: "Active Campaigns",
                  value: "9",
                  icon: <Target size={16} style={{ color: "#F59E0B" }} />,
                  bg: "#FFFBEB",
                },
              ].map((s, i) => (
                <div key={i} className="stat-card flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                  <div>
                    <div
                      className="text-xl font-extrabold text-slate-800"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : activeTab === "projects" ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<FolderKanban size={20} style={{ color: "#1AACB8" }} />}
                label="Tracked Projects"
                value={String(recentProjects.length)}
                sub="Across all stages"
              />
              <StatCard
                icon={<CheckCircle2 size={20} style={{ color: "#10B981" }} />}
                label="Active"
                value={String(
                  recentProjects.filter(
                    (project) => project.status === "Active",
                  ).length,
                )}
                sub="In progress"
              />
              <StatCard
                icon={<Clock size={20} style={{ color: "#6366F1" }} />}
                label="Planning"
                value={String(
                  recentProjects.filter(
                    (project) => project.status === "Planning",
                  ).length,
                )}
                sub="Preparing to launch"
              />
              <StatCard
                icon={<Target size={20} style={{ color: "#F59E0B" }} />}
                label="Average Progress"
                value={`${Math.round(recentProjects.reduce((total, project) => total + project.progress, 0) / recentProjects.length)}%`}
                sub="Across listed projects"
              />
            </div>
            <div className="card overflow-hidden">
              <div className="card-header">
                <span className="card-title">Project Portfolio</span>
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="text-xs font-semibold"
                  style={{ color: "#1AACB8" }}
                >
                  Open projects →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Lead</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Budget</th>
                      <th>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project.name}>
                        <td className="font-semibold text-slate-800">
                          {project.name}
                        </td>
                        <td>{project.lead}</td>
                        <td>
                          <span className={statusClass[project.status]}>
                            {project.status}
                          </span>
                        </td>
                        <td>{project.progress}%</td>
                        <td>{project.budget}</td>
                        <td className="text-slate-500 text-xs">
                          {project.deadline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === "donors" ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Heart size={20} style={{ color: "#1AACB8" }} />}
                label="Donations This Period"
                value="₹24.29L"
                sub="Apr–Oct 2025"
              />
              <StatCard
                icon={<TrendingUp size={20} style={{ color: "#10B981" }} />}
                label="Peak Month"
                value="₹4.20L"
                sub="September 2025"
              />
              <StatCard
                icon={<Users size={20} style={{ color: "#6366F1" }} />}
                label="Donor Reach"
                value="1,840"
                sub="Unique donors"
              />
              <StatCard
                icon={<Target size={20} style={{ color: "#F59E0B" }} />}
                label="Active Campaigns"
                value="9"
                sub="Fundraising efforts"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="card lg:col-span-2">
                <div className="card-header">
                  <span className="card-title">Monthly Donations</span>
                  <span className="badge badge-teal text-xs">
                    Last 7 Months
                  </span>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={donationTrend}>
                      <defs>
                        <linearGradient
                          id="donorTealGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1AACB8"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#1AACB8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) =>
                          `₹${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        formatter={(value: any) => [
                          `₹${(Number(value) / 1000).toFixed(0)}k`,
                          "Donations",
                        ]}
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid #E2E8F0",
                          fontSize: 12,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#1AACB8"
                        strokeWidth={2.5}
                        fill="url(#donorTealGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Donation Breakdown</span>
                </div>
                <div className="card-body flex flex-col gap-4">
                  {donationTrend.map((month) => (
                    <div key={month.month}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-medium text-slate-600">
                          {month.month}
                        </span>
                        <span className="text-slate-500">
                          ₹{(month.amount / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-teal-500"
                          style={{ width: `${(month.amount / 420000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => navigate("/donor-management/admin/dashboard")}
                    className="btn-secondary mt-2 justify-center text-sm"
                  >
                    Open donor dashboard
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Users size={20} style={{ color: "#1AACB8" }} />}
                label="Total Volunteers"
                value="1,284"
                sub="+52 this month"
                up
              />
              <StatCard
                icon={<Clock size={20} style={{ color: "#6366F1" }} />}
                label="Volunteer Hours"
                value={`${volunteerActivity.reduce((total, department) => total + department.hours, 0)}`}
                sub="Across departments"
              />
              <StatCard
                icon={<Heart size={20} style={{ color: "#10B981" }} />}
                label="Beneficiaries Served"
                value="24,670"
                sub="+1,210 this quarter"
                up
              />
              <StatCard
                icon={<AlertCircle size={20} style={{ color: "#F59E0B" }} />}
                label="Pending Actions"
                value={String(pendingTasks.length)}
                sub="Requires follow-up"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="card lg:col-span-2">
                <div className="card-header">
                  <span className="card-title">
                    Volunteer Hours by Department
                  </span>
                  <span className="text-xs text-slate-400">This Month</span>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={volunteerActivity} barSize={32}>
                      <XAxis
                        dataKey="dept"
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, fontSize: 12 }}
                      />
                      <Bar
                        dataKey="hours"
                        fill="#1AACB8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Pending Actions</span>
                  <span className="badge badge-red text-xs">
                    {pendingTasks.length} tasks
                  </span>
                </div>
                <div className="flex flex-col divide-y divide-slate-100">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.task}
                      className="px-5 py-3 flex flex-col gap-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm text-slate-700 leading-snug">
                          {task.task}
                        </span>
                        <span className={priorityClass[task.priority]}>
                          {task.priority}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Due: {task.due}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">People Management</span>
                <button
                  type="button"
                  onClick={() => navigate("/people-management")}
                  className="text-xs font-semibold"
                  style={{ color: "#1AACB8" }}
                >
                  Open people module →
                </button>
              </div>
              <div className="card-body grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  ["HR Management", "/people-management/hr"],
                  ["Interns", "/people-management/interns"],
                  ["Volunteers", "/people-management/volunteers"],
                ].map(([label, path]) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => navigate(path)}
                    className="btn-secondary justify-center"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
