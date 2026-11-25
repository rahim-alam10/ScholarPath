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
        <Text style={styles.bodyStrong}>DAAD Master Studies in CS</Text>
        <Text style={styles.mutedText}>Deadline: Nov 15, 2026</Text>
        <Chip label="In progress" filled style={styles.fullChip} />
      </View>
      <View style={styles.card}>
        <Text style={styles.bodyStrong}>Erasmus Mundus Software Engineering</Text>
        <Text style={styles.mutedText}>Deadline: Nov 30, 2026</Text>
        <Chip label="Saved" style={styles.fullChip} />
      </View>
    </MainLayout>
  );
}
