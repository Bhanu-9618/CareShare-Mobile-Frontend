import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { COLORS } from './src/constants/colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.card}>
        <FontAwesome5 name="heartbeat" size={50} color={COLORS.primary} />

        <Text style={styles.title}>CareShare Framework</Text>
        <Text style={styles.subtitle}>Phase 2: Vector Icons & Global Styling Connected 🚀</Text>

        <View style={styles.iconRow}>
          <MaterialIcons name="verified-user" size={30} color={COLORS.success} />
          <FontAwesome5 name="hands-helping" size={26} color={COLORS.warning} />
          <FontAwesome5 name="user-circle" size={28} color={COLORS.textLight} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Global Background
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
    elevation: 5, // Android Shadow
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 25,
    alignItems: 'center',
  },
});

export default App;