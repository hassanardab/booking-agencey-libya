//data/mockEvents.ts
import { BookingEvent } from "@/types/events";

const now = new Date();
const thisWeek = new Date();
thisWeek.setDate(now.getDate() + 3);

const thisMonth = new Date();
thisMonth.setDate(now.getDate() + 15);

export const MOCK_EVENTS: BookingEvent[] = [
  {
    id: "1",
    title: "Corporate Gala",
    customerName: "Acme Corp",
    startDate: new Date(new Date().setHours(14, 0, 0, 0)),
    endDate: new Date(new Date().setHours(20, 0, 0, 0)),
    amount: 2400,
    paidAmount: 2400,
    currency: "USD",
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2",
    title: "Wedding Photography",
    customerName: "Sarah & John",
    startDate: new Date(new Date().setHours(17, 30, 0, 0)),
    endDate: new Date(new Date().setHours(23, 0, 0, 0)),
    amount: 1200,
    paidAmount: 600,
    balance: 600,
    currency: "USD",
    status: "partially_paid",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "3",
    title: "Product Launch",
    customerName: "TechFlow Inc",
    startDate: new Date("2026-10-12T09:00:00"),
    endDate: new Date("2026-10-12T17:00:00"),
    amount: 3500,
    currency: "USD",
    status: "postponed",
    notes: "Venue Issue",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "4",
    title: "Networking Brunch",
    customerName: "Startup Hub",
    startDate: thisWeek,
    endDate: new Date(thisWeek.getTime() + 3 * 60 * 60 * 1000),
    amount: 1500,
    paidAmount: 1500,
    currency: "USD",
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "5",
    title: "Fashion Show",
    customerName: "Vogue Libya",
    startDate: thisMonth,
    endDate: new Date(thisMonth.getTime() + 5 * 60 * 60 * 1000),
    amount: 5000,
    paidAmount: 0,
    balance: 5000,
    currency: "USD",
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  },
];
