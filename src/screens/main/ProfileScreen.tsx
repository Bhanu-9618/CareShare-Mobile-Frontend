import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useApp } from '../../context/AppContext';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useMutation } from '@tanstack/react-query';
import { commonService } from '../../services/commonService';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useApp();
  
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [errors, setErrors] = useState<any>({});

  const updateMutation = useMutation({
    mutationFn: commonService.updateProfile,
    onSuccess: () => {
      // Update global context so the UI reflects the new name/address immediately
      updateProfile(name, address);
      Alert.alert('Success', 'Profile updated successfully!');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      Alert.alert('Error', msg);
    }
  });

  const handleUpdate = () => {
    let valid = true;
    let localErrors: any = {};

    if (!name.trim()) {
      localErrors.name = 'Name is required';
      valid = false;
    }
    if (!address.trim()) {
      localErrors.address = 'Address is required';
      valid = false;
    }

    setErrors(localErrors);

    if (valid) {
      const payload: any = {};
      let hasChanges = false;

      if (name.trim() !== user?.name) {
        payload.name = name.trim();
        hasChanges = true;
      }
      if (address.trim() !== user?.address) {
        payload.address = address.trim();
        hasChanges = true;
      }

      if (!hasChanges) {
        Alert.alert('No Changes', 'You have not changed your name or address.');
        return;
      }

      updateMutation.mutate(payload);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.roleText}>{user?.role || 'Unknown'} Account</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.readOnlyLabel}>Email Address</Text>
        <Text style={styles.readOnlyValue}>{user?.email || ''}</Text>

        <CustomInput
          label="Full Name"
          placeholder="Update your name"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

        <CustomInput
          label="Address"
          placeholder="Update your address"
          value={address}
          onChangeText={setAddress}
          error={errors.address}
        />
        
        <View style={{ marginTop: 10 }} />
        <CustomButton 
          title={updateMutation.isPending ? "Updating..." : "Update Profile"} 
          onPress={handleUpdate} 
          disabled={updateMutation.isPending}
        />
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton title="Log Out" onPress={logout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 25,
    justifyContent: 'space-between',
  },
  profileCard: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 30,
  },
  readOnlyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  readOnlyValue: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  logoutContainer: {
    marginBottom: 20,
  },
});