import { AdminStorePicker } from '@/components/admin/AdminStorePicker';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { DatePickerRow } from '@/components/DatePickerRow';
import { useAdminStore } from '@/context/AdminStoreContext';
import { getDayOptions, getAllTimeLabels } from '@/data/mockSchedule';
import { adminSettingsRepository } from '@/lib/adminSettingsRepository';
import { merchantRoutes } from '@/constants/routes';
import { elevation, palette, radius, spacing } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { storeId } = useAdminStore();
  const days = useMemo(() => getDayOptions(14), []);
  const [date, setDate] = useState(days[0]?.key ?? '');
  const [blocked, setBlocked] = useState<Set<string>>(new Set());

  const reload = useCallback(() => {
    if (!storeId || !date) return;
    adminSettingsRepository.listBlockedForDay(storeId, date).then(setBlocked);
  }, [storeId, date]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const toggleSlot = async (time: string) => {
    const isBlocked = blocked.has(time);
    await adminSettingsRepository.setSlotBlocked(storeId, date, time, !isBlocked);
    reload();
  };

  const times = getAllTimeLabels();

  return (
    <View style={styles.safe}>
      <AdminTopBar title="预约排期" subtitle="Block / Unblock 时段" backHref={merchantRoutes.home} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <AdminStorePicker />
        <Text style={styles.hint}>点击时段切换「可预约 / 已 Block」；顾客端接入后将同步不可选。</Text>

        <Text style={styles.sectionLabel}>选择日期</Text>
        <DatePickerRow days={days} selectedKey={date} onSelect={setDate} />

        <View style={[styles.gridCard, elevation.card]}>
          <Text style={styles.sectionLabel}>当日时段</Text>
          <View style={styles.grid}>
            {times.map((time) => {
              const isBlocked = blocked.has(time);
              return (
                <Pressable
                  key={time}
                  onPress={() => toggleSlot(time)}
                  style={[styles.slot, isBlocked && styles.slotBlocked]}
                  accessibilityRole="button"
                  accessibilityLabel={`${time} ${isBlocked ? '已 Block' : '可预约'}`}
                >
                  <Text style={[styles.slotTime, isBlocked && styles.slotTimeBlocked]}>{time}</Text>
                  <Text style={styles.slotStatus}>{isBlocked ? 'Block' : '可约'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  hint: { fontSize: 12, lineHeight: 18, color: palette.textSoft, marginBottom: spacing.md },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSoft,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  gridCard: {
    marginTop: spacing.md,
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    width: '31%',
    minWidth: 96,
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.jadeLight,
    backgroundColor: palette.jadeMist,
    alignItems: 'center',
  },
  slotBlocked: {
    backgroundColor: '#FFF5F3',
    borderColor: '#E8C4BC',
  },
  slotTime: { fontSize: 15, fontWeight: '700', color: palette.inkGreen },
  slotTimeBlocked: { color: palette.cinnabar },
  slotStatus: { fontSize: 11, color: palette.textSoft, marginTop: 4 },
});
