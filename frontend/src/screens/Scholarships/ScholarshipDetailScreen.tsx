import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { DetailRow, RequirementCard } from '../../components/specific/OpportunityCards';
import { ApiStatus } from '../../components/common/ApiStatus';
import { useApiData } from '../../hooks/useApiData';
import type { Scholarship } from '../../api/opportunityApi';
import { formatDate } from '../../utils/formatDate';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function ScholarshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { savedScholarship, setSavedScholarship } = useAppState();
  const { data: scholarship, loading, error } = useApiData<Scholarship>(
    id ? `/scholarships/${encodeURIComponent(id)}` : '/scholarships/invalid',
  );
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
      <ApiStatus loading={loading} error={error} empty={!loading && !error && !scholarship} emptyMessage="Scholarship not found." />
      {scholarship ? (
        <>
          <Text style={styles.heading}>{scholarship.title}</Text>
          <View style={styles.detailsList}>
            <DetailRow label="Provider:" value={scholarship.provider} />
            <DetailRow label="Deadline:" value={formatDate(scholarship.deadline)} />
            <DetailRow label="Funding:" value={scholarship.funding ?? 'Not specified'} />
            <DetailRow label="Country:" value={scholarship.country ?? 'Not specified'} />
          </View>
          {scholarship.description ? (
            <>
              <Text style={styles.sectionTitle}>About this scholarship</Text>
              <Text style={styles.mutedText}>{scholarship.description}</Text>
            </>
          ) : null}
          {scholarship.eligibilityCriteria.length ? (
            <>
              <Text style={styles.sectionTitle}>Eligibility criteria</Text>
              {scholarship.eligibilityCriteria.map((criterion) => (
                <RequirementCard key={criterion} title={criterion} />
              ))}
            </>
          ) : null}
        </>
      ) : null}
    </MainLayout>
  );
}
