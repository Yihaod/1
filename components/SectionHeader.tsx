import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { palette, spacing } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

type Props = {
  icon: IconName;
  title: string;
  showDivider?: boolean;
};

export function SectionHeader({ icon, title, showDivider = true }: Props) {
  return (
    <View style={styles.wrap}>
      {showDivider ? <View style={styles.divider} /> : null}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={17} color={palette.inkGreen} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.borderLight,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: palette.jadeMist,
    borderWidth: 1,
    borderColor: palette.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.inkGreenMuted,
    letterSpacing: 0.3,
  },
});
