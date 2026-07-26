import { CategoryChip } from '@/components/CategoryChip';
import { ServiceCard } from '@/components/ServiceCard';
import { colors, spacing } from '@/constants/theme';
import { categories, services } from '@/data/services';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>你好 👋</Text>
          <Text style={styles.heroTitle}>发现附近优质服务</Text>
          <Text style={styles.heroSub}>美业 · 到家 · 健康 · 更多分类，一键预约</Text>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索服务或商家"
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>服务分类</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              onPress={() => router.push(`/category/${cat.id}`)}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{query ? '搜索结果' : '推荐服务'}</Text>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>没有找到相关服务</Text>
        ) : (
          filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() => router.push(`/service/${service.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  hero: { marginBottom: spacing.lg },
  greeting: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  heroTitle: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 4 },
  heroSub: { fontSize: 14, color: colors.textSecondary, marginTop: 8, lineHeight: 20 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    marginBottom: spacing.lg,
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.text },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  categories: { paddingBottom: spacing.lg, paddingRight: spacing.md },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 24 },
});
