import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { ResearchCard, ScholarshipCard, StatCard } from '../../components/specific/OpportunityCards';
import { ApiStatus } from '../../components/common/ApiStatus';
import type { ResearchOpportunity, Scholarship } from '../../api/opportunityApi';
import { useApiData } from '../../hooks/useApiData';
import { formatDate } from '../../utils/formatDate';
import { colors } from '../../config/theme';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';
import { MainLayout } from '../../components/common/ScreenLayout';
import { homeStyles } from './Home.styles';

export default function HomeScreen() {
  const { query, setQuery, profile } = useAppState();
  const { data: scholarships, loading: scholarshipsLoading, error: scholarshipsError } =
    useApiData<Scholarship[]>('/scholarships');
  const { data: research, loading: researchLoading, error: researchError } =
    useApiData<ResearchOpportunity[]>('/research');

  return (
    <MainLayout title="Home">
      <Text style={homeStyles.greeting}>
        Welcome back, {profile.fullName.trim().split(/\s+/)[0] || 'there'}!
      </Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search scholarships by name, field, or location..."
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
        multiline
      />
      <Button label="Search" onPress={() => router.push(query.toLowerCase().includes('no match') ? routes.noMatches : routes.scholarships)} />
      <View style={styles.row}>
        <StatCard
          title="Scholarships"
          value={scholarships ? String(scholarships.length) : '—'}
          caption="Available in the database"
          valueColor={colors.green}
        />
        <StatCard
          title="Research projects"
          value={research ? String(research.length) : '—'}
          caption="Available in the database"
          valueColor={colors.orange}
        />
      </View>
      <Text style={styles.sectionTitle}>Scholarships</Text>
      <ApiStatus loading={scholarshipsLoading} error={scholarshipsError} empty={!scholarshipsLoading && !scholarshipsError && !scholarships?.length} />
      {scholarships?.slice(0, 1).map((scholarship) => (
        <ScholarshipCard
          key={scholarship.id}
          title={`${scholarship.title} - Pakistan`}
          subtitle={`Deadline: ${formatDate(scholarship.deadline)}`}
          compact
          onPress={() => router.push({
            pathname: routes.scholarshipDetail,
            params: { id: scholarship.slug ?? scholarship.id },
          })}
        />
      ))}
      <Button label="View all scholarships" variant="outline" onPress={() => router.navigate(routes.scholarships)} />
      <Text style={styles.sectionTitle}>Research for you</Text>
      <ApiStatus loading={researchLoading} error={researchError} empty={!researchLoading && !researchError && !research?.length} />
      {research?.slice(0, 1).map((project) => (
        <ResearchCard
          key={project.id}
          project={project}
          onPress={() => router.push({
            pathname: routes.researchDetail,
            params: { id: project.slug ?? project.id },
          })}
        />
      ))}
    </MainLayout>
  );
}
