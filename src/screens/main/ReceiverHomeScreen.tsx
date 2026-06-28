import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useApp, FoodItem } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';

export default function ReceiverHomeScreen() {
  const { user, foodList } = useApp();

  const incomingDeliveries = foodList.filter(
    (item) =>
      item.assignedReceiverId === user?.id &&
      item.status === 'Requested' &&
      item.generatedOtp !== null
  );

  const renderIncomingCard = ({ item }: { item: FoodItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: '#d4edda' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: '#155724' },
            ]}
          >
            Confirmed
          </Text>
        </View>
      </View>

      <Text style={styles.hotelName}>Dispatcher: {item.hotelName}</Text>
      <Text style={styles.addressText}>Address: {item.address}</Text>
      <Text style={styles.quantity}>Quantity: {item.quantity}</Text>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Volunteer has confirmed your request and is heading to your location!
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receiver Dashboard</Text>
      <Text style={styles.subtitle}>Track incoming food donations in real-time.</Text>

      <FlatList
        data={incomingDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderIncomingCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No incoming food donations at the moment.</Text>
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
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  hotelName: {
    fontSize: 13,
    color: '#444444',
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 13,
    color: '#666666',
  },
  progressContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  progressText: {
    fontSize: 12,
    color: COLORS.primary || 'green',
    fontStyle: 'italic',
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