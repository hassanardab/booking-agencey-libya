//types/events.ts

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
  status:
    | "confirmed"
    | "postponed"
    | "partially_paid"
    | "cancelled"
    | "pending";
  place?: string;
  notes?: string;
  description?: string;
  createdAt: Date;
  isPostponed?: boolean;
  updatedAt: Date;
  clientId?: string;
  placeId?: string;
  source?: string;
  baseCurrencyAmount?: number;
  type?: "confirmed" | "unconfirmed";
}

export interface Client {
  id: string;
  Name: string;
  Email?: string;
  mainPhone?: string;
  phones?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
