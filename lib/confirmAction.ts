import { Alert, Platform } from 'react-native';

/** Web 上 Alert 多按钮不可靠，取消预约等操作用此确认 */
export function confirmAction(
  title: string,
  message: string,
  confirmLabel = '确认',
  cancelLabel = '再想想'
): Promise<boolean> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const ok = window.confirm(`${title}\n\n${message}`);
    return Promise.resolve(ok);
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
