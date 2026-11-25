import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Chip, TextButton } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function NoMatchesScreen() {
  const { setQuery } = useAppState();
  return (
    <MainLayout title="No matches" onBack={() => router.back()}>
      <Chip label="Edit filters" filled onPress={() => router.navigate(routes.scholarships)} style={styles.fullChip} />
      <View style={[styles.card, styles.noMatchCard]}>
        <Text style={styles.sadFace}>:(</Text>
        <Text style={styles.sectionTitle}>No Scholarship Matches Found</Text>
        <Text style={styles.mutedText}>
          Your selected filters might be too restrictive. Try loosening your filters or updating your profile requirements.
        </Text>
        <Button label="Edit Profile Criteria" onPress={() => router.push(routes.academicProfile)} />
        <TextButton label="Clear filters" onPress={() => { setQuery(''); router.replace(routes.scholarships); }} />
      </View>
    </MainLayout>
  );
}
