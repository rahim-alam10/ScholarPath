import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { DetailRow, RequirementCard } from '../../components/specific/OpportunityCards';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function ScholarshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { savedScholarship, setSavedScholarship } = useAppState();
  const isErasmus = id === 'erasmus';
  return (
    <MainLayout
      title="Scholarship"
      onBack={() => router.back()}
      footer={
        <View style={styles.footerButtons}>
          <Button
            label={savedScholarship ? 'Saved' : 'Save Item'}
            onPress={() => setSavedScholarship(!savedScholarship)}
            style={styles.footerButton}
          />
          <Button label="Official Site ↗" variant="outline" onPress={() => {}} style={styles.footerButton} />
        </View>
      }
    >
      <Text style={styles.heading}>{isErasmus ? 'Erasmus Mundus Software Engineering' : 'DAAD Master Studies in Computer Science'}</Text>
      <View style={styles.detailsList}>
        <DetailRow label="Provider:" value={isErasmus ? 'Erasmus Mundus' : 'DAAD Germany'} />
        <DetailRow label="Deadline:" value={isErasmus ? 'Nov 30, 2026' : 'Nov 15, 2026'} />
        <DetailRow label="Funding:" value="Fully Funded" />
      </View>
      <Text style={styles.sectionTitle}>Requirements Match Breakdown</Text>
      <RequirementCard title="Minimum CGPA 3.50" value="3.75" />
      <RequirementCard title="IELTS Score 7.0+" value="7.5" />
      <RequirementCard title="Computer Science degree" value="Matches your profile" />
    </MainLayout>
  );
}
