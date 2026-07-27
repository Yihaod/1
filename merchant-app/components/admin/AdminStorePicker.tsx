import { clinicStores } from '@/data/stores';
import { useAdminStore } from '@/context/AdminStoreContext';
import { palette, radius, spacing } from '@/constants/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function AdminStorePicker() {
  const { storeId, setStoreId } = useAdminStore();

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>当前管理门店</Text>
      <View style={styles.row}>
        {clinicStores.map((store) => {
          const selected = store.id === storeId;
          return (
            <Pressable
              key={store.id}
              onPress={() => setStoreId(store.id)}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{store.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSoft,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.borderLight,
    backgroundColor: palette.cardInner,
  },
  chipSelected: {
    borderColor: palette.jade,
    backgroundColor: palette.jadeMist,
  },
  chipText: { fontSize: 14, fontWeight: '600', color: palette.textMuted },
  chipTextSelected: { color: palette.inkGreen },
});
