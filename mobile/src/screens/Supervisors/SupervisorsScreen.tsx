import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Chip } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

export default function SupervisorsScreen() {
  const { setSelectedResearch } = useAppState();
  const showResearch = (index: number) => {
    setSelectedResearch(index);
    router.push({ pathname: routes.researchDetail, params: { id: String(index) } });
  };
  return (
    <MainLayout title="Supervisors">
      <Text style={styles.heading}>Find a supervisor</Text>
      <Text style={styles.mutedText}>Connect with researchers working in your field.</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dr. Maya Chen</Text>
        <Text style={styles.mutedText}>Machine Learning · Northbridge University</Text>
        <Chip label="View research interests" onPress={() => showResearch(0)} style={styles.fullChip} />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Prof. Oliver Grant</Text>
        <Text style={styles.mutedText}>Distributed Systems · Riverton Institute</Text>
        <Chip label="View research interests" onPress={() => showResearch(1)} style={styles.fullChip} />
      </View>
    </MainLayout>
  );
}
