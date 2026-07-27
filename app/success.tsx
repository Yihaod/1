import { BookingSummaryCard } from '@/components/BookingSummaryCard';
import { DecorativeBackground } from '@/components/DecorativeBackground';
import { PrimaryButton } from '@/components/PrimaryButton';
import { buildConfirmationSmsText } from '@/lib/sms';
import { takePendingSuccessBookingId } from '@/lib/lastSuccess';
import { maskPhone } from '@/lib/phone';
import { elevation, palette, radius, spacing } from '@/constants/theme';
import { useBookingDraft } from '@/context/BookingDraftContext';
import { bookingRepository } from '@/lib/bookingRepository';
import type { BookingRecord } from '@/types/booking';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const paramId = Array.isArray(rawId) ? rawId[0] : rawId;

  const { loadFromBooking, setEditingId, resetDraft } = useBookingDraft();
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = paramId || takePendingSuccessBookingId();
    if (!bookingId) {
      setLoading(false);
      return;
    }

    bookingRepository.getById(bookingId).then((record) => {
      setBooking(record);
      setLoading(false);
    });
  }, [paramId]);

  const modify = () => {
    if (!booking) return;
    loadFromBooking({
      partySize: booking.partySize,
      date: booking.date,
      time: booking.time,
      serviceId: booking.serviceId,
      serviceName: booking.serviceName,
      customerName: booking.customerName,
      gender: booking.gender ?? null,
      phone: booking.phone,
      note: booking.note ?? '',
    });
    setEditingId(booking.id);
    router.replace('/');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <DecorativeBackground />
        <ActivityIndicator color={palette.inkGreen} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>未找到预约记录</Text>
        <PrimaryButton
          label="返回首页"
          onPress={() => {
            resetDraft();
            router.replace('/');
          }}
          style={{ margin: spacing.lg }}
        />
      </SafeAreaView>
    );
  }

  const smsOk = booking.smsSent === true;
  const smsPreview = buildConfirmationSmsText(booking);

  return (
    <SafeAreaView style={styles.safe}>
      <DecorativeBackground />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={44} color={palette.inkGreen} />
          </View>
        </View>

        <Text style={styles.title}>预约成功</Text>
        <Text style={styles.sub}>您的到店时段已预留，期待与您相见</Text>

        <View style={[styles.idChip, elevation.card]}>
          <Text style={styles.idLabel}>预约编号</Text>
          <Text style={styles.idValue}>{booking.id}</Text>
        </View>

        <BookingSummaryCard
          partySize={booking.partySize}
          date={booking.date}
          time={booking.time}
          serviceName={booking.serviceName}
          customerName={booking.customerName}
          gender={booking.gender}
        />

        <View style={[styles.smsCard, smsOk ? styles.smsOk : styles.smsFail]}>
          <View style={styles.smsHeader}>
            <Ionicons
              name={smsOk ? 'paper-plane-outline' : 'alert-circle-outline'}
              size={22}
              color={smsOk ? palette.inkGreen : palette.cinnabar}
            />
            <Text style={styles.smsTitle}>{smsOk ? '确认短信已自动发送' : '短信暂未发送成功'}</Text>
          </View>
          <Text style={styles.smsPhone}>
            接收号码：<Text style={styles.smsPhoneBold}>{maskPhone(booking.phone)}</Text>
          </Text>
          {booking.smsNotice ? (
            <Text style={styles.smsNotice}>{booking.smsNotice}</Text>
          ) : null}
          <View style={styles.smsPreviewBox}>
            <Text style={styles.smsPreviewLabel}>短信内容预览</Text>
            <Text style={styles.smsPreviewText}>{smsPreview}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="修改预约" variant="secondary" onPress={modify} />
          <PrimaryButton
            label="返回首页"
            onPress={() => {
              resetDraft();
              router.replace('/');
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  badge: { alignItems: 'center' },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: palette.jadeMist,
    borderWidth: 2,
    borderColor: palette.jadeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: palette.inkGreen,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sub: { fontSize: 15, color: palette.textSoft, textAlign: 'center', lineHeight: 22 },
  idChip: {
    alignSelf: 'center',
    backgroundColor: palette.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.borderLight,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  idLabel: { fontSize: 11, color: palette.textSoft, letterSpacing: 1 },
  idValue: { fontSize: 16, fontWeight: '800', color: palette.inkGreen, marginTop: 2 },
  smsCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  smsOk: {
    backgroundColor: palette.jadeMist,
    borderColor: palette.jadeLight,
  },
  smsFail: {
    backgroundColor: '#FFF5F3',
    borderColor: '#E8C4BC',
  },
  smsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  smsTitle: { fontSize: 17, fontWeight: '700', color: palette.inkGreen },
  smsPhone: { fontSize: 14, color: palette.textMuted },
  smsPhoneBold: { fontWeight: '700', color: palette.text },
  smsNotice: { fontSize: 13, lineHeight: 20, color: palette.textSoft },
  smsPreviewBox: {
    marginTop: spacing.xs,
    backgroundColor: 'rgba(255,252,248,0.85)',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.borderLight,
  },
  smsPreviewLabel: { fontSize: 11, color: palette.textSoft, letterSpacing: 1, marginBottom: 6 },
  smsPreviewText: { fontSize: 13, lineHeight: 21, color: palette.textMuted },
  actions: { gap: spacing.sm, marginTop: spacing.xs },
  error: { textAlign: 'center', marginTop: 80, color: palette.textMuted },
});
