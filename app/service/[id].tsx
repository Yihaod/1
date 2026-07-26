import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, spacing } from '@/constants/theme';
import { formatPrice, getCategoryById, getServiceById } from '@/data/services';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const service = getServiceById(id ?? '');
  const category = service ? getCategoryById(service.categoryId) : undefined;

  if (!service) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="服务详情" onBack={() => router.back()} />
        <Text style={styles.missing}>服务不存在</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="服务详情" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>{service.imageEmoji}</Text>
          {category ? (
            <View style={[styles.catBadge, { backgroundColor: `${category.color}22` }]}>
              <Text style={[styles.catText, { color: category.color }]}>{category.name}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.provider}>{service.provider}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.rating}>
            {service.rating} · {service.reviewCount} 条评价
          </Text>
        </View>

        <View style={styles.tags}>
          {service.tags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
          <View style={styles.tag}>
            <Text style={styles.tagText}>{service.durationMinutes} 分钟</Text>
          </View>
        </View>

        <Text style={styles.section}>服务介绍</Text>
        <Text style={styles.desc}>{service.description}</Text>
      </ScrollView>
      <View style={styles.priceBar}>
        <View>
          <Text style={styles.priceLabel}>服务价格</Text>
          <Text style={styles.price}>{formatPrice(service.priceCents)}</Text>
        </View>
        <Pressable style={styles.bookBtn} onPress={() => router.push(`/book/${service.id}`)}>
          <Text style={styles.bookBtnText}>立即预约</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  missing: { textAlign: 'center', marginTop: 40, color: colors.textSecondary },
  hero: { alignItems: 'center', marginBottom: spacing.md },
  emoji: { fontSize: 64 },
  catBadge: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full },
  catText: { fontSize: 12, fontWeight: '700' },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  provider: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
  ratingRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  rating: { fontSize: 14, color: colors.textSecondary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 16 },
  tag: { backgroundColor: colors.muted, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm },
  tagText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  section: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: spacing.lg, marginBottom: 8 },
  desc: { fontSize: 15, lineHeight: 24, color: colors.textSecondary },
  priceBar: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  priceLabel: { fontSize: 12, color: colors.textSecondary },
  price: { fontSize: 22, fontWeight: '800', color: colors.primary },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
