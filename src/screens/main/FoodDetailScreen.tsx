import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { Donation } from '../../services/commonService';
import { volunteerService } from '../../services/volunteerService';
import { COLORS } from '../../constants/colors';

export default function FoodDetailScreen({ route, navigation }: any) {
  const [isClaiming, setIsClaiming] = useState(false);
  // We passed the entire donation object directly from the feed card!
  const donation: Donation = route.params?.donation;

  if (!donation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Food item not found!</Text>
      </View>
    );
  }

  const getExpiryText = (epochSeconds: number) => {
    const diffMs = (epochSeconds * 1000) - Date.now();
    if (diffMs <= 0) return 'Expired';
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return `In ${diffHours} Hour${diffHours === 1 ? '' : 's'}`;
  };

  const handleClaimDonation = async () => {
    try {
      setIsClaiming(true);
      const res = await volunteerService.claimDonation(donation.donationId);
      
      // Use the exact message from the backend response as requested
      Alert.alert('Success', res.message, [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack(); // Navigating back will auto-trigger refetch on the Feed via useFocusEffect
          },
        },
      ]);
    } catch (error: any) {
      console.error("CLAIM ERROR: ", error);
      // If user exceeds 5 limits, the backend throws an error message
      const errorMsg = error.response?.data?.message || 'Failed to claim donation.';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.foodName}>{donation.foodName}</Text>
        <Text style={styles.addressText}>Location: {donation.location}</Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{donation.quantity}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Expiry Time:</Text>
          <Text style={styles.valueColor}>{getExpiryText(donation.expiryAt)}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.descriptionTitle}>Important Note:</Text>
        <Text style={styles.descriptionText}>
          Please ensure you have an insulated thermal bag to maintain food safety standards during transit. Arrive at the location as soon as possible.
        </Text>

        <View style={{ marginTop: 30 }} />

        <CustomButton 
          title={isClaiming ? "Claiming..." : "Claim Donation"} 
          onPress={handleClaimDonation} 
          disabled={isClaiming}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#e9ecef',
  },
  infoContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    backgroundColor: '#ffffff',
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#777777',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  valueColor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  descriptionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
});