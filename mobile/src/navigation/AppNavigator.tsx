import { Stack } from 'expo-router';
import { AppStateProvider } from '../state/AppState';

export default function AppNavigator() {
  return (
    <AppStateProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scholarship/[id]" />
        <Stack.Screen name="research/[id]" />
        <Stack.Screen name="saved-research" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="no-matches" />
        <Stack.Screen name="connection-error" />
      </Stack>
    </AppStateProvider>
  );
}
