import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service, formatPrice } from '@/data/services';
import { colors, radius, spacing } from '@/constants/theme';

type Props = {
  service: Service;
  onPress: () => void;
  compact?: boolean;
};

export function ServiceCard({ service, onPress, compact }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, compact && styles.compact]}
    >
      <View style={styles.emojiBox}>
        <Text style={styles.emoji}>{service.imageEmoji}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {service.name}
        </Text>
        <Text style={styles.provider} numberOfLines={1}>
          {service.provider}
        </Text>
        {!compact && (
          <Text style={styles.desc} numberOfLines={2}>
            {service.description}
          </Text>
        )}
        <View style={styles.meta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>
              {service.rating} ({service.reviewCount})
            </Text>
          </View>
          <Text style={styles.duration}>{service.durationMinutes} 分钟</Text>
        </View>
      </View>
      <View style={styles.priceCol}>
        <Text style={styles.price}>{formatPrice(service.priceCents)}</Text>
        <Text style={styles.bookHint}>预约</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  compact: { padding: spacing.sm },
  pressed: { opacity: 0.92 },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  emoji: { fontSize: 28 },
  body: { flex: 1, minWidth: 0 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  provider: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  desc: { fontSize: 13, color: colors.textSecondary, marginTop: 6, lineHeight: 18 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, color: colors.textSecondary },
  duration: { fontSize: 12, color: colors.textSecondary },
  priceCol: { alignItems: 'flex-end', marginLeft: spacing.sm },
  price: { fontSize: 17, fontWeight: '800', color: colors.primary },
  bookHint: { fontSize: 11, color: colors.primaryLight, marginTop: 4, fontWeight: '600' },
});
