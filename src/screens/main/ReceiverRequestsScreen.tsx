import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useApp, FoodItem } from '../../context/AppContext';

export default function ReceiverRequestsScreen() {
  const { user, foodList } = useApp();

  const myRequests = foodList.filter(
    (item) =>
      item.assignedReceiverId === user?.id &&
      (item.status === 'Requested' || item.status === 'Completed')
  );

  const renderRequestItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.generatedOtp ? '#d4edda' : '#fff3cd' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.generatedOtp ? '#155724' : '#856404' },
            ]}
          >
            {item.generatedOtp ? 'Confirmed' : 'Pending'}
          </Text>
        </View>
      </View>

      <Text style={styles.detailText}>🏢 Hotel: {item.hotelName}</Text>
      <Text style={styles.detailText}>🚴 Volunteer: Hero Delivery</Text>

      {item.generatedOtp && item.status !== 'Completed' ? (
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Verification OTP for Volunteer:</Text>
          <View style={styles.otpBox}>
            <Text style={styles.otpValue}>{item.generatedOtp}</Text>
          </View>
          <Text style={styles.otpHint}>Share this code ONLY when you receive the food.</Text>
        </View>
      ) : item.status === 'Completed' ? (
        <View style={styles.completedBox}>
          <Text style={styles.completedText}>✅ Donation Received Successfully</Text>
        </View>
      ) : (
        <Text style={styles.waitingText}>Waiting for volunteer to confirm your request...</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Food Requests</Text>
      <Text style={styles.subtitle}>Track your ongoing and past food donation requests.</Text>

      <FlatList
        data={myRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't requested any food yet.</Text>
            <Text style={styles.subEmptyText}>Browse the Live Feed to find and request available food.</Text>
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
    marginBottom: 10,
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
  detailText: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 4,
  },
  otpContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  otpLabel: {
    fontSize: 12,
    color: '#155724',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  otpBox: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#28a745',
  },
  otpValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    letterSpacing: 5,
  },
  otpHint: {
    fontSize: 10,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  waitingText: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
  completedBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
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
    paddingHorizontal: 20,
  },
});