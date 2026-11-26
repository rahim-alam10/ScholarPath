import { useSyncExternalStore } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../config/theme';
import { getActiveRequestCount, subscribeToRequestActivity } from '../../api/requestActivity';

export function GlobalLoadingIndicator() {
  const activeRequests = useSyncExternalStore(
    subscribeToRequestActivity,
    getActiveRequestCount,
    getActiveRequestCount,
  );

  if (activeRequests === 0) return null;

  return (
    <View style={styles.overlay} accessibilityRole="progressbar" accessibilityLabel="Loading">
      <View style={styles.message}>
        <ActivityIndicator size="large" color={colors.blue} />
        <Text style={styles.label}>Loading…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21, 29, 46, 0.2)',
  },
  message: {
    minWidth: 140,
    minHeight: 112,
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    padding: 20,
    backgroundColor: colors.white,
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
});
