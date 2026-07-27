export type DayOption = {
  key: string;
  /** 主文案：今天 / 明天 / 7月28日 */
  label: string;
  weekday: string;
};

export type TimeSlot = {
  id: string;
  label: string;
};

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/** 10:00–21:00，每 30 分钟一档，不跳档 */
function buildHalfHourSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 10; hour <= 21; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour < 21) {
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }
  return slots;
}

const ALL_TIME_LABELS = buildHalfHourSlots();

export function getAllTimeLabels(): string[] {
  return [...ALL_TIME_LABELS];
}

export function getDayOptions(count = 14): DayOption[] {
  const today = new Date();
  const list: DayOption[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = toDateKey(d);
    const weekday = WEEKDAYS[d.getDay()];
    const label =
      i === 0 ? '今天' : i === 1 ? '明天' : `${d.getMonth() + 1}月${d.getDate()}日`;
    list.push({ key, label, weekday });
  }
  return list;
}

export function getTimeSlotsForDay(dateKey: string): TimeSlot[] {
  return ALL_TIME_LABELS.map((label) => ({
    id: `${dateKey}-${label}`,
    label,
  }));
}

export function formatBookingDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-');
  return `${y}年${Number(m)}月${Number(d)}日`;
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
