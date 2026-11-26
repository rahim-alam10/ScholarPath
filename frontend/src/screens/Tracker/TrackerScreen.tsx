import { Text, View } from 'react-native';
import { Chip } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { styles } from '../../theme/styles';

export default function TrackerScreen() {
  return (
    <MainLayout title="Application tracker">
      <Text style={styles.heading}>Your application tracker</Text>
      <Text style={styles.mutedText}>Keep every opportunity and deadline organized.</Text>
      <View style={styles.card}>
        <Text style={styles.bodyStrong}>HEC Need-Based Scholarship Programme</Text>
        <Text style={styles.mutedText}>Check with your university for current application dates.</Text>
        <Chip label="In progress" filled style={styles.fullChip} />
      </View>
      <View style={styles.card}>
        <Text style={styles.bodyStrong}>HEC Indigenous Ph.D. Fellowship</Text>
        <Text style={styles.mutedText}>Application dates depend on the current HEC call.</Text>
        <Chip label="Saved" style={styles.fullChip} />
      </View>
    </MainLayout>
  );
}
