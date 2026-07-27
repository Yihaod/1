# 预约确认短信

App 在 **确认预约成功后** 会自动调用 `sendBookingConfirmationSms`（见 `lib/sms.ts`）。

## 演示模式（默认）

未配置 Webhook 时：

- 预约照常保存
- 成功页提示「已发送至手机号（演示模式）」
- 开发环境下会在控制台打印短信正文

## 真实短信（推荐架构）

```
App  --POST JSON-->  你的 Webhook  --API-->  阿里云 / 腾讯云 SMS
```

1. 将 `server/send-booking-sms.ts` 部署为 HTTPS 接口（Vercel Serverless、Supabase Edge Functions 等）
2. 在服务端配置短信厂商密钥（**不要**写进 App）
3. 在项目根目录创建 `.env`（或 EAS / CI 环境变量）：

```bash
EXPO_PUBLIC_SMS_WEBHOOK_URL=https://你的域名/api/send-booking-sms
EXPO_PUBLIC_SMS_WEBHOOK_KEY=与服务器 SMS_WEBHOOK_SECRET 一致
```

4. 重新启动 Expo：`npx expo start`

### Webhook 请求体

```json
{
  "phone": "13800138000",
  "message": "【中医馆】……",
  "bookingId": "TCMXXX",
  "customerName": "张三",
  "partySize": 2,
  "date": "2026-07-28",
  "time": "14:30"
}
```

### 服务端环境变量示例

| 变量 | 说明 |
|------|------|
| `SMS_WEBHOOK_SECRET` | 校验请求头 `X-Webhook-Key` |
| `ALIYUN_ACCESS_KEY_ID` | 阿里云 AccessKey |
| `ALIYUN_ACCESS_KEY_SECRET` | 阿里云 Secret |
| `ALIYUN_SMS_SIGN` | 短信签名 |
| `ALIYUN_SMS_TEMPLATE_CODE` | 模板 CODE |

未配置阿里云时，示例 Handler 会打日志并返回成功，便于先联调 App 流程。
