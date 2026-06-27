import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import CustomButton from '../../components/CustomButton';

export default function FoodDetailScreen({ route, navigation }: any) {
  const { foodId } = route.params;
  const { foodList, updateFoodStatus } = useApp();

  const foodItem = foodList.find((item) => item.id === foodId);

  if (!foodItem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Food item not found!</Text>
      </View>
    );
  }

  const handleClaimDonation = () => {
    updateFoodStatus(foodId, 'Accepted');
    
    Alert.alert('Success', 'You have successfully claimed this donation!', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('MainTabs');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: foodItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.foodName}>{foodItem.foodName}</Text>
        <Text style={styles.hotelName}>Provided by: {foodItem.hotelName}</Text>
        
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{foodItem.quantity}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Expiry Time:</Text>
          <Text style={styles.valueColor}>{foodItem.expiryTime}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Pickup Location:</Text>
          <Text style={styles.value}>Colombo, Sri Lanka</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.descriptionTitle}>Important Note:</Text>
        <Text style={styles.descriptionText}>
          Please ensure you have an insulated thermal bag to maintain food safety standards during transit. Arrive at the hotel location as soon as possible.
        </Text>

        <View style={{ marginTop: 30 }} />
        
        <CustomButton title="Claim Donation" onPress={handleClaimDonation} />
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
  },
  hotelName: {
    fontSize: 15,
    color: '#666666',
    marginTop: 5,
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
    fontWeight: '500',
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