import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AcademicQualificationField,
  Button,
  Field,
} from '../../components/common/Controls';
import { PageHeader } from '../../components/common/ScreenLayout';
import { useAppState } from '../../hooks/useAppState';
import type { ProfileData } from '../../state/AppState';
import { routes } from '../../navigation/routes';
import { colors } from '../../config/theme';
import { styles } from '../../theme/styles';

export default function AcademicProfileScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { profile, updateProfile } = useAppState();
  const [draft, setDraft] = useState<ProfileData>(() => ({ ...profile }));
  const [error, setError] = useState('');
  const editingProfile = from === 'profile';
  const updateField = (field: keyof ProfileData, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
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
    updateProfile({
      ...draft,
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      qualification: draft.qualification.trim(),
      fieldOfStudy: draft.fieldOfStudy.trim(),
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
        <Text style={styles.mutedText}>Add your details to personalize Pakistani scholarships and research opportunities.</Text>
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
        <AcademicQualificationField
          value={draft.qualification}
          onChange={(value) => updateField('qualification', value)}
        />
        <Field
          label="Field of study"
          value={draft.fieldOfStudy}
          onChangeText={(value) => updateField('fieldOfStudy', value)}
        />
        {error ? <Text style={styles.formError}>{error}</Text> : null}
      </ScrollView>
      <View style={[styles.row, { paddingHorizontal: 24, paddingVertical: 10, alignItems: 'center' }]}>
        <Button label={editingProfile ? 'Save changes' : 'Save & Continue'} onPress={saveProfile} />
        <Button label="Cancel" variant="outline" onPress={cancel} />
      </View>
    </View>
  );
}
