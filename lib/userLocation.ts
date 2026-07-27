import * as Location from 'expo-location';
import { Platform } from 'react-native';
import type { LatLng } from '@/lib/geo';

export type LocationResult =
  | { ok: true; coords: LatLng }
  | { ok: false; reason: 'denied' | 'unavailable' | 'timeout' | 'unsupported' };

async function getWebLocation(): Promise<LocationResult> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { ok: false, reason: 'unsupported' };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          ok: true,
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) resolve({ ok: false, reason: 'denied' });
        else resolve({ ok: false, reason: 'unavailable' });
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 120000 }
    );
  });
}

async function getNativeLocation(): Promise<LocationResult> {
  try {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') {
      return { ok: false, reason: 'denied' };
    }
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      ok: true,
      coords: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      },
    };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

/** 仅用于门店距离排序，不上传服务器 */
export async function getUserLocationForSorting(): Promise<LocationResult> {
  if (Platform.OS === 'web') {
    return getWebLocation();
  }
  return getNativeLocation();
}
