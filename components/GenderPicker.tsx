import { genderOptions } from '@/lib/gender';
import { palette, radius, spacing } from '@/constants/theme';
import type { CustomerGender } from '@/types/booking';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  value: CustomerGender;
  onChange: (value: CustomerGender) => void;
};

export function GenderPicker({ value, onChange }: Props) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="性别（选填）">
      {genderOptions.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(selected ? null : opt.value)}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.label}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, marginTop: 6 },
  chip: {
    minWidth: 72,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.borderLight,
    backgroundColor: palette.cardInner,
    alignItems: 'center',
  },
  chipSelected: {
    borderColor: palette.jade,
    backgroundColor: palette.jadeMist,
  },
  chipText: { fontSize: 16, fontWeight: '600', color: palette.textMuted },
  chipTextSelected: { color: palette.inkGreen },
});
