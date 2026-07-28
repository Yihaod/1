import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BookingRecord } from '@/types/booking';
import { BOOKINGS_STORAGE_KEY, notifyBookingsChanged } from '@/lib/bookingChangeBus';

const STORAGE_KEY = BOOKINGS_STORAGE_KEY;

/** 本地存储实现；后续可替换为 Supabase 等同名接口 */
export interface BookingRepository {
  create(input: Omit<BookingRecord, 'id' | 'createdAt'>): Promise<BookingRecord>;
  getById(id: string): Promise<BookingRecord | null>;
  update(id: string, patch: Partial<Omit<BookingRecord, 'id' | 'createdAt'>>): Promise<BookingRecord | null>;
  list(): Promise<BookingRecord[]>;
}

function generateId(): string {
  return `TCM${Date.now().toString(36).toUpperCase()}`;
}

class LocalBookingRepository implements BookingRepository {
  async list(): Promise<BookingRecord[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw) as BookingRecord[];
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getById(id: string): Promise<BookingRecord | null> {
    const items = await this.list();
    return items.find((b) => b.id === id) ?? null;
  }

  async create(input: Omit<BookingRecord, 'id' | 'createdAt'>): Promise<BookingRecord> {
    const record: BookingRecord = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const items = await this.list();
    items.unshift(record);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    notifyBookingsChanged();
    return record;
  }

  async update(
    id: string,
    patch: Partial<Omit<BookingRecord, 'id' | 'createdAt'>>
  ): Promise<BookingRecord | null> {
    const items = await this.list();
    const index = items.findIndex((b) => b.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...patch };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    notifyBookingsChanged();
    return items[index];
  }
}

export const bookingRepository: BookingRepository = new LocalBookingRepository();
