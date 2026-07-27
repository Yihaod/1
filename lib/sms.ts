import { bookingRules } from '@/constants/theme';
import { smsConfig } from '@/constants/config';
import { formatBookingDate } from '@/data/mockSchedule';
import type { BookingRecord } from '@/types/booking';

export type SmsSendResult = {
  ok: boolean;
  /** 是否未配置 Webhook、仅本地模拟 */
  simulated: boolean;
  userMessage: string;
};

export function buildConfirmationSmsText(booking: BookingRecord): string {
  const dateText = formatBookingDate(booking.date);
  return `【${bookingRules.brandLabel}】${booking.customerName}您好，预约已确认：${dateText} ${booking.time}，${booking.partySize}人，项目：${booking.serviceName}。预约号${booking.id}。如需改期请联系馆里。`;
}

/**
 * 预约成功后自动发送确认短信。
 * 真实发送需在服务端接阿里云/腾讯云等，并配置 EXPO_PUBLIC_SMS_WEBHOOK_URL。
 */
export async function sendBookingConfirmationSms(
  booking: BookingRecord
): Promise<SmsSendResult> {
  const message = buildConfirmationSmsText(booking);
  const phone = booking.phone.trim();

  if (!smsConfig.webhookUrl) {
    if (__DEV__) {
      console.info('[SMS 演示]', phone, message);
    }
    return {
      ok: true,
      simulated: true,
      userMessage: '演示环境：已模拟发送。配置 EXPO_PUBLIC_SMS_WEBHOOK_URL 后，将真实发送到您填写的手机号。',
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (smsConfig.webhookKey) {
      headers['X-Webhook-Key'] = smsConfig.webhookKey;
    }

    const res = await fetch(smsConfig.webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone,
        message,
        bookingId: booking.id,
        customerName: booking.customerName,
        partySize: booking.partySize,
        date: booking.date,
        time: booking.time,
        serviceId: booking.serviceId,
        serviceName: booking.serviceName,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return {
        ok: false,
        simulated: false,
        userMessage: `预约已保存，但短信发送失败${detail ? `（${detail.slice(0, 80)}）` : ''}。请截图预约号或致电馆里确认。`,
      };
    }

    return {
      ok: true,
      simulated: false,
      userMessage: `确认短信已发送至 ${phone}`,
    };
  } catch {
    return {
      ok: false,
      simulated: false,
      userMessage: `预约已保存，短信因网络原因未发出。请保留预约号 ${booking.id}，或联系馆里确认。`,
    };
  }
}
