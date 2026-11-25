import { ScrollView, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Field, TextButton } from '../../components/common/Controls';
import { PageHeader } from '../../components/common/ScreenLayout';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function AccountScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isLogin = mode === 'login';
  return (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <PageHeader title="Account" onBack={() => router.back()} />
      <Text style={[styles.heading, { marginTop: 22, marginBottom: 54 }]}>
        {isLogin ? 'Log In' : 'Create Your Account'}
      </Text>
      <Field label="Email Address" value="alex.morgan@email.com" keyboardType="email-address" />
      <Field label="Password" value="ScholarPath2026" secureTextEntry />
      <Button
        label={isLogin ? 'Log In' : 'Create Account'}
        onPress={() => router.push(routes.academicProfile)}
        style={{ marginTop: 26 }}
      />
      <TextButton
        label={isLogin ? 'Create an account' : 'Sign up / Log in'}
        onPress={() => router.setParams({ mode: isLogin ? 'create' : 'login' })}
      />
      <Text style={[styles.smallMuted, { marginTop: 42 }]}>Interactive preview · sample account details</Text>
    </ScrollView>
  );
}
