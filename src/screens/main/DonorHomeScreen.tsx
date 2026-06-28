import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useApp, FoodItem } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';

export default function DonorHomeScreen() {
  const { foodList, user } = useApp();

  const getStatusColor = (status: FoodItem['status']) => {
    switch (status) {
      case 'Active': return '#007bff';
      case 'Accepted': return '#ffc107';
      case 'Completed': return COLORS.primary || 'green';
      default: return '#6c757d';
    }
  };

  const renderFoodCard = ({ item }: { item: FoodItem }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <Text style={styles.hotelName}>{item.hotelName}</Text>
        <Text style={styles.addressText}>{item.address}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <View style={styles.expiryRow}>
          <Text style={styles.expiry}>Expires: {item.expiryTime}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name || 'Hotel Owner'}</Text>
        <Text style={styles.roleText}>Dashboard ({user?.role})</Text>
      </View>

      <Text style={styles.sectionTitle}>Your Donations</Text>

      <FlatList
        data={foodList}
        keyExtractor={(item) => item.id}
        renderItem={renderFoodCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No food donations posted yet.</Text>
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
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  roleText: {
    fontSize: 12,
    color: COLORS.primary || 'green',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hotelName: {
    fontSize: 13,
    color: '#444444',
    fontWeight: '600',
  },
  quantity: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  expiry: {
    fontSize: 12,
    color: 'red',
    fontWeight: '500',
  },
  expiryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});