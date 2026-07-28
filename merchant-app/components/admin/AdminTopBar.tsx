import { palette, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  /** 指定返回页；不依赖浏览器历史，避免 Web 上返回无反应 */
  backHref?: Href;
};

export function AdminTopBar({ title, subtitle, showBack = true, backHref = '/' }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goBack = () => {
    router.replace(backHref);
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.bar}>
        {showBack ? (
          <Pressable
            onPress={goBack}
            style={styles.back}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="返回"
          >
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
  wrap: { backgroundColor: palette.background, zIndex: 10, elevation: 4 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  back: { padding: spacing.xs, zIndex: 11 },
  backPlaceholder: { width: 36 },
  titles: { flex: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: palette.inkGreen },
  sub: { fontSize: 12, color: palette.textSoft, marginTop: 2 },
});
