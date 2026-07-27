import { AppHeader } from '@/components/AppHeader';
import { DatePickerRow } from '@/components/DatePickerRow';
import { PageHero } from '@/components/PageHero';
import { PartySizePicker } from '@/components/PartySizePicker';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { SelectedStoreBar } from '@/components/SelectedStoreBar';
import { TimeSlotGrid } from '@/components/TimeSlotGrid';
import { bookingRules, elevation, palette, radius, spacing } from '@/constants/theme';
import { useBookingDraft } from '@/context/BookingDraftContext';
import { getDayOptions, getTimeSlotsForDay } from '@/data/mockSchedule';
import { getStoreById } from '@/data/stores';
import { adminSettingsRepository } from '@/lib/adminSettingsRepository';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setDraft } = useBookingDraft();
  const params = useLocalSearchParams<{ storeId?: string | string[] }>();
  const rawStoreId = params.storeId;
  const paramStoreId = Array.isArray(rawStoreId) ? rawStoreId[0] : rawStoreId;

  const days = useMemo(() => getDayOptions(), []);
  const [blockedTimes, setBlockedTimes] = useState<Set<string>>(() => new Set());

  const reloadBlocks = useCallback(() => {
    const sid = draft.storeId || paramStoreId;
    const dateKey = draft.date ?? days[0]?.key;
    if (!sid || !dateKey) {
      setBlockedTimes(new Set());
      return;
    }
    adminSettingsRepository.listBlockedForDay(sid, dateKey).then(setBlockedTimes);
  }, [draft.storeId, draft.date, paramStoreId, days]);

  useFocusEffect(
    useCallback(() => {
      reloadBlocks();
    }, [reloadBlocks])
  );

  useEffect(() => {
    reloadBlocks();
  }, [reloadBlocks]);

  useEffect(() => {
    if (draft.time && blockedTimes.has(draft.time)) {
      setDraft((prev) => ({ ...prev, time: null }));
    }
  }, [blockedTimes, draft.time, setDraft]);

  useLayoutEffect(() => {
    if (!paramStoreId) return;
    const store = getStoreById(paramStoreId);
    if (!store) return;
    setDraft((prev) => {
      if (prev.storeId === store.id) return prev;
      return {
        ...prev,
        storeId: store.id,
        storeName: store.name,
        time: null,
        serviceId: null,
        serviceName: '',
      };
    });
  }, [paramStoreId, setDraft]);

  useFocusEffect(
    useCallback(() => {
      const hasStore = Boolean(draft.storeId || paramStoreId);
      if (!hasStore) {
        router.replace('/stores');
        return;
      }
    }, [draft.storeId, paramStoreId, router])
  );

  useEffect(() => {
    if (!draft.date && days[0]) {
      setDraft((prev) => ({ ...prev, date: days[0].key }));
    }
  }, [days, draft.date, setDraft]);

  const slots = useMemo(
    () => (draft.date ? getTimeSlotsForDay(draft.date) : getTimeSlotsForDay(days[0]?.key ?? '')),
    [draft.date, days]
  );

  const canContinue = Boolean(draft.storeId && draft.date && draft.time);

  const onSelectDate = (key: string) => {
    setDraft((prev) => ({ ...prev, date: key, time: null, serviceId: null, serviceName: '' }));
  };

  const activeStore = draft.storeId
    ? getStoreById(draft.storeId)
    : paramStoreId
      ? getStoreById(paramStoreId)
      : undefined;

  if (!activeStore) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={palette.inkGreen} />
      </View>
    );
  }

  return (
    <ScreenShell bottomInset={insets.bottom + spacing.lg}>
      <AppHeader />
      <PageHero compact />

      <SelectedStoreBar storeName={activeStore.name} />

      <View style={[styles.card, elevation.card]}>
        <SectionHeader icon="calendar-outline" title={bookingRules.cardTitle} showDivider={false} />

        <SectionHeader icon="people-outline" title={bookingRules.partyQuestion} />
        <PartySizePicker
          value={draft.partySize}
          onChange={(partySize) => setDraft((prev) => ({ ...prev, partySize }))}
        />

        <SectionHeader icon="calendar-outline" title={bookingRules.dateLabel} />
        <DatePickerRow days={days} selectedKey={draft.date} onSelect={onSelectDate} />

        <SectionHeader icon="time-outline" title={bookingRules.timeLabel} />
        <Text style={styles.timeHint}>时段较多，可在此区域上下滑动</Text>
        <TimeSlotGrid
          slots={slots}
          selectedTime={draft.time}
          disabledLabels={blockedTimes}
          onSelect={(time) => setDraft((prev) => ({ ...prev, time }))}
        />

        <View style={styles.cardFooter}>
          <PrimaryButton
            label="继续预约"
            disabled={!canContinue}
            onPress={() => router.push('/services')}
          />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.xl + 2,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  cardFooter: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.borderLight,
  },
  timeHint: {
    fontSize: 12,
    color: palette.textSoft,
    marginBottom: spacing.sm,
    marginTop: -4,
  },
});
