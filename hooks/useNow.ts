import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

/** 预约页需要随真实时间刷新「今天」可选时段 */
export function useNow(tickMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  const refresh = useCallback(() => {
    setNow(new Date());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, tickMs);
    return () => clearInterval(id);
  }, [refresh, tickMs]);

  return now;
}
