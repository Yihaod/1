import type { Href } from 'expo-router';

/** Web 上 router.back() 常无效，子页面请显式指定返回目标 */
export const merchantRoutes = {
  home: '/' as Href,
  appointments: '/appointments' as Href,
  appointmentDetail: (id: string) => `/appointment/${encodeURIComponent(id)}` as Href,
};
