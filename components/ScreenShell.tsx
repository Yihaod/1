import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { DecorativeBackground } from '@/components/DecorativeBackground';
import { palette, spacing } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  bottomInset?: number;
};

export function ScreenShell({ children, scroll = true, contentStyle, bottomInset = spacing.lg }: Props) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingBottom: bottomInset }, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.static, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DecorativeBackground />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  static: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});
