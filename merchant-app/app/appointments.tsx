import { AdminStorePicker } from '@/components/admin/AdminStorePicker';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { DatePickerRow } from '@/components/DatePickerRow';
import { formatCustomerDisplayName } from '@/lib/gender';
import { isBookingActive } from '@/lib/bookingStatus';
import { bookingRepository } from '@/lib/bookingRepository';
import { useAdminStore } from '@/context/AdminStoreContext';
import { formatBookingDate, getDayOptions } from '@/data/mockSchedule';
import { merchantRoutes } from '@/constants/routes';
import { elevation, palette, radius, spacing } from '@/constants/theme';
import type { BookingRecord } from '@/types/booking';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookingsRevision } from '@/hooks/useBookingsRevision';

export default function AdminAppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const { storeId } = useAdminStore();
  const days = useMemo(() => getDayOptions(14), []);
  const [date, setDate] = useState(days[0]?.key ?? '');
  const [items, setItems] = useState<BookingRecord[]>([]);
  const bookingsRevision = useBookingsRevision();

  const reload = useCallback(() => {
    bookingRepository.list().then((all) => {
      const filtered = all.filter(
        (b) =>
          (b.storeId === storeId || (!b.storeId && storeId === 'store-1')) &&
          b.date === date
      );
      setItems(filtered);
    });
  }, [storeId, date]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload, bookingsRevision])
  );

  return (
    <View style={styles.safe}>
      <AdminTopBar title="每日预约" subtitle="按门店与日期查看" backHref={merchantRoutes.home} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <AdminStorePicker />
        <Text style={styles.hint}>
          与顾客端同浏览器时会自动同步；新开预约、修改或取消后列表会自动刷新。
        </Text>

        <Text style={styles.sectionLabel}>选择日期</Text>
        <DatePickerRow days={days} selectedKey={date} onSelect={setDate} />

        <Text style={styles.count}>
          共 {items.length} 条 · {formatBookingDate(date)}
        </Text>

        {items.map((b) => {
          const active = isBookingActive(b);
          const detailHref = merchantRoutes.appointmentDetail(b.id);
          return (
            <View key={b.id} style={[styles.card, elevation.card]}>
              <View style={styles.cardHeader}>
                <Text style={styles.time}>{b.time}</Text>
                <Text style={[styles.badge, !active && styles.badgeCancelled]}>
                  {active ? '已确认' : '已取消'}
                </Text>
              </View>
              <Text style={styles.line}>
                {formatCustomerDisplayName(b.customerName, b.gender)} · {b.partySize} 人
              </Text>
              <Text style={styles.line}>{b.serviceName}</Text>
              <Text style={styles.meta}>编号 {b.id}</Text>
              <Link href={detailHref} asChild>
                <Pressable
                  style={({ pressed }) => [styles.detailBtn, pressed && styles.cardPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`查看 ${b.time} 预约详情`}
                >
                  <Text style={styles.detailBtnText}>查看预约信息</Text>
                  <Ionicons name="chevron-forward" size={18} color={palette.inkGreen} />
                </Pressable>
              </Link>
            </View>
          );
        })}

        {items.length === 0 ? (
          <Text style={styles.empty}>
            该日暂无预约。请左右切换日期（须与顾客预约的到店日一致），或在顾客端完成预约后再查看。
          </Text>
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
  count: { fontSize: 14, fontWeight: '600', color: palette.inkGreen, marginVertical: spacing.md },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPressed: { opacity: 0.92 },
  detailBtn: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: palette.jadeMist,
    borderWidth: 1,
    borderColor: palette.jadeLight,
  },
  detailBtnText: { fontSize: 15, fontWeight: '700', color: palette.inkGreen },
  time: { fontSize: 20, fontWeight: '800', color: palette.inkGreen },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.inkGreen,
    backgroundColor: palette.jadeMist,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeCancelled: { color: palette.cinnabar, backgroundColor: '#FFF5F3' },
  line: { fontSize: 15, color: palette.text, marginTop: 8 },
  meta: { fontSize: 12, color: palette.textSoft, marginTop: 8 },
  empty: { textAlign: 'center', color: palette.textSoft, marginTop: spacing.xl },
});
