import { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Chip, TextButton } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { ResearchCard } from '../../components/specific/OpportunityCards';
import { researchProjects } from '../../config/opportunities';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';
import { useAppState } from '../../hooks/useAppState';

export default function ResearchScreen() {
  const [showTopics, setShowTopics] = useState(false);
  const { setSelectedResearch } = useAppState();
  const openProject = (index: number) => {
    setSelectedResearch(index);
    router.push({ pathname: routes.researchDetail, params: { id: String(index) } });
  };
  return (
    <MainLayout title="Research">
      <Text style={styles.heading}>Research opportunities</Text>
      <Text style={styles.mutedText}>Example projects and assistantships matched to your interests.</Text>
      <Chip label="All research topics" onPress={() => setShowTopics(true)} style={styles.fullChip} />
      <View style={styles.row}>
        <Chip label="Filters" filled onPress={() => setShowTopics(true)} />
        <Chip label="Saved" onPress={() => router.push(routes.savedResearch)} />
      </View>
      <Text style={styles.bodyStrong}>3 sample opportunities</Text>
      {researchProjects.map((project, index) => (
        <ResearchCard key={project.title} project={project} onPress={() => openProject(index)} />
      ))}
      <Modal visible={showTopics} transparent animationType="fade" onRequestClose={() => setShowTopics(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.topicsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.sectionTitle}>Search research</Text>
              <TextButton label="×" onPress={() => setShowTopics(false)} />
            </View>
            <Text style={styles.mutedText}>Choose a topic to preview matching example opportunities.</Text>
            {['AI & machine learning', 'Distributed systems', 'Climate & data science', 'All research topics'].map((topic, index) => (
              <Chip
                key={topic}
                label={topic}
                onPress={() => {
                  setShowTopics(false);
                  openProject(index === 1 ? 1 : index === 2 ? 2 : 0);
                }}
                style={styles.fullChip}
              />
            ))}
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
}
