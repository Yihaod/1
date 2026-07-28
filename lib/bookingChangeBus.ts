/** 与 bookingRepository 使用同一 AsyncStorage key（Web 下即 localStorage key） */
export const BOOKINGS_STORAGE_KEY = '@tcm_booking/records_v3';

const EVENT_NAME = 'tcm-booking-records-changed';

export function notifyBookingsChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

/** 其它标签页改 storage，或本页写入后触发自定义事件 */
export function subscribeBookingsChanged(onChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === BOOKINGS_STORAGE_KEY || event.key === null) {
      onChange();
    }
  };
  const onCustom = () => onChange();

  window.addEventListener('storage', onStorage);
  window.addEventListener(EVENT_NAME, onCustom);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(EVENT_NAME, onCustom);
  };
}
