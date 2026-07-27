import { AdminMenuTile } from '@/components/admin/AdminMenuTile';
import { AdminStorePicker } from '@/components/admin/AdminStorePicker';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { DecorativeBackground } from '@/components/DecorativeBackground';
import { useAdminStore } from '@/context/AdminStoreContext';
import { getConsumerAppUrl } from '@/constants/links';
import { palette, spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { storeName } = useAdminStore();

  const openConsumerApp = () => {
    const url = getConsumerAppUrl();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = url;
      return;
    }
    Linking.openURL(url);
  };

  return (
    <View style={styles.safe}>
      <AdminTopBar title="商家管理端" subtitle={`${storeName} · 演示版`} showBack={false} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <DecorativeBackground />
        <Text style={styles.intro}>
          排班、时段与服务人员可先使用占位数据；具体姓名与规则确定后在后台或配置文件中维护。
        </Text>

        <AdminStorePicker />

        <AdminMenuTile
          title="预约排期"
          subtitle="管理每日时段、Block / Unblock"
          icon="calendar-outline"
          onPress={() => router.push('/schedule')}
        />
        <AdminMenuTile
          title="服务人员"
          subtitle="设置人员与当日是否上班"
          icon="people-outline"
          onPress={() => router.push('/staff')}
        />
        <AdminMenuTile
          title="每日预约"
          subtitle="按门店、日期查看预约列表"
          icon="list-outline"
          onPress={() => router.push('/appointments')}
        />
        <AdminMenuTile
          title="数据概览"
          subtitle="预约量与基础经营摘要"
          icon="bar-chart-outline"
          onPress={() => router.push('/analytics')}
        />

        <Pressable onPress={openConsumerApp} style={styles.consumerLink}>
          <Text style={styles.consumerLinkText}>返回顾客端</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  intro: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.textSoft,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  consumerLink: { alignItems: 'center', paddingVertical: spacing.xl },
  consumerLinkText: { fontSize: 15, fontWeight: '600', color: palette.jade },
});
