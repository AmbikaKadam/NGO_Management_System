import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import usePersistentState from "../../hooks/usePersistentState"
import { initialEvents, type EventRecord } from "../../data/mockEvents"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const eventColors: Record<string, string> = {
  Fundraiser: "#1AACB8",
  Training: "#6366F1",
  Outreach: "#10B981",
  Meeting: "#94A3B8",
  Community: "#8B5CF6",
}

export default function EventsCalendar() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [events] = usePersistentState<EventRecord[]>(
    "ngo-events",
    initialEvents,
  )
  const navigate = useNavigate()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const eventsByDay = new Map<number, EventRecord[]>()
  for (const event of events) {
    const date = new Date(event.date)
    if (
      Number.isNaN(date.getTime()) ||
      date.getMonth() !== month ||
      date.getFullYear() !== year
    )
      continue
    eventsByDay.set(date.getDate(), [
      ...(eventsByDay.get(date.getDate()) ?? []),
      event,
    ])
  }

  const prev = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else setMonth((m) => m - 1)
  }
  const next = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else setMonth((m) => m + 1)
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Events Calendar</h1>
          <p className="page-subtitle">
            View and plan events on the interactive calendar
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/events")}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Fundraiser", color: "#1AACB8" },
          { label: "Training", color: "#6366F1" },
          { label: "Outreach", color: "#10B981" },
          { label: "Meeting", color: "#94A3B8" },
          { label: "Community", color: "#8B5CF6" },
        ].map((l) => (
          <div
            key={l.label}
            className="flex items-center gap-1.5 text-xs text-slate-500"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: l.color }}
            />
            {l.label}
          </div>
        ))}
      </div>

      <div className="card">
        {/* Month nav */}
        <div className="card-header">
          <button
            onClick={prev}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="card-title">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={next}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="card-body">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-bold text-slate-400 uppercase py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const dayEvents = eventsByDay.get(day) ?? []
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()

              return (
                <div
                  key={i}
                  className={`min-h-[80px] p-1.5 rounded-lg border transition-all ${
                    isToday
                      ? "border-teal-400 bg-teal-50"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <div
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                      isToday ? "text-white" : "text-slate-700"
                    }`}
                    style={isToday ? { background: "#1AACB8" } : {}}
                  >
                    {day}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.map((ev, j) => (
                      <div
                        key={`${ev.id}-${j}`}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded text-white truncate"
                        title={`${ev.title} · ${ev.time} · ${ev.status}`}
                        style={{
                          background: eventColors[ev.type] ?? "#64748B",
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
