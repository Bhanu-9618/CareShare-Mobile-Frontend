import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { decodeJwt } from '../../utils/jwtUtils';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const loginMutation = useMutation({
    mutationFn: () => authService.login(email, password),
    onSuccess: (data) => {

      const idToken = data.IdToken || data.token;
      if (!idToken) {
        Alert.alert('Login Error', 'Failed to retrieve user token from server.');
        return;
      }

      const decoded = decodeJwt(idToken);
      if (!decoded) {
        Alert.alert('Login Error', 'Failed to decode user token.');
        return;
      }


      const roleStr = decoded['custom:role'] || 'Donor';

      const formattedRole = roleStr.charAt(0).toUpperCase() + roleStr.slice(1).toLowerCase();

      login({
        id: decoded.sub,
        name: decoded.name || decoded.email || 'User',
        email: decoded.email,
        role: formattedRole as 'Donor' | 'Volunteer' | 'Receiver',
        address: decoded.address?.formatted || 'Unknown Address',
      });

    },
    onError: (error: unknown) => {
      const err = error as any;
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Login Failed';
      if (err.response?.status === 401 || errorMessage.toLowerCase().includes('invalid')) {
        Alert.alert('Invalid credentials', 'Please check your details or register.');
      } else {
        Alert.alert('Login Failed', errorMessage);
      }
    }
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    loginMutation.mutate();
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

      <CustomButton 
        title={loginMutation.isPending ? "Logging in..." : "Login"} 
        onPress={handleLogin} 
        disabled={loginMutation.isPending}
      />

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