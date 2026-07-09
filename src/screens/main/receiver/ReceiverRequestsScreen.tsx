import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { receiverService } from '../../../services/receiverService';
import { Donation } from '../../../services/commonService';
import { COLORS } from '../../../constants/colors';

export default function ReceiverRequestsScreen() {
  const { data: myRequests = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['receiverPendingRequests'],
    queryFn: receiverService.getPendingRequests,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderRequestItem = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: '#fff3cd' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: '#856404' },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.addressText}>Pickup Location: {item.location}</Text>
      <Text style={styles.detailText}>📦 Quantity: {item.quantity}</Text>

      <Text style={styles.waitingText}>Waiting for the volunteer to confirm your request...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pending Requests</Text>
      <Text style={styles.subtitle}>Track food donations you have requested but are awaiting volunteer confirmation.</Text>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Failed to load requests.</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
            <Text style={{ color: COLORS.primary }}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myRequests}
          keyExtractor={(item) => item.donationId}
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
      )}
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
    lineHeight: 20,
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
  addressText: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 4,
  },
  waitingText: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 8,
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