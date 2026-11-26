import { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Chip, TextButton } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { ResearchCard } from '../../components/specific/OpportunityCards';
import { ApiStatus } from '../../components/common/ApiStatus';
import type { ResearchOpportunity } from '../../api/opportunityApi';
import { useApiData } from '../../hooks/useApiData';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';
import { useAppState } from '../../hooks/useAppState';

export default function ResearchScreen() {
  const [showTopics, setShowTopics] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { setSelectedResearch } = useAppState();
  const { data: projects, loading, error } = useApiData<ResearchOpportunity[]>('/research');
  const topics = [...new Set(projects?.flatMap((project) => project.topics) ?? [])];
  const filteredProjects = selectedTopic
    ? projects?.filter((project) => project.topics.includes(selectedTopic))
    : projects;
  const openProject = (slug: string) => {
    setSelectedResearch(slug);
    router.push({ pathname: routes.researchDetail, params: { id: slug } });
  };
  return (
    <MainLayout title="Research">
      <Text style={styles.heading}>Research opportunities</Text>
      <Text style={styles.mutedText}>Projects and assistantships matched to your interests.</Text>
      <Chip label="All research topics" onPress={() => setShowTopics(true)} style={styles.fullChip} />
      <View style={styles.row}>
        <Chip label="Filters" filled onPress={() => setShowTopics(true)} />
        <Chip label="Saved" onPress={() => router.push(routes.savedResearch)} />
      </View>
      <Text style={styles.bodyStrong}>
        {filteredProjects?.length ?? 0} {selectedTopic ? 'matching' : ''} opportunities
      </Text>
      <ApiStatus loading={loading} error={error} empty={!loading && !error && !filteredProjects?.length} />
      {filteredProjects?.map((project) => (
        <ResearchCard
          key={project.id}
          project={project}
          onPress={() => openProject(project.slug ?? project.id)}
        />
      ))}
      <Modal visible={showTopics} transparent animationType="fade" onRequestClose={() => setShowTopics(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.topicsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.sectionTitle}>Search research</Text>
              <TextButton label="×" onPress={() => setShowTopics(false)} />
            </View>
            <Text style={styles.mutedText}>Choose a topic to filter opportunities.</Text>
            <Chip
              label="All research topics"
              onPress={() => {
                setSelectedTopic(null);
                setShowTopics(false);
              }}
              style={styles.fullChip}
            />
            {topics.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                onPress={() => {
                  setSelectedTopic(topic);
                  setShowTopics(false);
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
