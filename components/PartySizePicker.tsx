import { Pressable, StyleSheet, Text, View } from 'react-native';
import { bookingRules, palette, radius, spacing } from '@/constants/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function PartySizePicker({ value, onChange }: Props) {
  const dec = () => onChange(Math.max(bookingRules.minParty, value - 1));
  const inc = () => onChange(Math.min(bookingRules.maxParty, value + 1));

  return (
    <View style={styles.panel}>
      <View style={styles.wrap} accessibilityRole="adjustable" accessibilityLabel="几位到店">
        <Pressable
          onPress={dec}
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="减少人数"
        >
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>人</Text>
        </View>
        <Pressable
          onPress={inc}
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="增加人数"
        >
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.cardInner,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    paddingVertical: spacing.sm,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  btn: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: palette.jade,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.card,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  btnText: { fontSize: 22, lineHeight: 24, color: palette.inkGreen, fontWeight: '300' },
  center: { alignItems: 'center' },
  value: { fontSize: 40, fontWeight: '700', color: palette.text, lineHeight: 44 },
  unit: { fontSize: 14, fontWeight: '600', color: palette.textSoft, marginTop: 2 },
});
