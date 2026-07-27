import { AppHeader } from '@/components/AppHeader';
import { DecorativeBackground } from '@/components/DecorativeBackground';
import { privacyPolicySections, privacySupportHint } from '@/constants/privacy';
import { palette, radius, spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DecorativeBackground />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader />
        <Text style={styles.title}>隐私政策</Text>
        <Text style={styles.updated}>适用于在线预约服务 · 请仔细阅读</Text>

        {privacyPolicySections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.support}>
          <Text style={styles.supportText}>{privacySupportHint}</Text>
        </View>

        <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button">
          <Text style={styles.backText}>返回</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.inkGreen,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  updated: { fontSize: 13, color: palette.textSoft, textAlign: 'center', marginBottom: spacing.lg },
  section: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.inkGreen, marginBottom: spacing.sm },
  sectionBody: { fontSize: 14, lineHeight: 22, color: palette.textMuted },
  support: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.jadeMist,
    marginBottom: spacing.lg,
  },
  supportText: { fontSize: 13, lineHeight: 20, color: palette.textMuted, textAlign: 'center' },
  back: { alignItems: 'center', paddingVertical: spacing.md },
  backText: { fontSize: 16, fontWeight: '600', color: palette.jade },
});
