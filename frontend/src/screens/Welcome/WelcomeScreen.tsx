import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Controls';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles';

export default function WelcomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.welcomePage}>
      <Text style={styles.brand}>ScholarPath</Text>
      <Text style={styles.welcomeTitle}>Find scholarships you actually qualify for</Text>
      <Text style={styles.welcomeDescription}>
        Find scholarships and research opportunities across Pakistan that fit your academic goals.
      </Text>
      <View style={styles.welcomeActions}>
        <Button label="Create Free Profile" onPress={() => router.push(routes.account)} />
        <Button
          label="Log In"
          variant="outline"
          onPress={() => router.push({ pathname: routes.account, params: { mode: 'login' } })}
        />
      </View>
    </ScrollView>
  );
}
