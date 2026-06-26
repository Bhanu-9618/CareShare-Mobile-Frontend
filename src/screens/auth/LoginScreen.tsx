import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CareShare Login Screen</Text>
      <Button title="Go to SignUp" onPress={() => navigation.navigate('SignUp')} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Login (Go to Main App)" color="green" onPress={() => navigation.navigate('MainTabs')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }
});