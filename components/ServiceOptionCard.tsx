import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ClinicService } from '@/data/services';
import { palette, radius, spacing } from '@/constants/theme';

type Props = {
  service: ClinicService;
  selected: boolean;
  onSelect: () => void;
};

export function ServiceOptionCard({ service, selected, onSelect }: Props) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.pressed,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={service.name}
    >
      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <Text style={styles.icon}>{service.icon}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, selected && styles.nameSelected]}>{service.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {service.description}
        </Text>
        <Text style={styles.duration}>{service.durationLabel}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    marginBottom: spacing.sm,
  },
  cardSelected: {
    borderColor: palette.inkGreen,
    backgroundColor: '#F4FAF7',
  },
  pressed: { opacity: 0.92 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.jadeMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: { backgroundColor: palette.jadeLight },
  icon: { fontSize: 22 },
  body: { flex: 1, minWidth: 0 },
  name: { fontSize: 16, fontWeight: '700', color: palette.text },
  nameSelected: { color: palette.inkGreen },
  desc: { fontSize: 13, lineHeight: 19, color: palette.textSoft, marginTop: 4 },
  duration: { fontSize: 12, color: palette.textMuted, marginTop: 6 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  radioSelected: { borderColor: palette.inkGreen },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.inkGreen,
  },
});
