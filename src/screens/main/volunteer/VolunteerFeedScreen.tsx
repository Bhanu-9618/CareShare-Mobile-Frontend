import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../context/AppContext';
import { COLORS } from '../../../constants/colors';
import { volunteerService } from '../../../services/volunteerService';
import { Donation } from '../../../services/commonService';

export default function VolunteerFeedScreen({ navigation }: any) {
  const { user } = useApp();

  const { data: feedData = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['volunteerFeed'],
    queryFn: volunteerService.getFeed,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const activeFoods = feedData.filter((item) => item.status === 'ACTIVE');

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

  const renderFeedCard = ({ item }: { item: Donation }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FoodDetail', { donation: item })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <Text style={styles.addressText}>{item.location}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        
        <View style={styles.expiryRow}>
          <Text style={styles.expiry}>Expires: {getExpiryText(item.expiryAt)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
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

      <Text style={styles.sectionTitle}>Available Food Donations</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Failed to load feed. Pull to refresh.</Text>
        </View>
      ) : (
        <FlatList
          data={activeFoods}
          keyExtractor={(item) => item.donationId}
          renderItem={renderFeedCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active food donations found.</Text>
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
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  quantity: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  expiryRow: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardFooter: {
    alignItems: 'flex-end',
    marginTop: 5,
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