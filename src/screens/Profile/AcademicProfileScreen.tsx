import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Chip, Field, TextButton } from '../../components/common/Controls';
import { PageHeader } from '../../components/common/ScreenLayout';
import { routes } from '../../navigation/routes';
import { colors } from '../../config/theme';
import { styles } from '../../theme/styles';

export default function AcademicProfileScreen() {
  const goHome = () => router.replace(routes.home);
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={[styles.pageContent, { paddingBottom: 16 }]}>
        <PageHeader title="Academic profile" onBack={() => router.back()} />
        <Text style={styles.heading}>Setup Your Academic Profile (Step 1 of 2)</Text>
        <View style={{ height: 8, borderRadius: 5, backgroundColor: '#E1E7F0', marginTop: 4, marginBottom: 12 }}>
          <View style={{ height: 8, width: '50%', borderRadius: 5, backgroundColor: colors.blue }} />
        </View>
        <Field label="CGPA (Out of 4.0):" value="3.75" />
        <Field label="Degree Level:" value="Master’s" />
        <Field label="Field of Study:" value="Computer Science" />
        <Field label="English Test & Score:" value="IELTS 7.5" />
        <Text style={styles.bodyStrong}>Target Countries:</Text>
        <View style={styles.row}><Chip label="Germany ×" /><Chip label="UK ×" /></View>
        <View style={styles.row}><Chip label="Netherlands ×" /><Chip label="Canada ×" /></View>
      </ScrollView>
      <View style={[styles.row, { paddingHorizontal: 24, paddingVertical: 10, alignItems: 'center' }]}>
        <Button label="Save & Continue" onPress={goHome} />
        <TextButton label="Skip for now" onPress={goHome} />
      </View>
    </View>
  );
}
