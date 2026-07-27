import { AppHeader } from '@/components/AppHeader';
import { BookingSummaryCard } from '@/components/BookingSummaryCard';
import { DecorativeBackground } from '@/components/DecorativeBackground';
import { PrimaryButton } from '@/components/PrimaryButton';
import { GenderPicker } from '@/components/GenderPicker';
import { PrivacyConsentBlock } from '@/components/PrivacyConsentBlock';
import { palette, radius, spacing } from '@/constants/theme';
import { useBookingDraft } from '@/context/BookingDraftContext';
import { bookingRepository } from '@/lib/bookingRepository';
import { setPendingSuccessBookingId, peekPendingSuccessBookingId } from '@/lib/lastSuccess';
import { sendBookingConfirmationSms } from '@/lib/sms';
import { isNonEmptyName, isValidCnMobile } from '@/lib/validation';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setDraft, editingId } = useBookingDraft();
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState('');
  const navigatingToSuccess = useRef(false);

  if (!draft.date || !draft.time || !draft.serviceId) {
    if (navigatingToSuccess.current || peekPendingSuccessBookingId()) {
      return null;
    }
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <DecorativeBackground />
        <View style={styles.missingDraft}>
          <Text style={styles.missingTitle}>请先完成时间与项目选择</Text>
          <PrimaryButton label="返回首页" onPress={() => router.replace('/')} />
        </View>
      </SafeAreaView>
    );
  }

  const validate = () => {
    let ok = true;
    if (!isNonEmptyName(draft.customerName)) {
      setNameError('请输入至少 2 个字的姓名');
      ok = false;
    } else setNameError('');
    if (!isValidCnMobile(draft.phone)) {
      setPhoneError('请输入 11 位中国大陆手机号');
      ok = false;
    } else setPhoneError('');
    if (!privacyAccepted) {
      setPrivacyError('请先阅读并同意《隐私政策》');
      ok = false;
    } else setPrivacyError('');
    return ok;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        partySize: draft.partySize,
        date: draft.date!,
        time: draft.time!,
        serviceId: draft.serviceId!,
        serviceName: draft.serviceName,
        customerName: draft.customerName.trim(),
        gender: draft.gender ?? undefined,
        phone: draft.phone.trim(),
        note: draft.note.trim() || undefined,
      };

      const record = editingId
        ? await bookingRepository.update(editingId, { ...payload, smsSent: false })
        : await bookingRepository.create({ ...payload, smsSent: false });

      if (!record) {
        Alert.alert('保存失败', '请稍后重试');
        setLoading(false);
        return;
      }

      const sms = await sendBookingConfirmationSms(record);
      await bookingRepository.update(record.id, {
        smsSent: sms.ok,
        smsNotice: sms.userMessage,
      });

      setPendingSuccessBookingId(record.id);
      navigatingToSuccess.current = true;
      router.replace(`/success?id=${encodeURIComponent(record.id)}`);
    } catch (e) {
      Alert.alert('提交失败', '请检查网络后重试');
      console.error(e);
    } finally {
      if (!navigatingToSuccess.current) {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DecorativeBackground />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 220 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppHeader />
          <View style={styles.titleBlock}>
            <Text style={styles.title}>联系方式</Text>
            <Text style={styles.sub}>最后一步，确认后将为您保留时段</Text>
          </View>

          <BookingSummaryCard
            partySize={draft.partySize}
            date={draft.date}
            time={draft.time}
            serviceName={draft.serviceName}
          />

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>如何联系您</Text>
            <Text style={styles.label}>姓名</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              value={draft.customerName}
              onChangeText={(customerName) => setDraft((p) => ({ ...p, customerName }))}
              placeholder="您的姓名"
              placeholderTextColor={palette.textSoft}
              accessibilityLabel="姓名"
            />
            {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

            <Text style={styles.label}>性别（选填）</Text>
            <GenderPicker
              value={draft.gender}
              onChange={(gender) => setDraft((p) => ({ ...p, gender }))}
            />

            <Text style={styles.label}>手机号</Text>
            <TextInput
              style={[styles.input, phoneError ? styles.inputError : null]}
              value={draft.phone}
              onChangeText={(phone) => setDraft((p) => ({ ...p, phone }))}
              placeholder="11 位手机号"
              placeholderTextColor={palette.textSoft}
              keyboardType="phone-pad"
              maxLength={11}
              accessibilityLabel="手机号"
            />
            {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

            <Text style={styles.label}>备注（选填）</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={draft.note}
              onChangeText={(note) => setDraft((p) => ({ ...p, note }))}
              placeholder="如到店偏好（请勿填写详细病历）"
              placeholderTextColor={palette.textSoft}
              multiline
              accessibilityLabel="备注"
            />
          </View>

          <Pressable onPress={() => router.back()} style={styles.backLink} accessibilityRole="button">
            <Text style={styles.backLinkText}>返回修改项目</Text>
          </Pressable>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <PrivacyConsentBlock
            checked={privacyAccepted}
            onToggle={() => {
              setPrivacyAccepted((v) => !v);
              setPrivacyError('');
            }}
            error={privacyError}
          />
          <PrimaryButton
            label={loading ? '正在提交并发送短信…' : '确认预约'}
            loading={loading}
            disabled={!privacyAccepted}
            onPress={submit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  missingDraft: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  missingTitle: { fontSize: 17, color: palette.textMuted, textAlign: 'center' },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  titleBlock: { alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: palette.inkGreen, letterSpacing: 0.5 },
  sub: { fontSize: 14, color: palette.textSoft, marginTop: 8, textAlign: 'center' },
  formCard: {
    marginTop: spacing.lg,
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.lg,
  },
  formTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSoft,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  label: { fontSize: 14, fontWeight: '600', color: palette.textMuted, marginTop: spacing.sm },
  input: {
    backgroundColor: palette.cardInner,
    borderWidth: 1,
    borderColor: palette.borderLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.text,
    marginTop: 6,
  },
  inputError: { borderColor: palette.cinnabar },
  textArea: { minHeight: 96, textAlignVertical: 'top' },
  error: { fontSize: 12, color: palette.cinnabar, marginTop: 4 },
  backLink: { alignItems: 'center', paddingVertical: spacing.lg },
  backLinkText: { fontSize: 15, fontWeight: '600', color: palette.jade },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: 'rgba(246, 242, 233, 0.96)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.borderLight,
  },
});
