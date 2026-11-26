import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { InfoBlock } from '../../components/specific/OpportunityCards';
import { ApiStatus } from '../../components/common/ApiStatus';
import { useApiData } from '../../hooks/useApiData';
import type { ResearchOpportunity } from '../../api/opportunityApi';
import { formatDate } from '../../utils/formatDate';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function ResearchDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: project, loading, error } = useApiData<ResearchOpportunity>(
    id ? `/research/${encodeURIComponent(id)}` : '/research/invalid',
  );
  const { savedResearch, setSavedResearch, setSelectedResearch } = useAppState();
  return (
    <MainLayout
      title="Research project"
      onBack={() => router.back()}
      footer={
        <Button
          label={savedResearch ? 'Saved opportunity' : 'Save opportunity'}
          onPress={() => {
            if (id) setSelectedResearch(id);
            setSavedResearch(!savedResearch);
          }}
        />
      }
    >
      <ApiStatus loading={loading} error={error} empty={!loading && !error && !project} emptyMessage="Research opportunity not found." />
      {project ? (
        <>
          <Text style={styles.heading}>{project.title}</Text>
          <Text style={styles.bodyStrong}>{project.institution}</Text>
          <Text style={styles.mutedText}>{project.country}</Text>
          <View style={[styles.card, styles.projectInfo]}>
            <InfoBlock label="Opportunity type" value={project.kind ?? 'Not specified'} />
            <InfoBlock label="Funding" value={project.funding ?? 'Not specified'} />
            <InfoBlock label="Topics" value={project.topics.join(' · ') || 'Not specified'} />
            <InfoBlock label="Application deadline" value={formatDate(project.deadline)} />
          </View>
          {project.description ? (
            <>
              <Text style={styles.sectionTitle}>About the research</Text>
              <Text style={styles.mutedText}>{project.description}</Text>
            </>
          ) : null}
          {project.supervisorName ? (
            <Text style={styles.mutedText}>Supervisor: {project.supervisorName}</Text>
          ) : null}
        </>
      ) : null}
    </MainLayout>
  );
}
