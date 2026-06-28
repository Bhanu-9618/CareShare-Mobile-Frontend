import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import { useApp, FoodItem } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';

export default function VolunteerFeedScreen({ navigation }: any) {
  const { foodList, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const activeFoods = foodList.filter(
    (item) =>
      item.status === 'Active' &&
      (item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hotelName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderFeedCard = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
    >
      <Image
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>Colombo</Text>
          </View>
        </View>
        
        <Text style={styles.hotelName}>📍 {item.hotelName}</Text>
        <Text style={styles.hotelName}>🏠 {item.address}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.expiry}>Expires: {item.expiryTime}</Text>
          <Text style={styles.actionText}>View Details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.userName}>{user?.name || 'Hero'}</Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role || 'Volunteer'}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food items or hotels..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>Available Food Donations</Text>

      <FlatList
        data={activeFoods}
        keyExtractor={(item) => item.id}
        renderItem={renderFeedCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active food donations found.</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
  },
  userInfo: {
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  roleBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007bff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  searchInput: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    color: '#333',
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
    borderRadius: 15,
    flexDirection: 'row',
    marginBottom: 15,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  hotelName: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  quantity: {
    fontSize: 13,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  expiry: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '500',
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary || 'green',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});