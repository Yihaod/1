import { AdminStoreProvider } from '@/context/AdminStoreContext';
import { palette } from '@/constants/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AdminStoreProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="staff" />
        <Stack.Screen name="appointments" />
        <Stack.Screen name="analytics" />
      </Stack>
    </AdminStoreProvider>
  );
}
