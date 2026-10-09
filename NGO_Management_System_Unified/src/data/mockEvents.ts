export type EventRecord = {
  id: number

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

export const initialEvents: EventRecord[] = [
  {
    id: 1,
    title: "Annual Donors Gala 2026",
    type: "Fundraiser",
    date: "15 Nov 2026",
    time: "6:00 PM",
    location: "Taj Hotel, Mumbai",
    organizer: "Priya Sharma",
    capacity: 200,
    registered: 148,
    status: "Upcoming",
    budget: "₹3,50,000",
  },

  {
    id: 2,
    title: "Volunteer Orientation – Batch 12",
    type: "Training",
    date: "22 Oct 2026",
    time: "10:00 AM",
    location: "Hope Foundation HQ, Delhi",
    organizer: "Rahul Mehta",
    capacity: 50,
    registered: 42,
    status: "Upcoming",
    budget: "₹15,000",
  },

  {
    id: 3,
    title: "Health Camp – Dharavi",
    type: "Outreach",
    date: "28 Oct 2026",
    time: "8:00 AM",
    location: "Dharavi Community Hall, Mumbai",
    organizer: "Dr. Anita Patel",
    capacity: 500,
    registered: 387,
    status: "Upcoming",
    budget: "₹85,000",
  },

  {
    id: 4,
    title: "Board Review Meeting Q3",
    type: "Meeting",
    date: "5 Nov 2026",
    time: "11:00 AM",
    location: "Online (Zoom)",
    organizer: "Admin",
    capacity: 20,
    registered: 18,
    status: "Upcoming",
    budget: "₹0",
  },

  {
    id: 5,
    title: "School Supply Drive – Nashik",
    type: "Community",
    date: "5 Oct 2026",
    time: "9:00 AM",
    location: "Nashik District Schools",
    organizer: "Sunita Roy",
    capacity: 150,
    registered: 150,
    status: "Completed",
    budget: "₹45,000",
  },

  {
    id: 6,
    title: "Fundraising Marathon",
    type: "Fundraiser",
    date: "8 Oct 2026",
    time: "6:00 AM",
    location: "Cubbon Park, Bengaluru",
    organizer: "Vikram Singh",
    capacity: 1000,
    registered: 826,
    status: "Completed",
    budget: "₹1,20,000",
  },
]
