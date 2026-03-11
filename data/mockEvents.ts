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
    title: "حفل عشاء شركات", // Corporate Gala
    customerName: "شركة المدار الجديد",
    startDate: new Date(new Date().setHours(14, 0, 0, 0)),
    endDate: new Date(new Date().setHours(20, 0, 0, 0)),
    amount: 2400,
    paidAmount: 2400,
    currency: "LYD",
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2",
    title: "تصوير حفل زفاف", // Wedding Photography
    customerName: "سارة و أحمد",
    startDate: new Date(new Date().setHours(17, 30, 0, 0)),
    endDate: new Date(new Date().setHours(23, 0, 0, 0)),
    amount: 1200,
    paidAmount: 600,
    balance: 600,
    currency: "LYD",
    status: "partially_paid",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "3",
    title: "إطلاق منتج جديد", // Product Launch
    customerName: "شركة تدفق التقنية",
    startDate: new Date("2026-10-12T09:00:00"),
    endDate: new Date("2026-10-12T17:00:00"),
    amount: 3500,
    currency: "LYD",
    status: "postponed",
    notes: "مشكلة في القاعة", // Venue Issue
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "4",
    title: "فطور تواصل اجتماعي", // Networking Brunch
    customerName: "حاضنة بناء",
    startDate: thisWeek,
    endDate: new Date(thisWeek.getTime() + 3 * 60 * 60 * 1000),
    amount: 1500,
    paidAmount: 1500,
    currency: "LYD",
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "5",
    title: "عرض أزياء", // Fashion Show
    customerName: "مجلة فاشن ليبيا",
    startDate: thisMonth,
    endDate: new Date(thisMonth.getTime() + 5 * 60 * 60 * 1000),
    amount: 5000,
    paidAmount: 0,
    balance: 5000,
    currency: "LYD",
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  },
];
