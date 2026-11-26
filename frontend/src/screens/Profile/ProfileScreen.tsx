import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Chip } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { InfoBlock } from '../../components/specific/OpportunityCards';
import { useAppState } from '../../hooks/useAppState';
import { colors } from '../../config/theme';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function ProfileScreen() {
  const { profile } = useAppState();
  const initials = profile.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  const fields = [
    profile.fullName,
    profile.email,
    profile.cgpa,
    profile.degreeLevel,
    profile.fieldOfStudy,
    profile.englishTest,
    profile.englishScore,
    profile.targetCountries.length ? 'countries' : '',
  ];
  const completeness = Math.round(
    (fields.filter((value) => value.trim().length > 0).length / fields.length) * 100,
  );
  const display = (value: string) => value.trim() || 'Not added yet';

  return (
    <MainLayout title="My profile" onBack={() => router.back()}>
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{initials || '?'}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.profileName}>{profile.fullName || 'Your name'}</Text>
            <Text style={styles.mutedText}>{profile.email || 'Add an email address'}</Text>
          </View>
        </View>
        <Button
          label="Edit profile"
          variant="outline"
          onPress={() => router.push({
            pathname: routes.academicProfile,
            params: { from: 'profile' },
          })}
        />
        <View style={styles.completenessHeader}>
          <Text style={styles.bodyStrong}>Profile completeness</Text>
          <Text style={[styles.bodyStrong, { color: colors.blue }]}>{completeness}%</Text>
        </View>
        <View
          style={styles.completionTrack}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: completeness }}
        >
          <View style={[styles.completionFill, { width: `${completeness}%` }]} />
        </View>
      </View>

      <View style={styles.softCard}>
        <Text style={styles.sectionTitle}>Academic profile</Text>
        <InfoBlock label="CGPA" value={display(profile.cgpa)} />
        <InfoBlock label="Degree level" value={display(profile.degreeLevel)} />
        <InfoBlock label="Field of study" value={display(profile.fieldOfStudy)} />
        <InfoBlock
          label="English test"
          value={[profile.englishTest, profile.englishScore].filter(Boolean).join(' · ') || 'Not added yet'}
        />
      </View>

      <View style={styles.softCard}>
        <Text style={styles.sectionTitle}>Target countries</Text>
        {profile.targetCountries.length ? (
          <View style={styles.profileCountries}>
            {profile.targetCountries.map((country) => (
              <Chip key={country} label={country} style={styles.profileCountryChip} />
            ))}
          </View>
        ) : (
          <Text style={styles.mutedText}>Add countries you’re interested in to personalize your matches.</Text>
        )}
        <Button
          label="Update academic profile"
          variant="outline"
          onPress={() => router.push({
            pathname: routes.academicProfile,
            params: { from: 'profile' },
          })}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.mutedText}>Manage your app preferences and reminders.</Text>
        <Button label="Settings" variant="outline" onPress={() => router.push(routes.settings)} />
      </View>
    </MainLayout>
  );
}
