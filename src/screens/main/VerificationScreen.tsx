import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import CustomButton from '../../components/CustomButton';

export default function VerificationScreen({ route, navigation }: any) {
  const { foodId } = route.params;
  const { updateFoodStatus } = useApp();
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerifyAndComplete = () => {
    const enteredOtp = otp.join('');

    if (enteredOtp === '1234') {
      updateFoodStatus(foodId, 'Completed');

      Alert.alert('Delivery Confirmed', 'Thank you! The donation workflow has been successfully completed.', [
        {
          text: 'Great',
          onPress: () => {
            navigation.navigate('MainTabs');
          },
        },
      ]);
    } else {
      Alert.alert('Verification Failed', 'Invalid OTP code. Please enter the correct 4-digit code provided by the receiver (Hint: 1234).');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Verification</Text>
      <Text style={styles.subtitle}>Enter the 4-digit verification code provided by the care center to complete the delivery.</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
          />
        ))}
      </View>

      <View style={{ marginTop: 40 }} />

      <CustomButton title="Verify & Complete" onPress={handleVerifyAndComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#ced4da',
    borderRadius: 12,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    backgroundColor: '#f8f9fa',
  },
});