import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useApp, FoodItem } from '../../context/AppContext';

export default function HistoryScreen() {
  const { foodList } = useApp();

  const completedDonations = foodList.filter((item) => item.status === 'Completed');

  const renderHistoryCard = ({ item }: { item: FoodItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <View style={styles.successBadge}>
          <Text style={styles.successText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.hotelName}>🏢 From: {item.hotelName}</Text>
      <Text style={styles.addressText}>Location: {item.address}</Text>
      <Text style={styles.details}>📦 Quantity: {item.quantity}</Text>
      <Text style={styles.timestamp}>⏱️ Expiry Ref: {item.expiryTime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donation History</Text>
      <Text style={styles.subtitle}>Log of all safely completed food distributions.</Text>

      <FlatList
        data={completedDonations}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No completed logs found in the registry.</Text>
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
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  successBadge: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  successText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#155724',
  },
  hotelName: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 4,
  },
  details: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#999999',
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
  },
});