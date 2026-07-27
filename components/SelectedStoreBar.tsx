import { formatDistanceMeters } from '@/lib/geo';
import { palette, radius, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  storeName: string;
  distanceMeters?: number;
};

export function SelectedStoreBar({ storeName, distanceMeters }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/')}
      style={({ pressed }) => [styles.bar, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`当前门店 ${storeName}，点击更换`}
    >
      <View style={styles.iconBox}>
        <Ionicons name="storefront-outline" size={20} color={palette.inkGreen} />
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>预约门店</Text>
        <Text style={styles.name} numberOfLines={1}>
          {storeName}
        </Text>
        {distanceMeters != null ? (
          <Text style={styles.distance}>{formatDistanceMeters(distanceMeters)}</Text>
        ) : null}
      </View>
      <Text style={styles.change}>更换</Text>
      <Ionicons name="chevron-forward" size={18} color={palette.textSoft} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.md,
    marginBottom: spacing.lg,
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
  label: { fontSize: 11, fontWeight: '700', color: palette.textSoft, letterSpacing: 1 },
  name: { fontSize: 17, fontWeight: '700', color: palette.inkGreen, marginTop: 2 },
  distance: { fontSize: 12, color: palette.jade, fontWeight: '600', marginTop: 2 },
  change: { fontSize: 14, fontWeight: '600', color: palette.jade },
});
