import { bookingRepository } from '@/lib/bookingRepository';
import { isBookingActive } from '@/lib/bookingStatus';
import { useBookingsRevision } from '@/hooks/useBookingsRevision';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export function useLatestBookingId(): string | null {
  const [latestBookingId, setLatestBookingId] = useState<string | null>(null);
  const bookingsRevision = useBookingsRevision();

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      bookingRepository.list().then((items) => {
        if (!cancelled) {
          const latest = items.find((b) => isBookingActive(b));
          setLatestBookingId(latest?.id ?? null);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [bookingsRevision])
  );

  return latestBookingId;
}
