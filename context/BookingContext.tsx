import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Booking, getBookings } from '@/lib/bookings';

type BookingContextValue = {
  bookings: Booking[];
  refreshBookings: () => Promise<void>;
  loading: boolean;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingContextProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBookings = useCallback(async () => {
    setLoading(true);
    const list = await getBookings();
    setBookings(list);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  const value = useMemo(
    () => ({ bookings, refreshBookings, loading }),
    [bookings, refreshBookings, loading]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingContextProvider');
  return ctx;
}
