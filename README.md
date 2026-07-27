# 中医馆预约 App（MVP）

30 秒内完成预约：**选店 → 人数 → 日期 → 时间 → 项目 → 联系方式 → 成功**。

**商家管理**为独立项目，见 [`merchant-app/README.md`](merchant-app/README.md)。

## 启动（顾客端）

```bash
cd ~/Projects/service-booking-app/service-booking-app
npm install
npx expo start
```

- 按 `i` / `a` 打开模拟器，或 **Expo Go** 扫码  
- Web 预览：`npx expo start --web`（默认 **8081**）  
- 类型检查：`npm run typecheck`

## 线上演示

| 端 | 地址 |
|----|------|
| 顾客端 | https://yihaod.github.io/1/ |
| 商家端 | https://yihaod.github.io/1/merchant/ |

## 页面

1. **预约首页** — 人数（1–6）、日期、时间（10:00–21:00 每半小时）、底部「继续预约」  
2. **联系方式** — 姓名、手机号、备注  
3. **预约成功** — 摘要、**自动发送确认短信**（可配置 Webhook）、修改预约、返回首页  

## 短信

确认预约后会自动发送确认短信。默认演示模式；接入阿里云/腾讯云见 **`docs/SMS.md`**。

## 结构（便于接 Supabase）

- `data/mockSchedule.ts` — 模拟排期  
- `lib/bookingRepository.ts` — 本地存储，可替换为远程 API  
- `types/booking.ts` — 数据类型  
- `components/` — 人数 / 日期 / 时间 / 摘要 / 主按钮  

## 设计 token

背景 `#F6F2E9` · 墨绿 `#173D35` · 玉石 `#79A995` · 文字 `#252A28` · 朱砂 `#B85C4A`

馆名与文案见 `constants/theme.ts` 中的 `bookingRules`。
