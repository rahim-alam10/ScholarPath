import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../../config/theme';
import { styles } from '../../theme/styles';

export function ApiStatus({
  loading,
  error,
  empty = false,
  emptyMessage = 'No results found.',
}: {
  loading: boolean;
  error: string | null;
  empty?: boolean;
  emptyMessage?: string;
}) {
  if (loading) {
    return (
      <View style={{ paddingVertical: 24, alignItems: 'center' }}>
        <ActivityIndicator color={colors.blue} />
        <Text style={[styles.mutedText, { marginTop: 10 }]}>Loading from the server…</Text>
      </View>
    );
  }
  if (error) {
    return <Text accessibilityRole="alert" style={styles.mutedText}>{error}</Text>;
  }
  if (empty) {
    return <Text style={styles.mutedText}>{emptyMessage}</Text>;
  }
  return null;
}
