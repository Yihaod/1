import { palette, radius, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function AdminMenuTile({ title, subtitle, icon, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={22} color={palette.inkGreen} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={palette.textSoft} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: { opacity: 0.94 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.jadeMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 16, fontWeight: '700', color: palette.inkGreen },
  sub: { fontSize: 13, color: palette.textSoft, marginTop: 4, lineHeight: 18 },
});
