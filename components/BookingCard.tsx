import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Booking, statusLabels } from '@/lib/bookings';
import { formatPrice } from '@/data/services';
import { colors, radius, spacing } from '@/constants/theme';

const statusColors: Record<Booking['status'], string> = {
  pending: colors.warning,
  confirmed: colors.primary,
  completed: colors.success,
  cancelled: colors.textSecondary,
};

type Props = {
  booking: Booking;
  onCancel?: () => void;
};

export function BookingCard({ booking, onCancel }: Props) {
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.serviceName}>{booking.serviceName}</Text>
        <View style={[styles.badge, { backgroundColor: `${statusColors[booking.status]}18` }]}>
          <Text style={[styles.badgeText, { color: statusColors[booking.status] }]}>
            {statusLabels[booking.status]}
          </Text>
        </View>
      </View>
      <Text style={styles.provider}>{booking.provider}</Text>
      <View style={styles.row}>
        <Text style={styles.meta}>
          {booking.date} · {booking.time}
        </Text>
        <Text style={styles.price}>{formatPrice(booking.priceCents)}</Text>
      </View>
      <Text style={styles.contact}>
        {booking.customerName} · {booking.customerPhone}
      </Text>
      {booking.note ? <Text style={styles.note}>备注：{booking.note}</Text> : null}
      {canCancel && onCancel ? (
        <Pressable onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>取消预约</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceName: { fontSize: 16, fontWeight: '700', color: colors.text, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm },
  badgeText: { fontSize: 11, fontWeight: '700' },
  provider: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  meta: { fontSize: 14, fontWeight: '600', color: colors.text },
  price: { fontSize: 16, fontWeight: '800', color: colors.primary },
  contact: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },
  note: { fontSize: 12, color: colors.textSecondary, marginTop: 6, fontStyle: 'italic' },
  cancelBtn: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  cancelText: { color: colors.error, fontSize: 13, fontWeight: '600' },
});
