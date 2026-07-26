import { colors, radius, spacing } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { bookings } = useBookings();
  const active = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>访</Text>
          </View>
          <Text style={styles.name}>访客用户</Text>
          <Text style={styles.hint}>演示版 · 登录与支付可在后续版本接入</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{bookings.length}</Text>
            <Text style={styles.statLabel}>全部预约</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{active}</Text>
            <Text style={styles.statLabel}>进行中</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {[
            ['联系客服', '演示环境，暂无在线客服'],
            ['关于易预约', '通用服务预约原型 v1.0'],
            ['隐私说明', '预约信息仅保存在本机'],
          ].map(([title, sub]) => (
            <View key={title} style={styles.menuItem}>
              <Text style={styles.menuTitle}>{title}</Text>
              <Text style={styles.menuSub}>{sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 12 },
  hint: { fontSize: 13, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.border },
  menu: { gap: spacing.sm },
  menuItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  menuSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
