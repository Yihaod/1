/** 服务人员（占位；后续可由管理端维护或接 API） */
export type StaffMember = {
  id: string;
  storeId: string;
  name: string;
  role: string;
};

/** 某门店某日某时段是否可预约 */
export type SlotAvailabilityRecord = {
  storeId: string;
  date: string;
  time: string;
  /** true = 已 Block，不可预约 */
  blocked: boolean;
};

/** 服务人员上班状态（按日；未设置则默认上班） */
export type StaffDutyRecord = {
  staffId: string;
  date: string;
  onDuty: boolean;
};

export type SlotBookableState = 'open' | 'blocked';
