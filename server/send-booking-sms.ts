/**
 * 预约确认短信 Webhook（示例）
 *
 * 部署到 Vercel / 云函数后，在 App 中设置：
 *   EXPO_PUBLIC_SMS_WEBHOOK_URL=https://你的域名/api/send-booking-sms
 *   EXPO_PUBLIC_SMS_WEBHOOK_KEY=与下方 SMS_WEBHOOK_SECRET 相同（可选）
 *
 * 环境变量（服务端）：
 *   SMS_WEBHOOK_SECRET — 校验 X-Webhook-Key
 *   ALIYUN_ACCESS_KEY_ID / ALIYUN_ACCESS_KEY_SECRET / ALIYUN_SMS_SIGN / ALIYUN_SMS_TEMPLATE_CODE
 *   若未配置阿里云，则仅 console.log 并返回 200（便于联调）
 */

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Key',
};

interface BookingSmsBody {
  phone?: string;
  message?: string;
  bookingId?: string;
}

export default async function handler(req: {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: BookingSmsBody | string;
}): Promise<{ statusCode: number; headers: Record<string, string>; body: string }> {
  if (req.method === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (req.method !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  const secret = process.env.SMS_WEBHOOK_SECRET;
  if (secret) {
    const key = req.headers['x-webhook-key'];
    if (key !== secret) {
      return { statusCode: 401, headers: cors, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
  }

  const payload =
    typeof req.body === 'string' ? (JSON.parse(req.body) as BookingSmsBody) : req.body ?? {};
  const phone = payload.phone?.trim();
  const message = payload.message?.trim();

  if (!phone || !/^1\d{10}$/.test(phone) || !message) {
    return {
      statusCode: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid phone or message' }),
    };
  }

  const sent = await dispatchSms(phone, message, payload.bookingId);

  return {
    statusCode: sent ? 200 : 502,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: sent, phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }),
  };
}

async function dispatchSms(phone: string, message: string, bookingId?: string): Promise<boolean> {
  const {
    ALIYUN_ACCESS_KEY_ID,
    ALIYUN_ACCESS_KEY_SECRET,
    ALIYUN_SMS_SIGN,
    ALIYUN_SMS_TEMPLATE_CODE,
  } = process.env;

  if (!ALIYUN_ACCESS_KEY_ID || !ALIYUN_ACCESS_KEY_SECRET) {
    console.log('[SMS stub]', { phone, bookingId, message });
    return true;
  }

  // 生产环境请接入 @alicloud/dysmsapi20170525，用模板变量传递 date/time 等
  // 此处保留占位，避免在未安装 SDK 的示例中引入依赖
  console.log('[SMS Aliyun placeholder]', {
    phone,
    sign: ALIYUN_SMS_SIGN,
    template: ALIYUN_SMS_TEMPLATE_CODE,
    bookingId,
  });
  return true;
}
