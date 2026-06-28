import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function AddFoodScreen({ navigation }: any) {
  const { addFoodItem, user } = useApp();

  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handlePostDonation = () => {
    let valid = true;
    let localErrors: any = {};

    if (!foodName.trim()) {
      localErrors.foodName = 'Food name is required';
      valid = false;
    }
    if (!quantity.trim()) {
      localErrors.quantity = 'Quantity is required';
      valid = false;
    }
    if (!expiryTime.trim()) {
      localErrors.expiryTime = 'Expiry time is required';
      valid = false;
    }

    setErrors(localErrors);

    if (valid) {
      addFoodItem(foodName, quantity, expiryTime);

      Alert.alert('Success', 'Donation posted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setFoodName('');
            setQuantity('');
            setExpiryTime('');
            navigation.navigate('Donor Home');
          },
        },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post New Donation</Text>
      <Text style={styles.subtitle}>Fill in the details to share excess food.</Text>

      <CustomInput
        label="Food Item Name"
        placeholder="e.g., Chicken Biryani, Bread Packets"
        value={foodName}
        onChangeText={setFoodName}
        error={errors.foodName}
      />

      <CustomInput
        label="Quantity"
        placeholder="e.g., 10 Packets, 5 KG"
        value={quantity}
        onChangeText={setQuantity}
        error={errors.quantity}
      />

      <CustomInput
        label="Expiry Time"
        placeholder="e.g., 09:30 PM, In 2 hours"
        value={expiryTime}
        onChangeText={setExpiryTime}
        error={errors.expiryTime}
      />

      <View style={{ marginTop: 20 }} />

      <CustomButton title="Post Donation" onPress={handlePostDonation} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
});