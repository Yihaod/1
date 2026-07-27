import { AppHeader } from '@/components/AppHeader';
import { DecorativeBackground } from '@/components/DecorativeBackground';
import { PageHero } from '@/components/PageHero';
import { PrimaryButton } from '@/components/PrimaryButton';
import { MyBookingHomeEntry } from '@/components/MyBookingHomeEntry';
import { bookingRules, elevation, palette, radius, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const highlights = [
  { icon: 'storefront-outline' as const, text: '选择就近门店' },
  { icon: 'calendar-outline' as const, text: '30 秒完成预约' },
  { icon: 'leaf-outline' as const, text: '顺时调养 · 安心到店' },
];

/** 打开 App 封面 */
export default function CoverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <DecorativeBackground />
      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View style={styles.top}>
          <AppHeader />
          <View style={styles.heroWrap}>
            <PageHero />
          </View>

          <View style={[styles.card, elevation.card]}>
            {highlights.map((item) => (
              <View key={item.text} style={styles.row}>
                <View style={styles.rowIcon}>
                  <Ionicons name={item.icon} size={18} color={palette.inkGreen} />
                </View>
                <Text style={styles.rowText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <MyBookingHomeEntry />
        </View>

        <View style={styles.footer}>
          <PrimaryButton label={bookingRules.coverCta} onPress={() => router.push('/stores')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    justifyContent: 'space-between',
  },
  top: { flexShrink: 1 },
  heroWrap: { marginTop: spacing.md },
  card: {
    marginTop: spacing.xl,
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.borderLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 6 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: palette.jadeMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, fontSize: 15, fontWeight: '600', color: palette.textMuted },
  footer: { paddingTop: spacing.lg },
});
