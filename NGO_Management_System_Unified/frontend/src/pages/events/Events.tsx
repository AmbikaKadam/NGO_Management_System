import { useEffect, useState, type FormEvent } from "react"
import { Plus, MapPin, Calendar, Users, Search } from "lucide-react"
import { apiCreate, apiList, apiUpdate } from "../../services/apiClient"

type EventRecord = {
  id: string
  title: string
  type: string
  date: string
  time: string
  location: string
  organizer: string
  capacity: number
  registered: number
  status: "Upcoming" | "Completed" | "Cancelled"
  budget: string
}

type ApiEvent = {
  id: string
  title: string
  description: string
  startsAt: string
  location: string
  capacity: number | null
  status: "Scheduled" | "Completed" | "Cancelled"
}

function eventFromApi(event: ApiEvent): EventRecord {
  let metadata: Partial<Pick<EventRecord, "type" | "organizer" | "budget">> = {}
  try {
    metadata = JSON.parse(event.description || "{}") as typeof metadata
  } catch {
    metadata = { type: "Community" }
  }
  const startsAt = new Date(event.startsAt)
  return {
    id: event.id,
    title: event.title,
    type: metadata.type ?? "Community",
    date: startsAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    time: startsAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    location: event.location,
    organizer: metadata.organizer ?? "",
    capacity: event.capacity ?? 0,
    registered: 0,
    status: event.status === "Scheduled" ? "Upcoming" : event.status,
    budget: metadata.budget ?? "₹0",
  }
}

const typeStyle: Record<string, string> = {
  Fundraiser: "badge badge-teal",
  Training: "badge badge-blue",
  Outreach: "badge badge-green",
  Meeting: "badge badge-gray",
  Community: "badge badge-purple",
}

const statusStyle: Record<string, string> = {
  Upcoming: "badge badge-yellow",
  Completed: "badge badge-green",
  Cancelled: "badge badge-red",
}

