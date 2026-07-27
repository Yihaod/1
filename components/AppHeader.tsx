import { StyleSheet, Text, View } from 'react-native';
import { bookingRules, palette, spacing } from '@/constants/theme';

export function AppHeader() {
  return (
    <View style={styles.wrap} accessibilityRole="header">
      <View style={styles.logoOuter}>
        <View style={styles.logoRing} accessibilityLabel="中医馆标志占位">
          <View style={styles.yinYangHint} />
          <View style={styles.leafArc} />
          <View style={styles.dot} />
        </View>
      </View>
      <Text style={styles.brand}>{bookingRules.brandLabel}</Text>
      <Text style={styles.tagline}>{bookingRules.brandTagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.xs },
  logoOuter: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.borderLight,
    backgroundColor: 'rgba(255,252,248,0.6)',
  },
  logoRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: palette.jade,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.card,
  },
  yinYangHint: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: palette.inkGreen,
    opacity: 0.35,
  },
  leafArc: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: palette.inkGreen,
    borderTopRightRadius: 18,
    transform: [{ rotate: '15deg' }, { translateX: -3 }],
    opacity: 0.85,
  },
  dot: {
    position: 'absolute',
    top: 11,
    right: 13,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.cinnabar,
  },
  brand: {
    marginTop: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: palette.textMuted,
    letterSpacing: 4,
  },
  tagline: {
    marginTop: 4,
    fontSize: 12,
    color: palette.textSoft,
    letterSpacing: 1,
  },
});
