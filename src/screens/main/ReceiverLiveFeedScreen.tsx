import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useApp, FoodItem } from '../../context/AppContext';

export default function ReceiverLiveFeedScreen() {
  const { user, foodList, updateFoodStatus } = Object.assign({}, useApp());
  const [searchQuery, setSearchQuery] = useState('');

  const liveFoodItems = foodList.filter(
    (item) => item.status === 'Live' && item.assignedReceiverId === null
  );

  const filteredItems = liveFoodItems.filter((item) =>
    item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestFood = (item: FoodItem) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to request food.');
      return;
    }

    updateFoodStatus(item.id, 'Requested', item.currentVolunteerId, user.id, null);
    Alert.alert(
      'Request Submitted',
      `Your request for "${item.foodName}" has been sent to the volunteer. Please wait for confirmation.`
    );
  };

  const renderLiveItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.hotelName}>🏢 Sourced from: {item.hotelName}</Text>
          <Text style={styles.addressText}>Address: {item.address}</Text>
        </View>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>In Transit</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>📦 Quantity: {item.quantity}</Text>
        <Text style={styles.detailText}>⏳ Expiry Ref: {item.expiryTime}</Text>
        <Text style={styles.volunteerInfo}>🚴 Courier: Connected Volunteer</Text>
      </View>

      <TouchableOpacity style={styles.requestButton} onPress={() => handleRequestFood(item)}>
        <Text style={styles.buttonText}>Request Food Donation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Volunteer Feed</Text>
      <Text style={styles.subtitle}>Claim food items currently held live in transit by nearby volunteers.</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by food name or hotel..."
        placeholderTextColor="#999999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderLiveItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No live food available right now.</Text>
            <Text style={styles.subEmptyText}>Active transit items will appear as soon as volunteers pick up donations.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
    lineHeight: 20,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    marginBottom: 20,
    elevation: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  hotelName: {
    fontSize: 13,
    color: '#444444',
    fontWeight: '600',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 12,
    color: '#888888',
  },
  liveBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2e7d32',
    textTransform: 'uppercase',
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 13,
    color: '#495057',
    marginBottom: 4,
  },
  volunteerInfo: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
    marginTop: 2,
  },
  requestButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  subEmptyText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
});