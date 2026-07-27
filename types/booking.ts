export type BookingRecord = {
  id: string;
  partySize: number;
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  phone: string;
  note?: string;
  smsSent?: boolean;
  /** 最近一次确认短信说明（演示或发送结果摘要） */
  smsNotice?: string;
  createdAt: string;
};

export type BookingDraft = {
  partySize: number;
  date: string | null;
  time: string | null;
  serviceId: string | null;
  serviceName: string;
  customerName: string;
  phone: string;
  note: string;
};

export const emptyDraft = (): BookingDraft => ({
  partySize: 2,
  date: null,
  time: null,
  serviceId: null,
  serviceName: '',
  customerName: '',
  phone: '',
  note: '',
});
