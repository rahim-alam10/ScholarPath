import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { ResearchCard } from '../../components/specific/OpportunityCards';
import { ApiStatus } from '../../components/common/ApiStatus';
import type { ResearchOpportunity } from '../../api/opportunityApi';
import { useApiData } from '../../hooks/useApiData';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function SavedResearchScreen() {
  const { savedResearch, selectedResearch } = useAppState();
  const { data: projects, loading, error } = useApiData<ResearchOpportunity[]>('/research');
  const project = projects?.find(
    (item) => (item.slug ?? item.id) === selectedResearch,
  );
  return (
    <MainLayout title="Saved research" onBack={() => router.back()}>
      <Text style={styles.heading}>Saved research</Text>
      <Text style={styles.mutedText}>Keep promising projects in one place.</Text>
      <ApiStatus loading={loading} error={error} />
      {savedResearch ? (
        project ? (
          <ResearchCard
            project={project}
            onPress={() => router.push({
              pathname: routes.researchDetail,
              params: { id: project.slug ?? project.id },
            })}
          />
        ) : !loading && !error ? (
          <Text style={styles.mutedText}>The saved research opportunity is no longer available.</Text>
        ) : null
      ) : (
        <View style={[styles.softCard, styles.emptySaved]}>
          <Text style={styles.sectionTitle}>No research saved yet</Text>
          <Text style={styles.mutedText}>Save an opportunity from its details page. Your selections stay with you as you explore.</Text>
          <Button label="Browse research" onPress={() => router.navigate(routes.research)} />
        </View>
      )}
    </MainLayout>
  );
}
