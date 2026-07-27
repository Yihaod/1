/**
 * 短信服务配置（构建/运行时环境变量）
 *
 * EXPO_PUBLIC_SMS_WEBHOOK_URL — 预约成功后 POST 到此地址（必填才可发真实短信）
 * EXPO_PUBLIC_SMS_WEBHOOK_KEY — 可选，与服务端 SMS_WEBHOOK_SECRET 一致
 */
export const smsConfig = {
  webhookUrl: process.env.EXPO_PUBLIC_SMS_WEBHOOK_URL?.trim() ?? '',
  webhookKey: process.env.EXPO_PUBLIC_SMS_WEBHOOK_KEY?.trim() ?? '',
};
