import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../../../context/AppContext';
import { COLORS } from '../../../constants/colors';
import { useQuery } from '@tanstack/react-query';
import { donorService } from '../../../services/donorService';
import { Donation } from '../../../services/commonService';

export default function DonorHomeScreen() {
  const { user } = useApp();

  const { data: donations = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['donorDonations'],
    queryFn: donorService.getDonations,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const activeDonations = donations.filter((item) => item.status !== 'COMPLETED');

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return '#007bff';
      case 'ACCEPTED': return '#ffc107';
      case 'COMPLETED': return COLORS.primary || 'green';
      default: return '#6c757d';
    }
  };

  const getExpiryText = (epochSeconds: number) => {
    const diffMs = (epochSeconds * 1000) - Date.now();
    if (diffMs <= 0) return 'Expired';
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return `In ${diffHours} Hour${diffHours === 1 ? '' : 's'}`;
  };

  const renderFoodCard = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        {item.donorName ? <Text style={styles.donorName}>{item.donorName}</Text> : null}
        {item.volunteerName ? <Text style={styles.volunteerName}>Accepted By : {item.volunteerName}</Text> : null}
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
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name || 'Hotel Owner'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Your Donations</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Failed to load donations. Pull to refresh.</Text>
        </View>
      ) : (
        <FlatList
          data={activeDonations}
          keyExtractor={(item) => item.donationId}
          renderItem={renderFoodCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No food donations posted yet.</Text>
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
  hotelName: {
    fontSize: 13,
    color: '#444444',
    fontWeight: '600',
  },
  quantity: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  volunteerText: {
    fontSize: 12,
    color: '#0056b3',
    fontWeight: '500',
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