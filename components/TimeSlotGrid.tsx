import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TimeSlot } from '@/data/mockSchedule';
import { palette, radius, spacing } from '@/constants/theme';

/** 约 4 行时段高度，其余在区域内上下滑动 */
const PANEL_MAX_HEIGHT = 232;

type Props = {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
};

export function TimeSlotGrid({ slots, selectedTime, onSelect }: Props) {
  return (
    <View style={styles.panel}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        nestedScrollEnabled
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        {slots.map((slot) => {
          const selected = slot.label === selectedTime;
          return (
            <Pressable
              key={slot.id}
              onPress={() => onSelect(slot.label)}
              style={({ pressed }) => [
                styles.slot,
                selected && styles.slotSelected,
                pressed && !selected && styles.slotPressed,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={slot.label}
            >
              <Text style={[styles.slotText, selected && styles.slotTextSelected]}>
                {slot.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    maxHeight: PANEL_MAX_HEIGHT,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.borderLight,
    backgroundColor: palette.cardInner,
    overflow: 'hidden',
  },
  scroll: {
    maxHeight: PANEL_MAX_HEIGHT,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.sm,
    paddingBottom: spacing.md,
  },
  slot: {
    width: '48%',
    paddingVertical: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSelected: {
    borderColor: palette.inkGreen,
    backgroundColor: palette.inkGreen,
  },
  slotPressed: { backgroundColor: palette.jadeMist },
  slotText: { fontSize: 15, fontWeight: '600', color: palette.inkGreenMuted, letterSpacing: 0.5 },
  slotTextSelected: { color: '#fff', fontWeight: '700' },
});
