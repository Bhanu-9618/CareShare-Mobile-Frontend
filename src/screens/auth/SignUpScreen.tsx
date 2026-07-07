import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { COLORS } from '../../constants/colors';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'Donor' | 'Volunteer' | 'Receiver'>('Donor');
  const [errors, setErrors] = useState<any>({});

  const roles: ('Donor' | 'Volunteer' | 'Receiver')[] = ['Donor', 'Volunteer', 'Receiver'];

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Navigate to verify account screen with the email we just registered
      navigation.navigate('VerifyAccount', { email });
    },
    onError: (error: any, variables: any) => {
      // Handle the 400 Bad Request if email exists or other errors
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration Failed';

      if (errorMessage.toLowerCase().includes('already exist') || errorMessage.toLowerCase().includes('registered successfully')) {
        Alert.alert('Email already exists!', 'Please verify your account or login.', [
          { text: 'Verify', onPress: () => navigation.navigate('VerifyAccount', { email: variables.email }) },
          { text: 'Login', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Registration Failed', errorMessage);
      }
    }
  });

  const handleSignUp = () => {
    let valid = true;
    let localErrors: any = {};

    if (!name.trim()) {
      localErrors.name = 'Name is required';
      valid = false;
    }
    if (!email.includes('@')) {
      localErrors.email = 'Valid email is required';
      valid = false;
    }

    // Password rules: Min 8, 1 uppercase, 1 lowercase, 1 number, 1 symbol
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,}$/;
    if (!passwordRegex.test(password)) {
      localErrors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol';
      valid = false;
    }

    if (!address.trim()) {
      localErrors.address = 'Address is required';
      valid = false;
    }

    setErrors(localErrors);

    if (valid) {
      registerMutation.mutate({
        email,
        password,
        name,
        role: role.toUpperCase(),
        address
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join us and help reduce food waste today.</Text>

      <CustomInput
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />

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
        placeholder="Create a strong password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        error={errors.password}
      />

      <CustomInput
        label="Address"
        placeholder="123 Main St, City"
        value={address}
        onChangeText={setAddress}
        error={errors.address}
      />

      {/* Custom Role Selection UI */}
      <Text style={styles.roleLabel}>Register As:</Text>
      <View style={styles.roleContainer}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.roleButton,
              role === r && { backgroundColor: COLORS.primary || 'green', borderColor: COLORS.primary }
            ]}
            onPress={() => setRole(r)}
          >
            <Text style={[styles.roleButtonText, role === r && { color: '#fff' }]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 20 }} />

      <CustomButton
        title={registerMutation.isPending ? "Registering..." : "Register"}
        onPress={handleSignUp}
        disabled={registerMutation.isPending}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => {
          // Clear form when going to login
          setName('');
          setEmail('');
          setPassword('');
          setAddress('');
          setErrors({});
          navigation.goBack();
        }}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roleButton: {
    flex: 1,
    height: 45,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#fafafa',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
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
  loginLink: {
    color: COLORS.primary || 'green',
    fontWeight: 'bold',
    fontSize: 14,
  },
});