import type { ClinicStore } from '@/data/stores';
import { distanceMeters } from '@/lib/geo';
import type { LatLng } from '@/lib/geo';

export function sortStoresByDistance(
  stores: ClinicStore[],
  user: LatLng
): { ordered: ClinicStore[]; distanceById: Record<string, number> } {
  const withCoords: { store: ClinicStore; d: number }[] = [];
  const withoutCoords: ClinicStore[] = [];

  for (const store of stores) {
    if (store.latitude != null && store.longitude != null) {
      withCoords.push({
        store,
        d: distanceMeters(user.latitude, user.longitude, store.latitude, store.longitude),
      });
    } else {
      withoutCoords.push(store);
    }
  }

  withCoords.sort((a, b) => a.d - b.d);
  const distanceById: Record<string, number> = {};
  for (const item of withCoords) {
    distanceById[item.store.id] = item.d;
  }

  return {
    ordered: [...withCoords.map((x) => x.store), ...withoutCoords],
    distanceById,
  };
}
