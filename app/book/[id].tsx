import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, spacing } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { formatPrice, getNextDays, getServiceById, getTimeSlotsForDate } from '@/data/services';
import { saveBooking } from '@/lib/bookings';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { refreshBookings } = useBookings();
  const service = getServiceById(id ?? '');

  const days = useMemo(() => getNextDays(14), []);
  const [selectedDate, setSelectedDate] = useState(days[0]?.key ?? '');
  const slots = useMemo(() => getTimeSlotsForDate(selectedDate), [selectedDate]);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!service) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="预约" onBack={() => router.back()} />
        <Text style={styles.missing}>服务不存在</Text>
      </SafeAreaView>
    );
  }

  const submit = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('请选择时间', '请先选择预约日期和时段');
      return;
    }
    if (!name.trim() || !phone.trim()) {
      Alert.alert('请填写联系方式', '姓名和手机号为必填项');
      return;
    }
    if (!/^1\d{10}$/.test(phone.trim())) {
      Alert.alert('手机号格式', '请输入 11 位中国大陆手机号（演示校验）');
      return;
    }

    setSubmitting(true);
    try {
      await saveBooking({
        serviceId: service.id,
        serviceName: service.name,
        provider: service.provider,
        date: selectedDate,
        time: selectedTime,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        note: note.trim() || undefined,
        priceCents: service.priceCents,
      });
      await refreshBookings();
      Alert.alert('预约成功', '商家将在演示环境中自动显示为「待确认」', [
        { text: '查看预约', onPress: () => router.replace('/(tabs)/bookings') },
        { text: '返回首页', onPress: () => router.replace('/(tabs)/') },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="填写预约" onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.summary}>
            <Text style={styles.summaryName}>{service.name}</Text>
            <Text style={styles.summaryMeta}>
              {service.provider} · {service.durationMinutes} 分钟 · {formatPrice(service.priceCents)}
            </Text>
          </View>

          <Text style={styles.label}>选择日期</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
            {days.map((d) => {
              const active = d.key === selectedDate;
              return (
                <Pressable
                  key={d.key}
                  onPress={() => {
                    setSelectedDate(d.key);
                    setSelectedTime('');
                  }}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                >
                  <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{d.label}</Text>
                  <Text style={[styles.dayWeek, active && styles.dayLabelActive]}>周{d.weekday}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>选择时段</Text>
          <View style={styles.slots}>
            {slots.map((t) => {
              const active = t === selectedTime;
              return (
                <Pressable
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  style={[styles.slot, active && styles.slotActive]}
                >
                  <Text style={[styles.slotText, active && styles.slotTextActive]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>联系人</Text>
          <TextInput
            style={styles.input}
            placeholder="您的姓名"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="手机号"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={11}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="备注（选填）"
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <Pressable
            style={[styles.submit, submitting && { opacity: 0.6 }]}
            onPress={submit}
            disabled={submitting}
          >
            <Text style={styles.submitText}>{submitting ? '提交中…' : '确认预约'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  missing: { textAlign: 'center', marginTop: 40, color: colors.textSecondary },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  summaryName: { fontSize: 18, fontWeight: '800', color: colors.text },
  summaryMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  label: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, marginTop: 4 },
  dayScroll: { marginBottom: spacing.md },
  dayChip: {
    width: 72,
    paddingVertical: 12,
    marginRight: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dayChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  dayWeek: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  dayLabelActive: { color: '#fff' },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg },
  slot: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotActive: { backgroundColor: `${colors.primary}18`, borderColor: colors.primary },
  slotText: { fontSize: 14, fontWeight: '600', color: colors.text },
  slotTextActive: { color: colors.primary },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  submit: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
