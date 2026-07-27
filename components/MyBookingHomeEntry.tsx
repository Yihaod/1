import { PrimaryButton } from '@/components/PrimaryButton';
import { useLatestBookingId } from '@/hooks/useLatestBookingId';
import { palette, spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/** 首页固定入口：查看最近一次预约 */
export function MyBookingHomeEntry() {
  const router = useRouter();
  const latestBookingId = useLatestBookingId();
  const hasBooking = Boolean(latestBookingId);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>已有预约</Text>
      <PrimaryButton
        label={hasBooking ? '查看我的预约' : '暂无预约记录'}
        variant="secondary"
        disabled={!hasBooking}
        onPress={() => {
          if (!latestBookingId) return;
          router.push(`/success?id=${encodeURIComponent(latestBookingId)}`);
        }}
      />
      {!hasBooking ? (
        <Text style={styles.hint}>完成一次预约后，可在此快速查看确认信息</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg, gap: spacing.sm },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSoft,
    letterSpacing: 2,
    textAlign: 'center',
  },
  hint: { fontSize: 12, lineHeight: 18, color: palette.textSoft, textAlign: 'center' },
});
