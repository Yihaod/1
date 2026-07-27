import { AppHeader } from '@/components/AppHeader';
import { DatePickerRow } from '@/components/DatePickerRow';
import { PageHero } from '@/components/PageHero';
import { PartySizePicker } from '@/components/PartySizePicker';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { TimeSlotGrid } from '@/components/TimeSlotGrid';
import { bookingRules, elevation, palette, radius, spacing } from '@/constants/theme';
import { useBookingDraft } from '@/context/BookingDraftContext';
import { getDayOptions, getTimeSlotsForDay } from '@/data/mockSchedule';
import { bookingRepository } from '@/lib/bookingRepository';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookingHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setDraft } = useBookingDraft();
  const [latestBookingId, setLatestBookingId] = useState<string | null>(null);

  const days = useMemo(() => getDayOptions(), []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      bookingRepository.list().then((items) => {
        if (!cancelled) setLatestBookingId(items[0]?.id ?? null);
      });
      return () => {
        cancelled = true;
      };
    }, [])
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

  const canContinue = Boolean(draft.date && draft.time);

  const onSelectDate = (key: string) => {
    setDraft((prev) => ({ ...prev, date: key, time: null, serviceId: null, serviceName: '' }));
  };

  return (
    <ScreenShell bottomInset={insets.bottom + spacing.lg}>
      <AppHeader />
      <PageHero />

      {latestBookingId ? (
        <View style={styles.myBookingWrap}>
          <PrimaryButton
            label="查看我的预约"
            variant="secondary"
            onPress={() =>
              router.push(`/success?id=${encodeURIComponent(latestBookingId)}`)
            }
          />
        </View>
      ) : null}

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
  myBookingWrap: {
    marginBottom: spacing.lg,
  },
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