export default function EventsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [records, setRecords] = useState<EventRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<EventRecord | null>(null)

  const reloadEvents = async () => {
    setLoading(true)
    try {
      const result = await apiList<ApiEvent>("events", { limit: 200, sort: "startsAt", order: "asc" })
      setRecords(result.items.map(eventFromApi))
      setError("")
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load events.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void reloadEvents()
  }, [])

  const filtered = records.filter((e) =>
    `${e.title} ${e.type} ${e.location}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  const createEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const eventDate = String(data.get("date"))
    try {
      const created = await apiCreate<ApiEvent>("events", {
        title: String(data.get("title")).trim(),
        description: JSON.stringify({
          type: String(data.get("type")),
          organizer: String(data.get("organizer")).trim(),
          budget: `₹${Number(data.get("budget") || 0).toLocaleString("en-IN")}`,
        }),
        startsAt: new Date(`${eventDate}T${String(data.get("time"))}`).toISOString(),
        location: String(data.get("location")).trim(),
        capacity: Number(data.get("capacity")) || null,
        status: "Scheduled",
      })
      setRecords((current) => [eventFromApi(created), ...current])
      setShowForm(false)
      setError("")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to create event.")
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">
            Plan and manage all Hope Foundation events
          </p>
        </div>

        {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading && <p className="text-sm text-slate-500">Loading events...</p>}
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Create Event
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Events",
            value: records.length.toLocaleString(),
            color: "#1AACB8",
          },
          {
            label: "Upcoming",
            value: records
              .filter((event) => event.status === "Upcoming")
              .length.toLocaleString(),
            color: "#6366F1",
          },
          {
            label: "Participants Registered",
            value: records
              .reduce((sum, event) => sum + event.registered, 0)
              .toLocaleString(),
            color: "#10B981",
          },
          { label: "Funds Raised (Events)", value: "₹18.4L", color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div
              className="text-2xl font-extrabold"
              style={{ color: s.color, fontFamily: "Nunito, sans-serif" }}
            >
              {s.value}
            </div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Create Event</span>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400"
              aria-label="Close event form"
            >
              ✕
            </button>
          </div>
          <form
            onSubmit={createEvent}
            className="card-body grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label htmlFor="event-title" className="form-label">
                Event name
              </label>
              <input
                id="event-title"
                name="title"
                required
                maxLength={140}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="event-type" className="form-label">
                Type
              </label>
              <select id="event-type" name="type" className="form-input">
                <option>Community</option>
                <option>Fundraiser</option>
                <option>Training</option>
                <option>Outreach</option>
                <option>Meeting</option>
              </select>
            </div>
            <div>
              <label htmlFor="event-date" className="form-label">
                Date
              </label>
              <input
                id="event-date"
                name="date"
                required
                type="date"
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="event-time" className="form-label">
                Time
              </label>
              <input
                id="event-time"
                name="time"
                required
                type="time"
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="event-location" className="form-label">
                Location
              </label>
              <input
                id="event-location"
                name="location"
                required
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="event-organizer" className="form-label">
                Organizer
              </label>
              <input
                id="event-organizer"
                name="organizer"
                required
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="event-capacity" className="form-label">
                Capacity
              </label>
              <input
                id="event-capacity"
                name="capacity"
                required
                type="number"
                min="1"
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="event-budget" className="form-label">
                Budget (₹)
              </label>
              <input
                id="event-budget"
                name="budget"
                type="number"
                min="0"
                className="form-input"
                defaultValue="0"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">{selected.title}</span>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-slate-400"
              aria-label="Close event details"
            >
              ✕
            </button>
          </div>
          <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <p>
              <strong>Type:</strong> {selected.type}
            </p>
            <p>
              <strong>Status:</strong> {selected.status}
            </p>
            <p>
              <strong>Date and time:</strong> {selected.date} at {selected.time}
            </p>
            <p>
              <strong>Location:</strong> {selected.location}
            </p>
            <p>
              <strong>Organizer:</strong> {selected.organizer}
            </p>
            <p>
              <strong>Registration:</strong> {selected.registered} /{" "}
              {selected.capacity}
            </p>
            <p>
              <strong>Budget:</strong> {selected.budget}
            </p>
            {selected.status === "Upcoming" && (
              <button
                type="button"
                className="btn-secondary sm:col-span-2 justify-self-start"
                onClick={() => {
                  void apiUpdate<ApiEvent>("events", selected.id, { status: "Completed" })
                    .then((updated) => {
                      const mapped = eventFromApi(updated)
                      setRecords((current) => current.map((record) => record.id === mapped.id ? mapped : record))
                      setSelected(mapped)
                    })
                    .catch((updateError: unknown) => setError(updateError instanceof Error ? updateError.message : "Unable to update event."))
                }}
              >
                Mark as completed
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="form-input pl-9"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="tab-bar">
          <button
            className={`tab-item ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            className={`tab-item ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="card hover:shadow-md transition-shadow overflow-hidden"
            >
              <div
                className="h-2"
                style={{
                  background: e.status === "Completed" ? "#10B981" : "#1AACB8",
                }}
              />
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={typeStyle[e.type]}>{e.type}</span>
                  <span className={statusStyle[e.status]}>{e.status}</span>
                </div>
                <div
                  className="font-bold text-slate-800"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {e.title}
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} /> {e.date} at {e.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} /> {e.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} /> {e.registered}/{e.capacity} registered
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${((e.registered / e.capacity) * 100).toFixed(0)}%`,
                      background: "#1AACB8",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Organizer: {e.organizer}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Budget: {e.budget}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-secondary flex-1 text-xs py-1.5"
                    onClick={() => setSelected(e)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-primary flex-1 text-xs py-1.5"
                    onClick={() => setSelected(e)}
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Type</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td className="font-semibold text-slate-800">{e.title}</td>
                    <td>
                      <span className={typeStyle[e.type]}>{e.type}</span>
                    </td>
                    <td className="text-xs">
                      {e.date} · {e.time}
                    </td>
                    <td className="text-xs">{e.location}</td>
                    <td>
                      {e.registered}/{e.capacity}
                    </td>
                    <td>
                      <span className={statusStyle[e.status]}>{e.status}</span>
                    </td>
                    <td>{e.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
