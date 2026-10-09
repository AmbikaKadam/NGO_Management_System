import { useState, type FormEvent } from "react"
import { Plus, Search, Eye, Edit2, Phone, Mail, MapPin } from "lucide-react"
import usePersistentState from "../../hooks/usePersistentState"

type Donor = {
  id: string
  name: string
  type: string
  segment: string
  email: string
  phone: string
  location: string
  cause: string
  totalGiven: string
  status: "Active" | "Lapsed"
  lastDonation: string
}

const initialDonors: Donor[] = [
  {
    id: "DNR-001",
    name: "Tata Trust",
    type: "Corporate",
    segment: "Platinum",
    email: "csr@tatatrust.org",
    phone: "+91 22 6665 8282",
    location: "Mumbai",
    cause: "Education",
    totalGiven: "₹85,00,000",
    status: "Active",
    lastDonation: "15 Sep 2025",
  },
  {
    id: "DNR-002",
    name: "Ramesh Gupta",
    type: "Individual",
    segment: "Gold",
    email: "ramesh.g@email.com",
    phone: "+91 98765 43210",
    location: "Pune",
    cause: "Healthcare",
    totalGiven: "₹12,50,000",
    status: "Active",
    lastDonation: "1 Oct 2025",
  },
  {
    id: "DNR-003",
    name: "Infosys Foundation",
    type: "Corporate",
    segment: "Platinum",
    email: "foundation@infosys.com",
    phone: "+91 80 2852 0261",
    location: "Bengaluru",
    cause: "Digital Literacy",
    totalGiven: "₹75,00,000",
    status: "Active",
    lastDonation: "30 Sep 2025",
  },
  {
    id: "DNR-004",
    name: "Sunita Mehra",
    type: "Individual",
    segment: "Silver",
    email: "sunita.m@gmail.com",
    phone: "+91 99887 65432",
    location: "Delhi",
    cause: "Women Empowerment",
    totalGiven: "₹4,80,000",
    status: "Active",
    lastDonation: "5 Oct 2025",
  },
  {
    id: "DNR-005",
    name: "Birla Charitable Trust",
    type: "Organisation",
    segment: "Gold",
    email: "csr@birlacharity.org",
    phone: "+91 11 2332 1100",
    location: "Delhi",
    cause: "Rural Development",
    totalGiven: "₹32,00,000",
    status: "Active",
    lastDonation: "20 Aug 2025",
  },
  {
    id: "DNR-006",
    name: "Ajay Verma",
    type: "Individual",
    segment: "Bronze",
    email: "ajay.v@yahoo.com",
    phone: "+91 97654 32108",
    location: "Jaipur",
    cause: "Child Education",
    totalGiven: "₹1,25,000",
    status: "Lapsed",
    lastDonation: "10 Jan 2025",
  },
  {
    id: "DNR-007",
    name: "HCL Foundation",
    type: "Corporate",
    segment: "Gold",
    email: "foundation@hcl.com",
    phone: "+91 120 600 8000",
    location: "Noida",
    cause: "Skill Development",
    totalGiven: "₹28,00,000",
    status: "Active",
    lastDonation: "25 Sep 2025",
  },
]

const segColors: Record<string, string> = {
  Platinum: "badge badge-purple",
  Gold: "badge badge-yellow",
  Silver: "badge badge-gray",
  Bronze: "badge",
}

const typeColors: Record<string, string> = {
  Individual: "badge badge-teal",
  Corporate: "badge badge-blue",
  Organisation: "badge badge-green",
}

