import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Chip } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { ApiStatus } from '../../components/common/ApiStatus';
import type { ResearchOpportunity } from '../../api/opportunityApi';
import { useApiData } from '../../hooks/useApiData';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function SupervisorsScreen() {
  const { setSelectedResearch } = useAppState();
  const { data: research, loading, error } = useApiData<ResearchOpportunity[]>('/research');
  const showResearch = (project: ResearchOpportunity) => {
    const slug = project.slug ?? project.id;
    setSelectedResearch(slug);
    router.push({ pathname: routes.researchDetail, params: { id: slug } });
  };
  return (
    <MainLayout title="Supervisors">
      <Text style={styles.heading}>Find a supervisor</Text>
      <Text style={styles.mutedText}>Connect with researchers working in your field.</Text>
      <ApiStatus loading={loading} error={error} empty={!loading && !error && !research?.some((project) => project.supervisorName)} />
      {research?.filter((project) => project.supervisorName).map((project) => (
        <View key={project.id} style={styles.card}>
          <Text style={styles.sectionTitle}>{project.supervisorName}</Text>
          <Text style={styles.mutedText}>
            {project.topics.join(' · ')} · {project.institution}
          </Text>
          <Chip
            label="View research interests"
            onPress={() => showResearch(project)}
            style={styles.fullChip}
          />
        </View>
      ))}
    </MainLayout>
  );
}
