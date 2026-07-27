import { StyleSheet, Text, View } from 'react-native';
import { bookingRules, palette, spacing } from '@/constants/theme';

type Props = {
  compact?: boolean;
};

export function PageHero({ compact }: Props) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <Text style={styles.headline}>{bookingRules.headline}</Text>
      {!compact ? <Text style={styles.sub}>{bookingRules.headlineSub}</Text> : null}
      <View style={styles.accentRow}>
        <View style={styles.line} />
        <View style={styles.dot} />
        <View style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: spacing.xl },
  compact: { marginBottom: spacing.lg },
  headline: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '700',
    color: palette.inkGreen,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sub: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    color: palette.textSoft,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.md,
  },
  line: { width: 36, height: 1, backgroundColor: palette.jadeLight },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.cinnabar,
  },
});
