/** 顾客预约 App 地址（Web 演示可同源 /1/） */
export function getConsumerAppUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_CONSUMER_URL;
  if (fromEnv) return fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`;

  if (typeof window !== 'undefined' && window.location?.origin) {
    const { origin, pathname } = window.location;
    if (pathname.includes('/merchant')) {
      const base = pathname.split('/merchant')[0];
      return `${origin}${base}${base.endsWith('/') ? '' : '/'}`.replace(/\/+$/, '/') || `${origin}/`;
    }
    return `${origin}/`;
  }

  return 'http://localhost:8081/';
}
