import { subscribeBookingsChanged } from '@/lib/bookingChangeBus';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

/** 预约列表变更时递增，用于跨标签页同步商家端 / 顾客端 */
export function useBookingsRevision(): number {
  const [revision, setRevision] = useState(0);

  const bump = useCallback(() => {
    setRevision((n) => n + 1);
  }, []);

  useEffect(() => subscribeBookingsChanged(bump), [bump]);

  useFocusEffect(
    useCallback(() => {
      bump();
    }, [bump])
  );

  return revision;
}
