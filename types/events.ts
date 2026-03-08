// data/mockEvents.ts

export interface BookingEvent {
  id: string;
  title: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerPhones?: string[];
  startDate: Date;
  endDate: Date;
  amount: number;
  balance?: number;
  paidAmount?: number;
  currency: string;
  status: "confirmed" | "postponed" | "partially_paid" | "cancelled";
  place?: string;
  notes?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  clientId?: string;
  placeId?: string;
  source?: string;
  baseCurrencyAmount?: number;
  type?: "confirmed" | "unconfirmed";
}
