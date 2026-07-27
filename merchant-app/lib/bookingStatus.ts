import type { BookingRecord, BookingStatus } from '@/types/booking';

export function isBookingCancelled(booking: Pick<BookingRecord, 'status'>): boolean {
  return booking.status === 'cancelled';
}

export function isBookingActive(booking: Pick<BookingRecord, 'status'>): boolean {
  return !isBookingCancelled(booking);
}

export const BOOKING_STATUS_CONFIRMED: BookingStatus = 'confirmed';
