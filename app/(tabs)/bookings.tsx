import { BookingCard } from '@/components/BookingCard';
import { colors, spacing } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { cancelBooking } from '@/lib/bookings';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  const { bookings, refreshBookings, loading } = useBookings();

  useFocusEffect(
    useCallback(() => {
      refreshBookings();
    }, [refreshBookings])
  );

  const handleCancel = (id: string, name: string) => {
    Alert.alert('取消预约', `确定取消「${name}」的预约吗？`, [
      { text: '再想想', style: 'cancel' },
      {
        text: '确认取消',
        style: 'destructive',
        onPress: async () => {
          await cancelBooking(id);
          await refreshBookings();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>我的预约</Text>
        <Text style={styles.sub}>本地保存，演示环境无云端同步</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {bookings.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyTitle}>还没有预约</Text>
              <Text style={styles.emptySub}>在首页选择服务，选择时间即可完成预约</Text>
            </View>
          ) : (
            bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={() => handleCancel(b.id, b.serviceName)}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  sub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.lg },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 16 },
  emptySub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
});
