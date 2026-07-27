import { AppHeader } from '@/components/AppHeader';
import { BookingSummaryCard } from '@/components/BookingSummaryCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { ServiceOptionCard } from '@/components/ServiceOptionCard';
import { elevation, palette, radius, spacing } from '@/constants/theme';
import { useBookingDraft } from '@/context/BookingDraftContext';
import { clinicServices } from '@/data/services';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ServiceSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setDraft } = useBookingDraft();

  useFocusEffect(
    useCallback(() => {
      if (!draft.storeId) {
        router.replace('/');
      } else if (!draft.date || !draft.time) {
        router.replace('/book');
      }
    }, [draft.storeId, draft.date, draft.time, router])
  );

  if (!draft.storeId || !draft.date || !draft.time) {
    return null;
  }

  const canContinue = Boolean(draft.serviceId);

  return (
    <ScreenShell bottomInset={insets.bottom + spacing.xl}>
      <AppHeader />
      <View style={styles.titleBlock}>
        <Text style={styles.title}>选择项目</Text>
        <Text style={styles.sub}>先选意向项目，到店后医师可再微调方案</Text>
      </View>

      <BookingSummaryCard
        storeName={draft.storeName}
        partySize={draft.partySize}
        date={draft.date}
        time={draft.time}
        serviceName={draft.serviceName || undefined}
        compact
      />

      <View style={[styles.listCard, elevation.card]}>
        <Text style={styles.listLabel}>调养项目</Text>
        {clinicServices.map((service) => (
          <ServiceOptionCard
            key={service.id}
            service={service}
            selected={draft.serviceId === service.id}
            onSelect={() =>
              setDraft((prev) => ({
                ...prev,
                serviceId: service.id,
                serviceName: service.name,
              }))
            }
          />
        ))}

        <View style={styles.footer}>
          <PrimaryButton
            label="继续填写联系方式"
            disabled={!canContinue}
            onPress={() => router.push('/contact')}
          />
        </View>
      </View>

      <Pressable onPress={() => router.back()} style={styles.backLink} accessibilityRole="button">
        <Text style={styles.backLinkText}>返回修改时间</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  titleBlock: { alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: palette.inkGreen },
  sub: {
    fontSize: 14,
    color: palette.textSoft,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  listCard: {
    marginTop: spacing.lg,
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  listLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSoft,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.borderLight,
  },
  backLink: { alignItems: 'center', paddingVertical: spacing.lg },
  backLinkText: { fontSize: 15, fontWeight: '600', color: palette.jade },
});
