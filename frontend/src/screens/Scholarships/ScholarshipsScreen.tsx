import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Chip } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { ScholarshipCard } from '../../components/specific/OpportunityCards';
import { ApiStatus } from '../../components/common/ApiStatus';
import { useApiData } from '../../hooks/useApiData';
import type { Scholarship } from '../../api/opportunityApi';
import { formatDate } from '../../utils/formatDate';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function ScholarshipsScreen() {
  const { data: scholarships, loading, error } = useApiData<Scholarship[]>('/scholarships');
  return (
    <MainLayout title="Scholarships">
      <Text style={styles.heading}>
        Scholarship Results ({scholarships?.length ?? 0} Matches Found)
      </Text>
      <View style={styles.row}>
        <Chip label="Filters" filled onPress={() => router.push(routes.noMatches)} />
        <Chip label="Deadline" />
      </View>
      <ApiStatus loading={loading} error={error} empty={!loading && !error && !scholarships?.length} />
      {scholarships?.map((scholarship) => (
        <ScholarshipCard
          key={scholarship.id}
          title={scholarship.title}
          subtitle={`${scholarship.country ?? 'International'}  •  ${scholarship.funding ?? 'Funding details unavailable'}  •  Deadline: ${formatDate(scholarship.deadline)}`}
          onPress={() => router.push({
            pathname: routes.scholarshipDetail,
            params: { id: scholarship.slug ?? scholarship.id },
          })}
        />
      ))}
      <Button label="Show no-match example" variant="outline" onPress={() => router.push(routes.noMatches)} />
    </MainLayout>
  );
}
