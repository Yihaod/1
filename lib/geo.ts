/** 地球表面两点直线距离（米），Haversine */
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatDistanceMeters(meters: number): string {
  if (meters < 1000) return `约 ${Math.max(1, Math.round(meters))} 米`;
  return `约 ${(meters / 1000).toFixed(1)} 公里`;
}

export type LatLng = { latitude: number; longitude: number };

export type StoreWithDistance = {
  storeId: string;
  distanceMeters: number;
};
