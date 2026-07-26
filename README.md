# 易预约 · 通用服务预约 App

Expo（React Native）打造的**多分类服务预约**演示应用，支持 iOS / Android 一套代码运行。当前为 **v1 原型**：本地演示数据 + 本机保存预约记录，便于产品验证流程后再接登录、支付与后端。

## 功能

| 模块 | 说明 |
|------|------|
| 首页 | 搜索、分类入口、推荐服务列表 |
| 分类 | 美业 / 到家 / 健康 / 运动 / 宠物等 |
| 服务详情 | 价格、时长、评价、立即预约 |
| 预约 | 选日期与时段、填写联系人、提交 |
| 我的预约 | 列表、状态（待确认/已确认/已完成/已取消）、取消 |
| 我的 | 简单统计与说明 |

## 环境要求

- [Node.js](https://nodejs.org/) 18+（本机当前若未安装，请先安装）
- iOS：Xcode 或 **Expo Go** App  
- Android：**Expo Go** 或 Android Studio 模拟器  

## 运行

```bash
cd ~/Projects/service-booking-app
npm install
npx expo start
```

终端里按 `i` 打开 iOS 模拟器，按 `a` 打开 Android，或扫码用 **Expo Go** 在真机预览。

## 在线部署（Web）

推送到 `main` 后，GitHub Actions 会自动构建并发布 **GitHub Pages**。

1. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**
2. Actions 成功后访问：**https://yihaod.github.io/1/**

本地构建：`npm run build:web`（输出 `dist/`）

## 项目结构

```
app/                 # 页面（Expo Router）
  (tabs)/            # 底部 Tab：首页 / 预约 / 我的
  service/[id].tsx   # 服务详情
  book/[id].tsx      # 预约表单
  category/[id].tsx  # 分类列表
components/          # UI 组件
data/services.ts     # 演示服务与时段数据
lib/bookings.ts      # AsyncStorage 预约存储
context/             # 预约列表刷新
```

## 后续可扩展

- 用户登录（手机号 / 微信）
- Supabase 或自建 API：商家端、库存与排班
- 支付（微信 / 支付宝）
- 推送：预约提醒、状态变更
- 地图与 LBS：附近商家

## 修改演示数据

编辑 `data/services.ts` 中的 `categories` 与 `services` 即可增删分类和服务。
