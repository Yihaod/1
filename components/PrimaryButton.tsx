import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { palette, radius, spacing } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        inactive && isPrimary && styles.primaryDisabled,
        pressed && !inactive && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : palette.inkGreen} />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: { backgroundColor: palette.inkGreen },
  primaryDisabled: { backgroundColor: palette.disabled },
  secondary: {
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.jade,
  },
  pressed: { opacity: 0.94, transform: [{ scale: 0.995 }] },
  text: { fontSize: 17, fontWeight: '700', letterSpacing: 1 },
  textPrimary: { color: '#fff' },
  textSecondary: { color: palette.inkGreen },
});
