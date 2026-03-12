//services/eventService.ts
import { MOCK_EVENTS } from "@/data/mockEvents";
import { BookingEvent } from "@/types/events";
import { getPaidAmountForEvent } from "./accountingService";

/**
 * Get event by ID
 */
export function getEventById(id: string): BookingEvent | undefined {
  return MOCK_EVENTS.find((event) => event.id === id);
}

/**
 * Get multiple events by an array of IDs
 */
export function getEventsByIds(ids: string[]): BookingEvent[] {
  return MOCK_EVENTS.filter((event) => ids.includes(event.id));
}

/**
 * Get all events
 */
export function getAllEvents(): BookingEvent[] {
  return MOCK_EVENTS;
}

/**
 * Get upcoming events
 */
export function getUpcomingEvents(): BookingEvent[] {
  return MOCK_EVENTS.filter(
    (e) => e.status === "confirmed" || e.status === "partially_paid",
  );
}

/**
 * Get postponed events
 */
export function getPostponedEvents(): BookingEvent[] {
  return MOCK_EVENTS.filter((e) => e.status === "postponed");
}

/**
 * Reconciles event status based on actual payments and postponement flags.
 * This should be called whenever a payment is added, edited, or deleted.
 */
// services/eventService.ts

export function syncEventStatus(eventId: string): BookingEvent | undefined {
  const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
  if (eventIndex === -1) return undefined;

  const event = MOCK_EVENTS[eventIndex];

  // Always fetch the absolute latest from the accounting service
  const paidAmount = getPaidAmountForEvent(eventId);
  const totalAmount = event.amount || 0;

  let newStatus: BookingEvent["status"] = "pending";

  // Logic Hierarchy
  if (event.isPostponed) {
    newStatus = "postponed";
  } else if (paidAmount >= totalAmount && totalAmount > 0) {
    newStatus = "confirmed";
  } else if (paidAmount > 0) {
    newStatus = "partially_paid";
  }

  // Update master record
  const updatedEvent = {
    ...event,
    status: newStatus,
    paidAmount: paidAmount,
    updatedAt: new Date(),
  };

  MOCK_EVENTS[eventIndex] = updatedEvent;
  return { ...updatedEvent };
}

/**
 * Change event to postponed and update the source
 */
export function changeToPostponedEvent(
  eventId: string,
): BookingEvent | undefined {
  const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
  if (eventIndex === -1) return undefined;

  MOCK_EVENTS[eventIndex] = {
    ...MOCK_EVENTS[eventIndex],
    isPostponed: true, // Set the flag that syncEventStatus checks
    status: "postponed",
    updatedAt: new Date(),
  };

  return MOCK_EVENTS[eventIndex];
}

/**
 * Delete event
 */
export function deleteEvent(eventId: string): boolean {
  const index = MOCK_EVENTS.findIndex((event) => event.id === eventId);
  if (index !== -1) {
    MOCK_EVENTS.splice(index, 1);
    return true;
  }
  return false;
}
