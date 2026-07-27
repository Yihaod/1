import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SlotAvailabilityRecord, StaffDutyRecord } from '@/types/admin';

const SLOT_KEY = '@tcm_booking/admin_slot_availability_v1';
const DUTY_KEY = '@tcm_booking/admin_staff_duty_v1';

function slotKey(r: Pick<SlotAvailabilityRecord, 'storeId' | 'date' | 'time'>) {
  return `${r.storeId}|${r.date}|${r.time}`;
}

function dutyKey(staffId: string, date: string) {
  return `${staffId}|${date}`;
}

class AdminSettingsRepository {
  async listSlots(): Promise<SlotAvailabilityRecord[]> {
    const raw = await AsyncStorage.getItem(SLOT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SlotAvailabilityRecord[];
  }

  async getSlotState(
    storeId: string,
    date: string,
    time: string
  ): Promise<SlotAvailabilityRecord | null> {
    const items = await this.listSlots();
    return items.find((s) => slotKey(s) === slotKey({ storeId, date, time })) ?? null;
  }

  async setSlotBlocked(
    storeId: string,
    date: string,
    time: string,
    blocked: boolean
  ): Promise<void> {
    const items = await this.listSlots();
    const key = slotKey({ storeId, date, time });
    const index = items.findIndex((s) => slotKey(s) === key);
    if (blocked) {
      const record: SlotAvailabilityRecord = { storeId, date, time, blocked: true };
      if (index === -1) items.push(record);
      else items[index] = record;
    } else if (index !== -1) {
      items.splice(index, 1);
    }
    await AsyncStorage.setItem(SLOT_KEY, JSON.stringify(items));
  }

  async listBlockedForDay(storeId: string, date: string): Promise<Set<string>> {
    const items = await this.listSlots();
    const set = new Set<string>();
    for (const s of items) {
      if (s.storeId === storeId && s.date === date && s.blocked) set.add(s.time);
    }
    return set;
  }

  async listDuties(): Promise<StaffDutyRecord[]> {
    const raw = await AsyncStorage.getItem(DUTY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StaffDutyRecord[];
  }

  /** 未设置记录时视为上班 */
  async isStaffOnDuty(staffId: string, date: string): Promise<boolean> {
    const items = await this.listDuties();
    const found = items.find((d) => dutyKey(d.staffId, d.date) === dutyKey(staffId, date));
    return found ? found.onDuty : true;
  }

  async setStaffOnDuty(staffId: string, date: string, onDuty: boolean): Promise<void> {
    const items = await this.listDuties();
    const key = dutyKey(staffId, date);
    const index = items.findIndex((d) => dutyKey(d.staffId, d.date) === key);
    const record: StaffDutyRecord = { staffId, date, onDuty };
    if (index === -1) items.push(record);
    else items[index] = record;
    await AsyncStorage.setItem(DUTY_KEY, JSON.stringify(items));
  }
}

export const adminSettingsRepository = new AdminSettingsRepository();
