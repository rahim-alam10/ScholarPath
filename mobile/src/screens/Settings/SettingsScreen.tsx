import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { MainLayout } from '../../components/common/ScreenLayout';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';
import { styles } from '../../theme/styles';

const reminderLabels = [
  'Send email alert 30 days before deadline',
  'Send email alert 14 days before deadline',
  'Send urgent alert 3 days before deadline',
];

export default function SettingsScreen() {
  const { reminders, setReminders, language, setLanguage } = useAppState();
  return (
    <MainLayout title="Settings" onBack={() => router.back()}>
      <Text style={styles.heading}>Account & Notification Settings</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Deadline Reminder Alerts</Text>
        {reminderLabels.map((label, index) => (
          <View key={label} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{label}</Text>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: reminders[index] }}
              onPress={() => setReminders(reminders.map((value, i) => i === index ? !value : value))}
              style={[styles.switch, reminders[index] && styles.switchOn]}
            >
              <View style={[styles.switchKnob, reminders[index] && styles.switchKnobOn]} />
            </Pressable>
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Display & Language</Text>
        <Text style={styles.mutedText}>Language: {language} (Urdu available)</Text>
        <Button
          label={language}
          variant="outline"
          onPress={() => setLanguage(language === 'English' ? 'اردو' : 'English')}
        />
      </View>
      <Button label="Connection help" variant="outline" onPress={() => router.push(routes.connectionError)} />
    </MainLayout>
  );
}
