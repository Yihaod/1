import { AdminStorePicker } from '@/components/admin/AdminStorePicker';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { DatePickerRow } from '@/components/DatePickerRow';
import { useAdminStore } from '@/context/AdminStoreContext';
import { getStaffByStore } from '@/data/staff';
import { getDayOptions } from '@/data/mockSchedule';
import { adminSettingsRepository } from '@/lib/adminSettingsRepository';
import { merchantRoutes } from '@/constants/routes';
import { elevation, palette, radius, spacing } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminStaffScreen() {
  const insets = useSafeAreaInsets();
  const { storeId } = useAdminStore();
  const days = useMemo(() => getDayOptions(14), []);
  const [date, setDate] = useState(days[0]?.key ?? '');
  const [dutyMap, setDutyMap] = useState<Record<string, boolean>>({});

  const staff = useMemo(() => getStaffByStore(storeId), [storeId]);

  const reload = useCallback(async () => {
    const next: Record<string, boolean> = {};
    for (const member of staff) {
      next[member.id] = await adminSettingsRepository.isStaffOnDuty(member.id, date);
    }
    setDutyMap(next);
  }, [staff, date]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const toggleDuty = async (staffId: string, onDuty: boolean) => {
    await adminSettingsRepository.setStaffOnDuty(staffId, date, onDuty);
    setDutyMap((prev) => ({ ...prev, [staffId]: onDuty }));
  };

  return (
    <View style={styles.safe}>
      <AdminTopBar title="服务人员" subtitle="设置是否上班（按日）" backHref={merchantRoutes.home} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <AdminStorePicker />
        <Text style={styles.hint}>人员姓名、岗位为占位数据，可在 data/staff.ts 中修改。</Text>

        <Text style={styles.sectionLabel}>选择日期</Text>
        <DatePickerRow days={days} selectedKey={date} onSelect={setDate} />

        {staff.map((member) => {
          const onDuty = dutyMap[member.id] ?? true;
          return (
            <View key={member.id} style={[styles.card, elevation.card]}>
              <View style={styles.cardBody}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.role}>{member.role}</Text>
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>{onDuty ? '上班' : '休息'}</Text>
                <Switch
                  value={onDuty}
                  onValueChange={(v) => toggleDuty(member.id, v)}
                  trackColor={{ false: palette.border, true: palette.jadeLight }}
                  thumbColor={onDuty ? palette.inkGreen : palette.card}
                />
              </View>
            </View>
          );
        })}

        {staff.length === 0 ? (
          <Text style={styles.empty}>该门店暂无服务人员配置</Text>
        ) : null}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardBody: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: palette.inkGreen },
  role: { fontSize: 13, color: palette.textSoft, marginTop: 4 },
  switchRow: { alignItems: 'flex-end', gap: 4 },
  switchLabel: { fontSize: 12, color: palette.textMuted },
  empty: { textAlign: 'center', color: palette.textSoft, marginTop: spacing.xl },
});
