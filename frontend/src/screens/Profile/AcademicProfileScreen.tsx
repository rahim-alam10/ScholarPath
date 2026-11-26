import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Chip, Field } from '../../components/common/Controls';
import { PageHeader } from '../../components/common/ScreenLayout';
import { useAppState } from '../../hooks/useAppState';
import type { ProfileData } from '../../state/AppState';
import { routes } from '../../navigation/routes';
import { colors } from '../../config/theme';
import { styles } from '../../theme/styles';

const availableCountries = ['Germany', 'United Kingdom', 'Netherlands', 'Canada'];

export default function AcademicProfileScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { profile, updateProfile } = useAppState();
  const [draft, setDraft] = useState<ProfileData>(() => ({
    ...profile,
    targetCountries: [...profile.targetCountries],
  }));
  const [error, setError] = useState('');
  const editingProfile = from === 'profile';
  const updateField = (field: keyof Omit<ProfileData, 'targetCountries'>, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };
  const toggleCountry = (country: string) => {
    setDraft((current) => ({
      ...current,
      targetCountries: current.targetCountries.includes(country)
        ? current.targetCountries.filter((item) => item !== country)
        : [...current.targetCountries, country],
    }));
  };
  const saveProfile = () => {
    if (!draft.fullName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    const cgpa = Number(draft.cgpa);
    if (draft.cgpa && (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 4)) {
      setError('CGPA must be between 0 and 4.');
      return;
    }

    updateProfile({
      ...draft,
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      cgpa: draft.cgpa.trim(),
      targetCountries: [...draft.targetCountries],
    });
    if (editingProfile) {
      router.back();
    } else {
      router.replace(routes.home);
    }
  };
  const cancel = () => {
    if (editingProfile) {
      router.back();
    } else {
      router.replace(routes.home);
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={[styles.pageContent, { paddingBottom: 16 }]}>
        <PageHeader title={editingProfile ? 'Edit profile' : 'Academic profile'} onBack={cancel} />
        <Text style={styles.heading}>
          {editingProfile ? 'Update your information' : 'Set up your profile'}
        </Text>
        <Text style={styles.mutedText}>
          Add your details to personalize scholarship and research opportunities.
        </Text>
        <View style={{ height: 8, borderRadius: 5, backgroundColor: '#E1E7F0', marginTop: 4, marginBottom: 12 }}>
          <View style={{ height: 8, width: '100%', borderRadius: 5, backgroundColor: colors.blue }} />
        </View>
        <Field
          label="Full name"
          value={draft.fullName}
          onChangeText={(value) => updateField('fullName', value)}
        />
        <Field
          label="Email address"
          value={draft.email}
          keyboardType="email-address"
          onChangeText={(value) => updateField('email', value)}
        />
        <Field
          label="CGPA (out of 4.0)"
          value={draft.cgpa}
          keyboardType="numeric"
          onChangeText={(value) => updateField('cgpa', value)}
        />
        <Field
          label="Degree level"
          value={draft.degreeLevel}
          onChangeText={(value) => updateField('degreeLevel', value)}
        />
        <Field
          label="Field of study"
          value={draft.fieldOfStudy}
          onChangeText={(value) => updateField('fieldOfStudy', value)}
        />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field
              label="English test"
              value={draft.englishTest}
              onChangeText={(value) => updateField('englishTest', value)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="Score"
              value={draft.englishScore}
              onChangeText={(value) => updateField('englishScore', value)}
            />
          </View>
        </View>
        <Text style={styles.bodyStrong}>Target countries</Text>
        <View style={styles.profileCountries}>
          {availableCountries.map((country) => {
            const selected = draft.targetCountries.includes(country);
            return (
              <Chip
                key={country}
                label={country}
                filled={selected}
                onPress={() => toggleCountry(country)}
                style={styles.profileCountryChip}
              />
            );
          })}
        </View>
        {error ? <Text style={styles.formError}>{error}</Text> : null}
      </ScrollView>
      <View style={[styles.row, { paddingHorizontal: 24, paddingVertical: 10, alignItems: 'center' }]}>
        <Button label={editingProfile ? 'Save changes' : 'Save & Continue'} onPress={saveProfile} />
        <Button label="Cancel" variant="outline" onPress={cancel} />
      </View>
    </View>
  );
}
