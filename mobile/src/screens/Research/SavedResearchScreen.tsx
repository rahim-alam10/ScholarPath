import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { ResearchCard } from '../../components/specific/OpportunityCards';
import { researchProjects } from '../../config/opportunities';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function SavedResearchScreen() {
  const { savedResearch, selectedResearch } = useAppState();
  return (
    <MainLayout title="Saved research" onBack={() => router.back()}>
      <Text style={styles.heading}>Saved research</Text>
      <Text style={styles.mutedText}>Keep promising projects in one place.</Text>
      {savedResearch ? (
        <ResearchCard
          project={researchProjects[selectedResearch]}
          onPress={() => router.push({ pathname: routes.researchDetail, params: { id: String(selectedResearch) } })}
        />
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
