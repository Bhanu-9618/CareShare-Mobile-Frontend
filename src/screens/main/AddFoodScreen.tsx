import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useApp } from '../../context/AppContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { commonService } from '../../services/commonService';
import { donorService } from '../../services/donorService';

export default function AddFoodScreen({ navigation }: any) {
  const { user } = useApp();

  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSelectImage = () => {
    Alert.alert(
      'Upload Photo',
      'Choose a method',
      [
        { 
          text: 'Take Photo', 
          onPress: () => launchCamera({ mediaType: 'photo', quality: 0.8 }, (res) => {
            if (res.assets && res.assets.length > 0) setImageUri(res.assets[0].uri || null);
          }) 
        },
        { 
          text: 'Choose from Gallery', 
          onPress: () => launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res) => {
            if (res.assets && res.assets.length > 0) setImageUri(res.assets[0].uri || null);
          }) 
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePostDonation = async () => {
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
    const isNumberRegex = /^\d+$/;

    if (!expiryTime.trim()) {
      localErrors.expiryTime = 'Expiry time in hours is required';
      valid = false;
    } else if (!isNumberRegex.test(expiryTime)) {
      localErrors.expiryTime = 'Please enter only a number (e.g. 2)';
      valid = false;
    }

    if (!imageUri) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    setErrors(localErrors);

    if (valid) {
      setIsUploading(true);
      try {
        // Step 1: Get S3 Upload URL
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const { uploadUrl, imageKey } = await commonService.getUploadUrl(filename);

        // Step 2: Upload raw image binary to S3
        const imageResponse = await fetch(imageUri);
        const blob = await imageResponse.blob();

        const s3Response = await fetch(uploadUrl, {
          method: 'PUT',
          body: blob,
        });

        if (!s3Response.ok) {
          throw new Error('Failed to upload image to S3');
        }

        // Step 3: Call Create Donation API
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + parseInt(expiryTime, 10));
        const isoExpiryString = expiryDate.toISOString();

        await donorService.postDonation({
          foodName: foodName.trim(),
          quantity: quantity.trim(),
          location: user?.address || 'Hotel Location',
          expiryTime: isoExpiryString,
          imageKey: imageKey
        });

        Alert.alert('Success', 'Donation posted successfully!');
        
        // Reset form
        setFoodName('');
        setQuantity('');
        setExpiryTime('');
        setImageUri(null);
        setErrors({});
        
      } catch (error: any) {
        console.error("POST DONATION ERROR:", error);
        Alert.alert('Error', 'Failed to post donation. Please try again.');
      } finally {
        setIsUploading(false);
      }
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
        label="Expiry Time (in hours)"
        placeholder="e.g., 2 (within 2 hours)"
        value={expiryTime}
        onChangeText={(text) => setExpiryTime(text.replace(/[^0-9]/g, ''))}
        error={errors.expiryTime}
        keyboardType="number-pad"
      />

      <Text style={styles.imageLabel}>Food Image</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={handleSelectImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.imagePlaceholderText}>+ Tap to select an image</Text>
        )}
      </TouchableOpacity>

      <View style={{ marginTop: 20 }} />

      <CustomButton 
        title={isUploading ? "Uploading..." : "Post Donation"} 
        onPress={handlePostDonation} 
        disabled={isUploading} 
      />
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
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  imageContainer: {
    height: 150,
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});