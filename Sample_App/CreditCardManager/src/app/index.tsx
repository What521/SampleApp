import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardManager from '@/components/CardManager';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <CardManager />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
});