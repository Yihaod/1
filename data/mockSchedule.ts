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

export function getDayOptions(count = 14, anchor: Date = new Date()): DayOption[] {
  const today = new Date(anchor);
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

/** 本地日历 YYYY-MM-DD */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getTodayDateKey(now = new Date()): string {
  return toDateKey(now);
}

/** 某时段开始时间是否已过去（仅当 dateKey 为「今天」时有意义） */
export function isSlotInPast(dateKey: string, timeLabel: string, now = new Date()): boolean {
  if (dateKey !== getTodayDateKey(now)) return false;
  const [y, m, d] = dateKey.split('-').map(Number);
  const [hh, mm] = timeLabel.split(':').map(Number);
  const slotStart = new Date(y, m - 1, d, hh, mm, 0, 0);
  return slotStart.getTime() <= now.getTime();
}

export function getPastTimeLabelsForDay(dateKey: string, now = new Date()): Set<string> {
  const set = new Set<string>();
  if (dateKey !== getTodayDateKey(now)) return set;
  for (const label of ALL_TIME_LABELS) {
    if (isSlotInPast(dateKey, label, now)) set.add(label);
  }
  return set;
}
