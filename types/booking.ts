export type CustomerGender = 'male' | 'female' | null;

export type BookingRecord = {
  id: string;
  storeId?: string;
  storeName?: string;
  partySize: number;
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  /** 选填，便于称呼与服务安排 */
  gender?: CustomerGender;
  phone: string;
  note?: string;
  smsSent?: boolean;
  /** 最近一次确认短信说明（演示或发送结果摘要） */
  smsNotice?: string;
  createdAt: string;
};

export type BookingDraft = {
  storeId: string | null;
  storeName: string;
  partySize: number;
  date: string | null;
  time: string | null;
  serviceId: string | null;
  serviceName: string;
  customerName: string;
  gender: CustomerGender;
  phone: string;
  note: string;
};

export const emptyDraft = (): BookingDraft => ({
  storeId: null,
  storeName: '',
  partySize: 2,
  date: null,
  time: null,
  serviceId: null,
  serviceName: '',
  customerName: '',
  gender: null,
  phone: '',
  note: '',
});
