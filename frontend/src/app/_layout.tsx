import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '../navigation/AppNavigator';
import { GlobalLoadingIndicator } from '../components/common/GlobalLoadingIndicator';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <AppNavigator />
      <GlobalLoadingIndicator />
    </View>
  );
}
