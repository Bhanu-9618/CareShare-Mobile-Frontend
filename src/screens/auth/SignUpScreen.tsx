import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';

export default function SignUpScreen({ navigation }: any) {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'Donor' | 'Volunteer' | 'Receiver'>('Donor');
  const [errors, setErrors] = useState<any>({});

  const roles: ('Donor' | 'Volunteer' | 'Receiver')[] = ['Donor', 'Volunteer', 'Receiver'];

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
    if (password.length < 6) {
      localErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    if (!address.trim()) {
      localErrors.address = 'Address is required';
      valid = false;
    }

    setErrors(localErrors);

    if (valid) {
      const result = register(name, email, password, role, address);
      if (result.success) {
        Alert.alert('Success', result.message, [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Registration Failed', result.message);
      }
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

      <CustomButton title="Register" onPress={handleSignUp} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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