import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { clinicStores } from '@/data/stores';
import { isBookingActive, isBookingCancelled } from '@/lib/bookingStatus';
import { bookingRepository } from '@/lib/bookingRepository';
import { elevation, palette, radius, spacing } from '@/constants/theme';
import type { BookingRecord } from '@/types/booking';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookingsRevision } from '@/hooks/useBookingsRevision';

function summarize(records: BookingRecord[]) {
  const active = records.filter(isBookingActive);
  const cancelled = records.filter(isBookingCancelled);
  const todayKey = new Date().toISOString().slice(0, 10);
  const today = active.filter((b) => b.date === todayKey);

  const byStore: Record<string, number> = {};
  const byService: Record<string, number> = {};
  for (const b of active) {
    const sid = b.storeId ?? 'unknown';
    byStore[sid] = (byStore[sid] ?? 0) + 1;
    byService[b.serviceName] = (byService[b.serviceName] ?? 0) + 1;
  }

  return {
    totalActive: active.length,
    totalCancelled: cancelled.length,
    todayCount: today.length,
    byStore,
    byService,
  };
}

export default function AdminAnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState(() => summarize([]));
  const bookingsRevision = useBookingsRevision();

  useFocusEffect(
    useCallback(() => {
      bookingRepository.list().then((items) => setStats(summarize(items)));
    }, [bookingsRevision])
  );

  return (
    <View style={styles.safe}>
      <AdminTopBar title="数据概览" subtitle="基础预约与经营摘要" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.hint}>基于本机演示数据统计；上线后接报表服务可扩展。</Text>

        <View style={styles.kpiRow}>
          <View style={[styles.kpi, elevation.card]}>
            <Text style={styles.kpiValue}>{stats.totalActive}</Text>
            <Text style={styles.kpiLabel}>有效预约</Text>
          </View>
          <View style={[styles.kpi, elevation.card]}>
            <Text style={styles.kpiValue}>{stats.todayCount}</Text>
            <Text style={styles.kpiLabel}>今日到店预约</Text>
          </View>
          <View style={[styles.kpi, elevation.card]}>
            <Text style={styles.kpiValue}>{stats.totalCancelled}</Text>
            <Text style={styles.kpiLabel}>已取消</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>按门店（有效预约）</Text>
        <View style={[styles.listCard, elevation.card]}>
          {clinicStores.map((store) => (
            <View key={store.id} style={styles.listRow}>
              <Text style={styles.listLabel}>{store.name}</Text>
              <Text style={styles.listValue}>{stats.byStore[store.id] ?? 0}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>按项目（有效预约）</Text>
        <View style={[styles.listCard, elevation.card]}>
          {Object.keys(stats.byService).length === 0 ? (
            <Text style={styles.empty}>暂无数据</Text>
          ) : (
            Object.entries(stats.byService).map(([name, count]) => (
              <View key={name} style={styles.listRow}>
                <Text style={styles.listLabel}>{name}</Text>
                <Text style={styles.listValue}>{count}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  hint: { fontSize: 12, lineHeight: 18, color: palette.textSoft, marginBottom: spacing.lg },
  kpiRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  kpi: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  kpiValue: { fontSize: 24, fontWeight: '800', color: palette.inkGreen },
  kpiLabel: { fontSize: 11, color: palette.textSoft, marginTop: 6, textAlign: 'center' },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.inkGreenMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  listCard: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderLight,
  },
  listLabel: { fontSize: 15, color: palette.textMuted },
  listValue: { fontSize: 16, fontWeight: '700', color: palette.inkGreen },
  empty: { textAlign: 'center', color: palette.textSoft, paddingVertical: spacing.md },
});
