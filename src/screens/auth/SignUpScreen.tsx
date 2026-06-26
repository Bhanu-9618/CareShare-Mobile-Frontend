import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function SignUpScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CareShare SignUp Screen</Text>
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }
});