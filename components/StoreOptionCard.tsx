import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ClinicStore } from '@/data/stores';
import { palette, radius, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

import { formatDistanceMeters } from '@/lib/geo';

type Props = {
  store: ClinicStore;
  selected: boolean;
  onSelect: () => void;
  /** 与用户位置的距离（米），有则展示 */
  distanceMeters?: number;
  /** 是否为当前列表最近一家 */
  isNearest?: boolean;
};

export function StoreOptionCard({ store, selected, onSelect, distanceMeters, isNearest }: Props) {
  const hasDetails = Boolean(store.address || store.phone || store.hoursSummary);

  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        !hasDetails && styles.cardCompact,
        pressed && styles.pressed,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={store.name}
    >
      <View style={styles.header}>
        <View style={[styles.badge, selected && styles.badgeSelected]}>
          <Ionicons
            name="storefront-outline"
            size={20}
            color={selected ? palette.inkGreen : palette.textMuted}
          />
        </View>
        <View style={styles.titleBlock}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, selected && styles.nameSelected]}>{store.name}</Text>
            {isNearest ? (
              <View style={styles.nearestChip}>
                <Text style={styles.nearestText}>最近</Text>
              </View>
            ) : null}
          </View>
          {distanceMeters != null ? (
            <Text style={styles.distance}>{formatDistanceMeters(distanceMeters)}</Text>
          ) : null}
          {store.hoursSummary ? <Text style={styles.hours}>{store.hoursSummary}</Text> : null}
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected ? <View style={styles.radioDot} /> : null}
        </View>
      </View>
      {store.address ? (
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={14} color={palette.textSoft} />
          <Text style={styles.metaText}>{store.address}</Text>
        </View>
      ) : null}
      {store.phone ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            Linking.openURL(`tel:${store.phone!.replace(/-/g, '')}`).catch(() => {});
          }}
          style={styles.phoneRow}
          accessibilityRole="button"
          accessibilityLabel={`致电 ${store.phone}`}
        >
          <Ionicons name="call-outline" size={14} color={palette.jade} />
          <Text style={styles.phone}>{store.phone}</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cardCompact: { paddingVertical: spacing.sm + 2 },
  cardSelected: {
    borderColor: palette.inkGreen,
    backgroundColor: '#F4FAF7',
  },
  pressed: { opacity: 0.92 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: palette.jadeMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: { backgroundColor: palette.jadeLight },
  titleBlock: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  name: { fontSize: 17, fontWeight: '700', color: palette.text },
  nameSelected: { color: palette.inkGreen },
  nearestChip: {
    backgroundColor: palette.jadeMist,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: palette.jadeLight,
  },
  nearestText: { fontSize: 11, fontWeight: '700', color: palette.inkGreen },
  distance: { fontSize: 12, color: palette.jade, fontWeight: '600', marginTop: 4 },
  hours: { fontSize: 12, color: palette.textMuted, marginTop: 4 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: palette.inkGreen },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.inkGreen,
  },
  meta: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingLeft: 2 },
  metaText: { flex: 1, fontSize: 13, lineHeight: 19, color: palette.textSoft },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 2 },
  phone: { fontSize: 14, fontWeight: '600', color: palette.jade },
});
