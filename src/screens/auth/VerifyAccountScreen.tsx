import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { COLORS } from '../../constants/colors';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'VerifyAccount'>;

export default function VerifyAccountScreen({ route, navigation }: Props) {
  const { email } = route.params || {};
  const [otp, setOtp] = useState('');

  const verifyMutation = useMutation({
    mutationFn: (code: string) => authService.verify(email, code),
    onSuccess: (data) => {
      Alert.alert('Success', data.message || 'Email verified successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    },
    onError: (error: unknown) => {
      const err = error as any;
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Invalid verification code provided, please try again.';
      Alert.alert('Verification Failed', errorMessage);
    }
  });

  const handleVerify = () => {
    if (otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP code.');
      return;
    }
    verifyMutation.mutate(otp);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Verify Account</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your email/phone.</Text>

      <CustomInput
        label="OTP Code"
        placeholder="Enter 4-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />

      <View style={{ marginTop: 20 }} />

      <CustomButton 
        title={verifyMutation.isPending ? "Verifying..." : "Verify"} 
        onPress={handleVerify} 
        disabled={verifyMutation.isPending}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Back to Register Form</Text>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  backLink: {
    color: COLORS.primary || 'green',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
