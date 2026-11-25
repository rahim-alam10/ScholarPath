import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { InfoBlock } from '../../components/specific/OpportunityCards';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function ProfileScreen() {
  return (
    <MainLayout title="Your profile" onBack={() => router.back()}>
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}><Text style={styles.avatarLargeText}>AM</Text></View>
          <Text style={styles.profileName}>Alex Morgan</Text>
        </View>
        <Text style={styles.mutedText}>Computer Science Student • BS Computer Science</Text>
        <Button label="Edit Profile" variant="outline" onPress={() => router.push(routes.academicProfile)} style={styles.profileEdit} />
        <Text style={styles.bodyStrong}>Profile Completeness: 85%</Text>
        <View style={styles.completionTrack}><View style={styles.completionFill} /></View>
      </View>
      <View style={[styles.softCard, { padding: 22, marginTop: 2 }]}>
        <Text style={styles.sectionTitle}>Academic Information Summary</Text>
        <InfoBlock label="CGPA:" value="3.75" />
        <InfoBlock label="Target Degree:" value="Master’s" />
        <InfoBlock label="Field of Study:" value="Computer Science" />
        <Button label="Settings" variant="outline" onPress={() => router.push(routes.settings)} />
      </View>
    </MainLayout>
  );
}
