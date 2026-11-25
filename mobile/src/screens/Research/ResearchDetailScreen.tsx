import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { InfoBlock } from '../../components/specific/OpportunityCards';
import { researchProjects } from '../../config/opportunities';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function ResearchDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const index = Math.min(Math.max(Number(id) || 0, 0), researchProjects.length - 1);
  const project = researchProjects[index];
  const { savedResearch, setSavedResearch } = useAppState();
  return (
    <MainLayout
      title="Research project"
      onBack={() => router.back()}
      footer={
        <Button
          label={savedResearch ? 'Saved opportunity' : 'Save opportunity'}
          onPress={() => setSavedResearch(!savedResearch)}
        />
      }
    >
      <Text style={styles.mutedText}>Example opportunity</Text>
      <Text style={styles.heading}>{project.title}</Text>
      <Text style={styles.bodyStrong}>{project.university.split(' · ')[0]}</Text>
      <Text style={styles.mutedText}>{project.university.split(' · ')[1]}</Text>
      <View style={[styles.card, styles.projectInfo]}>
        <InfoBlock label="Opportunity type" value={project.kind} />
        <InfoBlock label="Funding" value={project.funding} />
        <InfoBlock label="Duration" value="6 months · part-time" />
        <InfoBlock label="Application deadline" value={project.deadline} />
      </View>
      <Text style={styles.sectionTitle}>About the research</Text>
      <Text style={styles.mutedText}>
        Help develop accessible research tools. Work with a small research team to prototype models, evaluate results, and share findings.
      </Text>
    </MainLayout>
  );
}
