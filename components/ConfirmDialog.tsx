import { palette, radius, spacing } from '@/constants/theme';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '再想想',
  destructive,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityRole="button">
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              style={[styles.btn, styles.btnSecondary]}
              accessibilityRole="button"
            >
              <Text style={styles.btnSecondaryText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              style={[styles.btn, destructive ? styles.btnDestructive : styles.btnPrimary]}
              accessibilityRole="button"
            >
              <Text style={styles.btnPrimaryText}>{loading ? '处理中…' : confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(37, 42, 40, 0.45)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: spacing.lg,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.inkGreen, textAlign: 'center' },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: palette.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  btn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  btnSecondary: {
    backgroundColor: palette.cardInner,
    borderWidth: 1,
    borderColor: palette.border,
  },
  btnSecondaryText: { fontSize: 16, fontWeight: '600', color: palette.textMuted },
  btnPrimary: { backgroundColor: palette.inkGreen },
  btnDestructive: { backgroundColor: palette.cinnabar },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
