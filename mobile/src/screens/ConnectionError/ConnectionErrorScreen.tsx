import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, TextButton } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function ConnectionErrorScreen() {
  return (
    <MainLayout title="Connection error" onBack={() => router.back()}>
      <View style={styles.errorCard}>
        <Text style={styles.errorTitle}>WARNING: Could not load scholarships from server</Text>
        <Text style={styles.errorDescription}>Check your network connection or try refreshing the page.</Text>
        <View style={styles.row}>
          <Button label="Retry" onPress={() => router.replace(routes.scholarships)} style={styles.retryButton} />
          <TextButton label="View Saved Items" onPress={() => router.push(routes.savedResearch)} />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>404 - Page Not Found</Text>
        <Text style={styles.mutedText}>The link you clicked might be broken or moved.</Text>
        <Button label="Return to Dashboard" onPress={() => router.replace(routes.home)} />
      </View>
    </MainLayout>
  );
}
