# 中医馆商家管理端

门店排期、服务人员、预约查看与数据概览。**独立 App**，与顾客预约端分开安装/部署。

## 启动

```bash
cd merchant-app
npm install
npm start
```

- Web：`npm run web` → 默认 **http://localhost:8082**
- 类型检查：`npm run typecheck`

顾客端请在仓库根目录另开终端运行（**8081**），两端的 Block 时段与预约数据在同域名下通过浏览器本地存储互通（演示用）。

## 线上地址（GitHub Pages）

- 商家端：`https://yihaod.github.io/1/merchant/`
- 顾客端：`https://yihaod.github.io/1/`

首页「返回顾客端」会跳转到顾客端；构建时可设 `EXPO_PUBLIC_CONSUMER_URL` 覆盖。

## 配置

- 门店：`data/stores.ts`（与顾客端保持一致）
- 服务人员占位：`data/staff.ts`
- 设计 token：`constants/theme.ts`
