import { formatCustomerDisplayName } from '@/lib/gender';
import { StyleSheet, Text, View } from 'react-native';
import { formatBookingDate } from '@/data/mockSchedule';
import { elevation, palette, radius, spacing } from '@/constants/theme';
import type { CustomerGender } from '@/types/booking';

type Props = {
  storeName?: string;
  partySize: number;
  date: string;
  time: string;
  customerName?: string;
  gender?: CustomerGender;
  bookingId?: string;
  serviceName?: string;
};

export function BookingSummaryCard({
  storeName,
  partySize,
  date,
  time,
  customerName,
  gender,
  bookingId,
  serviceName,
}: Props) {
  return (
    <View style={[styles.card, elevation.card]} accessibilityRole="summary">
      <View style={styles.accentBar} />
      <View style={styles.inner}>
        <Text style={styles.cardLabel}>预约信息</Text>
        {storeName ? <Row label="门店" value={storeName} accent /> : null}
        <Row label="人数" value={`${partySize} 人`} />
        <Row label="日期" value={formatBookingDate(date)} />
        <Row label="时间" value={time} accent />
        {serviceName ? <Row label="项目" value={serviceName} /> : null}
        {customerName ? (
          <Row label="联系人" value={formatCustomerDisplayName(customerName, gender)} />
        ) : null}
        {bookingId ? <Row label="预约编号" value={bookingId} mono /> : null}
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accent && styles.accent, mono && styles.mono]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.borderLight,
    overflow: 'hidden',
  },
  accentBar: { width: 4, backgroundColor: palette.jade },
  inner: { flex: 1, padding: spacing.lg, gap: spacing.md },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSoft,
    letterSpacing: 2,
    marginBottom: -4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: { fontSize: 14, color: palette.textMuted },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  accent: { color: palette.inkGreen, fontSize: 18 },
  mono: { letterSpacing: 0.8, fontSize: 14, color: palette.inkGreenMuted },
});
