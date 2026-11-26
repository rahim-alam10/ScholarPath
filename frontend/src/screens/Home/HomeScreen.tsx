import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { ResearchCard, ScholarshipCard, StatCard } from '../../components/specific/OpportunityCards';
import { researchProjects } from '../../config/opportunities';
import { colors } from '../../config/theme';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';
import { MainLayout } from '../../components/common/ScreenLayout';
import { homeStyles } from './Home.styles';

export default function HomeScreen() {
  const { query, setQuery } = useAppState();
  return (
    <MainLayout title="Home">
      <Text style={homeStyles.greeting}>Welcome back, Alex!</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search scholarships by name, country, or keyword..."
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
        multiline
      />
      <Button label="Search" onPress={() => router.push(query.toLowerCase().includes('no match') ? routes.noMatches : routes.scholarships)} />
      <View style={styles.row}>
        <StatCard title="Eligible Scholarships" value="14" caption="Fully match your profile" valueColor={colors.green} />
        <StatCard title="Almost Eligible" value="8" caption="Missing 1 minor requirement" valueColor={colors.orange} />
      </View>
      <View style={[styles.card, styles.deadlineSummary]}>
        <Text style={styles.bodyStrong}>Deadlines This Month</Text>
        <View style={styles.inline}>
          <Text style={[styles.statValue, { color: colors.red }]}>3</Text>
          <Text style={styles.mutedText}>Action required soon</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Scholarships Closing Soon</Text>
      <ScholarshipCard
        title="DAAD Master Studies in CS - Germany"
        subtitle="Deadline: Nov 15, 2026"
        compact
        onPress={() => router.push({ pathname: routes.scholarshipDetail, params: { id: 'daad' } })}
      />
      <Button label="View all scholarships" variant="outline" onPress={() => router.navigate(routes.scholarships)} />
      <Text style={styles.sectionTitle}>Research for you</Text>
      <ResearchCard
        project={researchProjects[0]}
        onPress={() => router.push({ pathname: routes.researchDetail, params: { id: '0' } })}
      />
    </MainLayout>
  );
}
