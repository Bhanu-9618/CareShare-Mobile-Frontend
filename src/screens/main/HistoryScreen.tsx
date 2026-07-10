import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { useQuery } from '@tanstack/react-query';
import { commonService, Donation } from '../../services/commonService';
import { getExpiryText, getStatusColor } from '../../utils/helpers';

export default function HistoryScreen() {
  const { data: historyLogs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['donationHistory'],
    queryFn: commonService.getHistory,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderHistoryCard = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        {item.donorName ? <Text style={styles.donorName}>{item.donorName}</Text> : null}
        {item.volunteerName ? <Text style={styles.volunteerName}>Accepted By : {item.volunteerName}</Text> : null}
        {item.receiverName ? <Text style={styles.receiverName}>Received By : {item.receiverName}</Text> : null}
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <View style={styles.expiryRow}>
          <Text style={styles.expiry}>Expires: {getExpiryText(item.expiryAt)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donation History</Text>
      <Text style={styles.subtitle}>Log of all food distributions and logs.</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Failed to load history. Pull to refresh.</Text>
        </View>
      ) : (
        <FlatList
          data={historyLogs}
          keyExtractor={(item) => item.donationId}
          renderItem={renderHistoryCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No logs found in the registry.</Text>
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
  },
  listContainer: {
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
  donorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 2,
  },
  volunteerName: {
    fontSize: 13,
    color: '#0056b3',
    fontWeight: '500',
    marginTop: 2,
  },
  receiverName: {
    fontSize: 13,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 2,
  },
  quantity: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
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