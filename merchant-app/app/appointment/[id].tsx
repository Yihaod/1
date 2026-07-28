import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { BookingSummaryCard } from '@/components/BookingSummaryCard';
import { merchantRoutes } from '@/constants/routes';
import { elevation, palette, radius, spacing } from '@/constants/theme';
import { formatBookingDate } from '@/data/mockSchedule';
import { subscribeBookingsChanged } from '@/lib/bookingChangeBus';
import { isBookingActive } from '@/lib/bookingStatus';
import { bookingRepository } from '@/lib/bookingRepository';
import { formatPhoneDisplay } from '@/lib/phone';
import type { BookingRecord } from '@/types/booking';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function AppointmentDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const bookingId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    bookingRepository.getById(bookingId).then((record) => {
      setBooking(record);
      setLoading(false);
    });
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;
    return subscribeBookingsChanged(() => {
      bookingRepository.getById(bookingId).then((record) => {
        if (record) setBooking(record);
      });
    });
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.safe}>
        <AdminTopBar title="预约详情" backHref={merchantRoutes.appointments} />
        <ActivityIndicator color={palette.inkGreen} style={styles.loader} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.safe}>
        <AdminTopBar title="预约详情" backHref={merchantRoutes.appointments} />
        <Text style={styles.empty}>未找到该预约，可能已被删除或不在本机记录中</Text>
      </View>
    );
  }

  const active = isBookingActive(booking);

  return (
    <View style={styles.safe}>
      <AdminTopBar
        title="预约详情"
        subtitle={formatBookingDate(booking.date)}
        backHref={merchantRoutes.appointments}
      />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statusChip, active ? styles.statusActive : styles.statusCancelled]}>
          <Text style={[styles.statusText, !active && styles.statusTextCancelled]}>
            {active ? '已确认' : '已取消'}
          </Text>
        </View>

        <BookingSummaryCard
          storeName={booking.storeName}
          partySize={booking.partySize}
          date={booking.date}
          time={booking.time}
          serviceName={booking.serviceName}
          customerName={booking.customerName}
          gender={booking.gender}
          bookingId={booking.id}
        />

        <View style={[styles.extraCard, elevation.card]}>
          <Text style={styles.extraTitle}>联系与备注</Text>
          <DetailRow label="手机号" value={formatPhoneDisplay(booking.phone)} />
          {booking.note ? (
            <DetailRow label="备注" value={booking.note} />
          ) : (
            <Text style={styles.noNote}>无备注</Text>
          )}
        </View>

        <View style={[styles.extraCard, elevation.card]}>
          <Text style={styles.extraTitle}>记录</Text>
          <DetailRow
            label="提交时间"
            value={new Date(booking.createdAt).toLocaleString('zh-CN', { hour12: false })}
          />
          {booking.cancelledAt ? (
            <DetailRow
              label="取消时间"
              value={new Date(booking.cancelledAt).toLocaleString('zh-CN', { hour12: false })}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.lg },
  loader: { marginTop: 80 },
  empty: { textAlign: 'center', color: palette.textSoft, marginTop: 80, paddingHorizontal: spacing.lg },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  statusActive: { backgroundColor: palette.jadeMist },
  statusCancelled: { backgroundColor: '#FFF5F3' },
  statusText: { fontSize: 13, fontWeight: '700', color: palette.inkGreen },
  statusTextCancelled: { color: palette.cinnabar },
  extraCard: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  extraTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSoft,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: 6,
  },
  detailLabel: { fontSize: 14, color: palette.textMuted },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  noNote: { fontSize: 14, color: palette.textSoft, paddingVertical: 4 },
});
