import { ScreenHeader } from '@/components/ScreenHeader';
import { ServiceCard } from '@/components/ServiceCard';
import { colors, spacing } from '@/constants/theme';
import { getCategoryById, getServicesByCategory } from '@/data/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const category = getCategoryById(id ?? '');
  const list = getServicesByCategory(id ?? '');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title={category?.name ?? '分类'}
        subtitle={category ? `${list.length} 个服务` : undefined}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {!category ? (
          <Text style={styles.empty}>分类不存在</Text>
        ) : list.length === 0 ? (
          <Text style={styles.empty}>该分类暂无服务</Text>
        ) : (
          list.map((service) => (
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
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