export default function DonorDirectoryPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [records, setRecords] = usePersistentState<Donor[]>(
    "ngo-donor-directory",
    initialDonors,
  )
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Donor | null>(null)
  const [selected, setSelected] = useState<Donor | null>(null)

  const filtered = records.filter(
    (d) =>
      (typeFilter === "All" || d.type === typeFilter) &&
      `${d.name} ${d.email} ${d.location} ${d.cause}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }
  const saveDonor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const donor: Donor = {
      id: editing?.id ?? `DNR-${String(Date.now()).slice(-6)}`,
      name: String(data.get("name")).trim(),
      type: String(data.get("type")),
      segment: String(data.get("segment")),
      email: String(data.get("email")).trim(),
      phone: String(data.get("phone")).trim(),
      location: String(data.get("location")).trim(),
      cause: String(data.get("cause")).trim(),
      totalGiven: editing?.totalGiven ?? "₹0",
      status: editing?.status ?? "Active",
      lastDonation: editing?.lastDonation ?? "No donations yet",
    }
    setRecords((current) =>
      editing
        ? current.map((record) => (record.id === editing.id ? donor : record))
        : [donor, ...current],
    )
    closeForm()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Donor Directory</h1>
          <p className="page-subtitle">
            Complete database of all donors and their profiles
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
        >
          <Plus size={16} /> Add Donor
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {editing ? "Edit Donor" : "Add Donor"}
            </span>
            <button
              type="button"
              onClick={closeForm}
              className="text-slate-400"
              aria-label="Close donor form"
            >
              ✕
            </button>
          </div>
          <form
            onSubmit={saveDonor}
            className="card-body grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label htmlFor="donor-name" className="form-label">
                Name
              </label>
              <input
                id="donor-name"
                name="name"
                required
                maxLength={140}
                className="form-input"
                defaultValue={editing?.name}
              />
            </div>
            <div>
              <label htmlFor="donor-type" className="form-label">
                Donor type
              </label>
              <select
                id="donor-type"
                name="type"
                className="form-input"
                defaultValue={editing?.type ?? "Individual"}
              >
                <option>Individual</option>
                <option>Corporate</option>
                <option>Organisation</option>
              </select>
            </div>
            <div>
              <label htmlFor="donor-segment" className="form-label">
                Segment
              </label>
              <select
                id="donor-segment"
                name="segment"
                className="form-input"
                defaultValue={editing?.segment ?? "Bronze"}
              >
                <option>Platinum</option>
                <option>Gold</option>
                <option>Silver</option>
                <option>Bronze</option>
              </select>
            </div>
            <div>
              <label htmlFor="donor-email" className="form-label">
                Email
              </label>
              <input
                id="donor-email"
                name="email"
                type="email"
                required
                className="form-input"
                defaultValue={editing?.email}
              />
            </div>
            <div>
              <label htmlFor="donor-phone" className="form-label">
                Phone
              </label>
              <input
                id="donor-phone"
                name="phone"
                type="tel"
                required
                className="form-input"
                defaultValue={editing?.phone}
              />
            </div>
            <div>
              <label htmlFor="donor-location" className="form-label">
                Location
              </label>
              <input
                id="donor-location"
                name="location"
                required
                className="form-input"
                defaultValue={editing?.location}
              />
            </div>
            <div>
              <label htmlFor="donor-cause" className="form-label">
                Cause interest
              </label>
              <input
                id="donor-cause"
                name="cause"
                required
                className="form-input"
                defaultValue={editing?.cause}
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={closeForm}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editing ? "Save Changes" : "Add Donor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Donor Profile · {selected.id}</span>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-slate-400"
              aria-label="Close donor profile"
            >
              ✕
            </button>
          </div>
          <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <p>
              <strong>Name:</strong> {selected.name}
            </p>
            <p>
              <strong>Type / segment:</strong> {selected.type} /{" "}
              {selected.segment}
            </p>
            <p>
              <strong>Email:</strong> {selected.email}
            </p>
            <p>
              <strong>Phone:</strong> {selected.phone}
            </p>
            <p>
              <strong>Location:</strong> {selected.location}
            </p>
            <p>
              <strong>Cause interest:</strong> {selected.cause}
            </p>
            <p>
              <strong>Total given:</strong> {selected.totalGiven}
            </p>
            <p>
              <strong>Last donation:</strong> {selected.lastDonation}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="form-input pl-9"
            placeholder="Search donors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Individual", "Corporate", "Organisation"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                typeFilter === t
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="tab-bar">
          <button
            className={`tab-item text-xs ${
              viewMode === "table" ? "active" : ""
            }`}
            onClick={() => setViewMode("table")}
          >
            Table
          </button>
          <button
            className={`tab-item text-xs ${
              viewMode === "cards" ? "active" : ""
            }`}
            onClick={() => setViewMode("cards")}
          >
            Cards
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Donor</th>
                  <th>Type</th>
                  <th>Segment</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Cause</th>
                  <th>Total Given</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="text-xs text-slate-400">{d.id}</td>
                    <td className="font-semibold text-slate-800">{d.name}</td>
                    <td>
                      <span className={typeColors[d.type]}>{d.type}</span>
                    </td>
                    <td>
                      <span
                        className={segColors[d.segment] ?? "badge badge-gray"}
                      >
                        {d.segment}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs text-slate-500">{d.email}</div>
                      <div className="text-xs text-slate-400">{d.phone}</div>
                    </td>
                    <td className="text-xs">{d.location}</td>
                    <td className="text-xs text-slate-600">{d.cause}</td>
                    <td className="font-bold text-slate-700">{d.totalGiven}</td>
                    <td>
                      <span
                        className={
                          d.status === "Active"
                            ? "badge badge-green"
                            : "badge badge-red"
                        }
                      >
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label={`View ${d.name}`}
                          onClick={() => setSelected(d)}
                          className="p-1.5 rounded hover:bg-teal-50 text-slate-400 hover:text-teal-600"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Edit ${d.name}`}
                          onClick={() => {
                            setEditing(d)
                            setShowForm(true)
                            setSelected(null)
                          }}
                          className="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: "#1AACB8" }}
                  >
                    {d.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 truncate">
                      {d.name}
                    </div>
                    <div className="text-xs text-slate-400">{d.id}</div>
                  </div>
                  <span className={segColors[d.segment] ?? "badge badge-gray"}>
                    {d.segment}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className={typeColors[d.type]}>{d.type}</span>
                  <span
                    className={
                      d.status === "Active"
                        ? "badge badge-green"
                        : "badge badge-red"
                    }
                  >
                    {d.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Mail size={11} /> {d.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={11} /> {d.phone}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} /> {d.location}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div>
                    <div className="text-xs text-slate-400">Total Given</div>
                    <div className="font-bold text-slate-800">
                      {d.totalGiven}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Cause</div>
                    <div className="text-xs font-semibold text-slate-700">
                      {d.cause}
                    </div>
                  </div>
                </div>
                <button
                  className="btn-secondary text-xs py-1.5"
                  onClick={() => setSelected(d)}
                >
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
