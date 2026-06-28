import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';

export default function LoginScreen({ navigation }: any) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    let valid = true;
    let localErrors: { email?: string; password?: string } = {};

    if (!email.includes('@')) {
      localErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    if (password.length < 6) {
      localErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(localErrors);

    if (valid) {
      const result = login(email, password);
      if (!result.success) {
        Alert.alert('Login Failed', result.message);
      }
      // If success, the navigator will automatically switch to the role-based tabs
      // because user state changes from null to a user object
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CareShare</Text>
      <Text style={styles.subtitle}>Welcome back! Please login to your account.</Text>

      <CustomInput
        label="Email Address"
        placeholder="example@mail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
      />

      <CustomInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        error={errors.password}
      />

      <View style={{ marginTop: 15 }} />

      <CustomButton title="Login" onPress={handleLogin} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 25,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary || 'green',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: COLORS.primary || 'green',
    fontWeight: 'bold',
    fontSize: 14,
  },
});