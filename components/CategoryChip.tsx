import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory } from '@/data/services';
import { colors, radius, spacing } from '@/constants/theme';

type Props = {
  category: ServiceCategory;
  onPress: () => void;
};

export function CategoryChip({ category, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${category.color}18` }]}>
        <Ionicons
          name={category.icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={category.color}
        />
      </View>
      <Text style={styles.label}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    width: 72,
    marginRight: spacing.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  label: { fontSize: 12, fontWeight: '600', color: colors.text },
});
