import { clinicStores } from '@/data/stores';
import type { ClinicStore } from '@/data/stores';
import { sortStoresByDistance } from '@/lib/sortStoresByDistance';
import { getUserLocationForSorting } from '@/lib/userLocation';
import { useCallback, useEffect, useState } from 'react';

export type NearbyStoresStatus =
  | 'loading'
  | 'sorted'
  | 'denied'
  | 'unavailable'
  | 'no_coords';

export function useNearbyStores() {
  const [stores, setStores] = useState<ClinicStore[]>(clinicStores);
  const [distanceByStoreId, setDistanceByStoreId] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<NearbyStoresStatus>('loading');

  const refresh = useCallback(async () => {
    setStatus('loading');
    const hasAnyCoords = clinicStores.some(
      (s) => s.latitude != null && s.longitude != null
    );
    if (!hasAnyCoords) {
      setStores(clinicStores);
      setDistanceByStoreId({});
      setStatus('no_coords');
      return;
    }

    const result = await getUserLocationForSorting();
    if (!result.ok) {
      setStores(clinicStores);
      setDistanceByStoreId({});
      setStatus(result.reason === 'denied' ? 'denied' : 'unavailable');
      return;
    }

    const { ordered, distanceById } = sortStoresByDistance(clinicStores, {
      latitude: result.coords.latitude,
      longitude: result.coords.longitude,
    });
    setStores(ordered);
    setDistanceByStoreId(distanceById);
    setStatus('sorted');
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stores, distanceByStoreId, status, refresh };
}
