import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import CustomButton from '../../components/CustomButton';

export default function AdvancedVerificationScreen({ route, navigation }: any) {
  const { foodId } = route.params;
  const { foodList, updateFoodStatus } = useApp();
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);

  const currentItem = foodList.find((item) => item.id === foodId);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...enteredOtp];
    newOtp[index] = value;
    setEnteredOtp(newOtp);
  };

  const handleFinalHandover = () => {
    const finalCode = enteredOtp.join('');

    if (!currentItem) {
      Alert.alert('Error', 'Food item data not found.');
      return;
    }

    if (finalCode === currentItem.generatedOtp) {
      updateFoodStatus(foodId, 'Completed', currentItem.currentVolunteerId, currentItem.assignedReceiverId, currentItem.generatedOtp);
      
      Alert.alert('Handover Success', 'OTP verified! Food donation successfully marked as Completed.', [
        {
          text: 'Finish Task',
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]);
    } else {
      Alert.alert(
        'Verification Error',
        `The OTP you entered does not match the Receiver's secure token. (Hint: Check the active OTP inside the Receiver Requests/Inventory tab)`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Handover</Text>
      <Text style={styles.subtitle}>
        Ask the Receiver for the secure 4-digit code displayed on their screen to complete the distribution.
      </Text>

      <View style={styles.itemCard}>
        <Text style={styles.itemName}>{currentItem?.foodName}</Text>
        <Text style={styles.itemHotel}>🏢 Sourced: {currentItem?.hotelName}</Text>
        <Text style={styles.addressText}>Location: {currentItem?.address}</Text>
      </View>

      <View style={styles.otpContainer}>
        {enteredOtp.map((digit, index) => (
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

      <CustomButton title="Verify & Arrive at Destination" onPress={handleFinalHandover} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
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
    marginBottom: 30,
  },
  itemCard: {
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  itemHotel: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#888888',
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