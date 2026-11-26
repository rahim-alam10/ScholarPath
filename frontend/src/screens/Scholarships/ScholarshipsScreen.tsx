import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Chip } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { ScholarshipCard } from '../../components/specific/OpportunityCards';
import { scholarshipTitles } from '../../config/opportunities';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function ScholarshipsScreen() {
  return (
    <MainLayout title="Scholarships">
      <Text style={styles.heading}>Scholarship Results (14 Matches Found)</Text>
      <View style={styles.row}>
        <Chip label="Filters" filled onPress={() => router.push(routes.noMatches)} />
        <Chip label="Deadline" />
      </View>
      {scholarshipTitles.slice(0, 2).map((title, index) => (
        <ScholarshipCard
          key={title}
          title={title}
          subtitle={index === 0 ? 'Germany  •  Fully Funded  •  Deadline: Nov 15' : 'Europe  •  Full Tuition  •  Deadline: Nov 30'}
          onPress={() => router.push({ pathname: routes.scholarshipDetail, params: { id: index === 0 ? 'daad' : 'erasmus' } })}
        />
      ))}
      <Button label="Show no-match example" variant="outline" onPress={() => router.push(routes.noMatches)} />
    </MainLayout>
  );
}
