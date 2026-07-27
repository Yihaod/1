import { AppHeader } from '@/components/AppHeader';
import { StoreOptionCard } from '@/components/StoreOptionCard';
import { DecorativeBackground } from '@/components/DecorativeBackground';
import { bookingRules, palette, spacing } from '@/constants/theme';
import { useBookingDraft } from '@/context/BookingDraftContext';
import { getStoreById } from '@/data/stores';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function nearbyHintText(status: ReturnType<typeof useNearbyStores>['status']): string {
  switch (status) {
    case 'loading':
      return '正在获取位置，以便按距离排序门店…';
    case 'sorted':
      return '已按与您的大致距离由近到远排列（仅用于选店排序）';
    case 'denied':
      return '未开启定位，门店按默认顺序展示；允许定位后可点「重新定位」';
    case 'no_coords':
      return '门店尚未配置坐标，暂无法按距离排序';
    default:
      return '暂时无法获取位置，门店按默认顺序展示';
  }
}

export default function StoreSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft } = useBookingDraft();
  const { stores: nearbyStores, distanceByStoreId, status: nearbyStatus, refresh: refreshNearby } =
    useNearbyStores();

  const nearestStoreId =
    nearbyStatus === 'sorted'
      ? nearbyStores.find((s) => distanceByStoreId[s.id] != null)?.id
      : undefined;

  const onSelectStore = (storeId: string) => {
    const store = getStoreById(storeId);
    if (!store) return;
    router.replace({
      pathname: '/book',
      params: { storeId: store.id },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DecorativeBackground />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader />
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{bookingRules.storeLabel}</Text>
          <Text style={styles.sub}>请选择一家门店，再选择预约时间</Text>
        </View>

        <View style={styles.nearbyRow}>
          <Text style={styles.nearbyHint}>{nearbyHintText(nearbyStatus)}</Text>
          {nearbyStatus !== 'loading' ? (
            <Pressable onPress={refreshNearby} accessibilityRole="button">
              <Text style={styles.nearbyRefresh}>重新定位</Text>
            </Pressable>
          ) : null}
        </View>

        {nearbyStores.map((store) => (
          <StoreOptionCard
            key={store.id}
            store={store}
            selected={draft.storeId === store.id}
            onSelect={() => onSelectStore(store.id)}
            distanceMeters={distanceByStoreId[store.id]}
            isNearest={store.id === nearestStoreId}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  titleBlock: { alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: palette.inkGreen, letterSpacing: 0.5 },
  sub: { fontSize: 14, color: palette.textSoft, marginTop: 8, textAlign: 'center' },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  nearbyHint: { flex: 1, fontSize: 12, lineHeight: 18, color: palette.textSoft },
  nearbyRefresh: { fontSize: 12, fontWeight: '700', color: palette.jade },
});
