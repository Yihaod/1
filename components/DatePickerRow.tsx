import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { DayOption } from '@/data/mockSchedule';
import { palette, radius, spacing } from '@/constants/theme';

type Props = {
  days: DayOption[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  maxVisible?: number;
};

export function DatePickerRow({ days, selectedKey, onSelect, maxVisible = 14 }: Props) {
  const visible = days.slice(0, maxVisible);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {visible.map((day) => {
        const selected = day.key === selectedKey;
        return (
          <Pressable
            key={day.key}
            onPress={() => onSelect(day.key)}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${day.label} 周${day.weekday}`}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{day.label}</Text>
            <Text style={[styles.weekday, selected && styles.weekdaySelected]}>
              周{day.weekday}
            </Text>
            {selected ? <View style={styles.underline} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    minWidth: 84,
    minHeight: 80,
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: palette.inkGreen,
    borderColor: palette.inkGreen,
  },
  label: { fontSize: 15, fontWeight: '700', color: palette.text },
  weekday: { fontSize: 12, color: palette.textSoft, marginTop: 4 },
  weekdaySelected: { color: 'rgba(255,255,255,0.82)' },
  labelSelected: { color: '#fff' },
  underline: {
    marginTop: 8,
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
