import { Redirect } from 'expo-router';

/** 旧链接 /stores 重定向到首页选店 */
export default function StoresRedirect() {
  return <Redirect href="/" />;
}
