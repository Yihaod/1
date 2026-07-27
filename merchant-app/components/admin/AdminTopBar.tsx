import { DecorativeBackground } from '@/components/DecorativeBackground';
import { palette, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
};

export function AdminTopBar({ title, subtitle, showBack = true }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <DecorativeBackground />
      <View style={styles.bar}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button">
            <Ionicons name="chevron-back" size={24} color={palette.inkGreen} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
        <View style={styles.backPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: palette.background },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  back: { padding: spacing.xs },
  backPlaceholder: { width: 36 },
  titles: { flex: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: palette.inkGreen },
  sub: { fontSize: 12, color: palette.textSoft, marginTop: 2 },
});
