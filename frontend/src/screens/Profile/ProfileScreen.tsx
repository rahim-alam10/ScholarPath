import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { InfoBlock } from '../../components/specific/OpportunityCards';
import { useAppState } from '../../hooks/useAppState';
import { colors } from '../../config/theme';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function ProfileScreen() {
  const { profile, authenticatedUser, signOut } = useAppState();
  const [signOutError, setSignOutError] = useState('');
  const initials = profile.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  const fields = [
    profile.fullName,
    profile.email,
    profile.qualification,
    profile.fieldOfStudy,
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
        <Text style={styles.sectionTitle}>Academic qualifications</Text>
        <InfoBlock label="Qualification" value={display(profile.qualification)} />
        <InfoBlock label="Field of study" value={display(profile.fieldOfStudy)} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.mutedText}>Manage your app preferences and reminders.</Text>
        <Button label="Settings" variant="outline" onPress={() => router.push(routes.settings)} />
        {authenticatedUser ? (
          <Button
            label="Log out"
            variant="outline"
            onPress={() => {
              setSignOutError('');
              void signOut()
                .then(() => router.replace(routes.welcome))
                .catch((error: unknown) => {
                  setSignOutError(
                    error instanceof Error ? error.message : 'Unable to log out. Please try again.',
                  );
                });
            }}
          />
        ) : null}
        {signOutError ? (
          <Text accessibilityRole="alert" style={styles.formError}>{signOutError}</Text>
        ) : null}
      </View>
    </MainLayout>
  );
}
