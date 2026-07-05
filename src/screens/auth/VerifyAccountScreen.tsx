import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { COLORS } from '../../constants/colors';

export default function VerifyAccountScreen({ navigation }: any) {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP code.');
      return;
    }
    // Simulate successful verification
    Alert.alert('Success', 'Account verified successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
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

      <CustomButton title="Verify" onPress={handleVerify} />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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
