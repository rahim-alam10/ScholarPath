import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Field, TextButton } from '../../components/common/Controls';
import { PageHeader } from '../../components/common/ScreenLayout';
import { login, register } from '../../api/userApi';
import type { AcademicProfile as AcademicProfileInput } from '../../api/userApi';
import { useAppState } from '../../hooks/useAppState';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function AccountScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isLogin = mode === 'login';
  const { setAuthenticatedSession } = useAppState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qualification, setQualification] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password || password.length > 128) {
      setError('Password is required and must be 128 characters or fewer.');
      return;
    }
    if (!isLogin && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!isLogin && !/[^A-Za-z0-9\s]/.test(password)) {
      setError('Password must include at least one special character.');
      return;
    }
    if (!isLogin && !name.trim()) {
      setError('Enter your name to create an account.');
      return;
    }
    setSubmitting(true);
    try {
      const academicProfile: AcademicProfileInput = {
        qualification: qualification.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
      };
      const session = isLogin
        ? await login(normalizedEmail, password)
        : await register(name.trim(), normalizedEmail, password, academicProfile);
      await setAuthenticatedSession(session.token, session.user);
      router.replace(routes.home);
    } catch (requestError) {
      setError(requestError instanceof Error
        ? requestError.message
        : 'Unable to connect to the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <PageHeader title="Account" onBack={() => router.back()} />
      <Text style={[styles.heading, { marginTop: 22, marginBottom: 16 }]}>
        {isLogin ? 'Log In' : 'Create Your Account'}
      </Text>
      {!isLogin ? (
        <>
          <Text style={styles.accountSectionTitle}>Account details</Text>
          <Field label="Full name" value={name} onChangeText={setName} />
        </>
      ) : null}
      <Field
        label="Email address"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <Field
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Text style={styles.accountHint}>
        {isLogin
          ? 'Enter the password for your account.'
          : 'Use at least 8 characters and include a special character (for example: !, @, or #).'}
      </Text>
      {!isLogin ? (
        <>
          <Field
            label="Academic qualification"
            value={qualification}
            onChangeText={setQualification}
          />
          <Field
            label="Field of study"
            value={fieldOfStudy}
            onChangeText={setFieldOfStudy}
          />
        </>
      ) : null}
      {error ? <Text accessibilityRole="alert" style={styles.formError}>{error}</Text> : null}
      <Button
        label={submitting ? 'Please wait…' : isLogin ? 'Log In' : 'Create Account'}
        onPress={() => { void submit(); }}
        disabled={submitting}
        style={{ marginTop: 26 }}
      />
      <TextButton
        label={isLogin ? 'Create an account' : 'Sign up / Log in'}
        onPress={() => {
          setError('');
          router.setParams({ mode: isLogin ? 'create' : 'login' });
        }}
      />
    </ScrollView>
  );
}
