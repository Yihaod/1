import AsyncStorage from '@react-native-async-storage/async-storage';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  serviceId: string;
  serviceName: string;
  provider: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  note?: string;
  priceCents: number;
  status: BookingStatus;
  createdAt: string;
};

const STORAGE_KEY = '@service_booking/bookings';

export const statusLabels: Record<BookingStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

export async function getBookings(): Promise<Booking[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Booking[];
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function saveBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
  const list = await getBookings();
  const newBooking: Booking = {
    ...booking,
    id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  list.unshift(newBooking);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return newBooking;
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const list = await getBookings();
  const idx = list.findIndex((b) => b.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], status };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function cancelBooking(id: string): Promise<void> {
  await updateBookingStatus(id, 'cancelled');
}
