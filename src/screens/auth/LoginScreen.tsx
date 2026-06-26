import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CareShare</Text>
      
      <CustomInput 
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <CustomInput 
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <View style={{ marginTop: 10, width: '100%' }} />

      <CustomButton 
        title="Login" 
        onPress={() => navigation.navigate('MainTabs')} 
      />
      
      <CustomButton 
        title="Create an Account" 
        backgroundColor="#6c757d"
        onPress={() => navigation.navigate('SignUp')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    padding: 20
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: 'green', 
    marginBottom: 30 
  }
});