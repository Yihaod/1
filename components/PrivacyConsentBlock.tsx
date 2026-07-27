import { privacyConsentLabel, privacySummary } from '@/constants/privacy';
import { palette, radius, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  checked: boolean;
  onToggle: () => void;
  error?: string;
};

export function PrivacyConsentBlock({ checked, onToggle, error }: Props) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <Text style={styles.summary}>{privacySummary}</Text>
      <View style={styles.checkRow}>
        <Pressable
          onPress={onToggle}
          style={styles.checkHit}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel={privacyConsentLabel}
        >
          <View style={[styles.box, checked && styles.boxChecked, error ? styles.boxError : null]}>
            {checked ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
          </View>
        </Pressable>
        <Text style={styles.checkText}>
          我已阅读并同意{' '}
          <Text
            style={styles.link}
            onPress={() => router.push('/privacy')}
            accessibilityRole="link"
          >
            《隐私政策》
          </Text>
        </Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    backgroundColor: 'rgba(255,252,248,0.96)',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  summary: { fontSize: 12, lineHeight: 18, color: palette.textSoft },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  checkHit: { paddingTop: 1 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: palette.jade,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: palette.inkGreen, borderColor: palette.inkGreen },
  boxError: { borderColor: palette.cinnabar },
  checkText: { flex: 1, fontSize: 14, lineHeight: 22, color: palette.textMuted, paddingTop: 1 },
  link: { color: palette.inkGreen, fontWeight: '700', textDecorationLine: 'underline' },
  error: { fontSize: 12, color: palette.cinnabar },
});
