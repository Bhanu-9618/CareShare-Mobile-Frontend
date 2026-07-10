import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../context/AppContext';
import { receiverService } from '../../../services/receiverService';
import { Donation } from '../../../services/commonService';
import { COLORS } from '../../../constants/colors';
import { getExpiryText } from '../../../utils/helpers';

export default function ReceiverLiveFeedScreen() {
  const { user } = useApp();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const { data: liveFoodItems = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['receiverLiveFeed'],
    queryFn: receiverService.getLiveFeed,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleRequestFood = async (item: Donation) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to request food.');
      return;
    }

    Alert.alert(
      'Confirm Request',
      `Are you sure you want to request "${item.foodName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setIsProcessing(item.donationId);
              const res = await receiverService.requestDonation(item.donationId);
              Alert.alert(
                'Request Submitted',
                res.message || `Your request for "${item.foodName}" has been successfully sent to the volunteer.`,
                [{ text: 'OK', onPress: () => refetch() }]
              );
            } catch (error: any) {
              const errorMsg = error.response?.data?.message || 'Failed to request food donation.';
              Alert.alert('Error', errorMsg);
            } finally {
              setIsProcessing(null);
            }
          }
        }
      ]
    );
  };

  const renderLiveItem = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.detailsContainer}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          {item.donorName ? <Text style={styles.donorName}>{item.donorName}</Text> : null}
          <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
          {item.volunteerName ? <Text style={styles.volunteerName}>Accepted By : {item.volunteerName}</Text> : null}
        </View>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>📦 Quantity: {item.quantity}</Text>
        <Text style={styles.detailText}>⏳ Expiry Ref: {getExpiryText(item.expiryAt)}</Text>
        <Text style={styles.volunteerInfo}>🚴 Courier: Connected Volunteer</Text>
      </View>

      <TouchableOpacity 
        style={styles.requestButton} 
        onPress={() => handleRequestFood(item)}
        disabled={isProcessing === item.donationId}
      >
        <Text style={styles.buttonText}>
          {isProcessing === item.donationId ? "Requesting..." : "Request Food Donation"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Volunteer Feed</Text>
      <Text style={styles.subtitle}>Claim food items currently held live in transit by nearby volunteers.</Text>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Failed to load live feed.</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
            <Text style={{ color: COLORS.primary }}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={liveFoodItems}
          keyExtractor={(item) => item.donationId}
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
    marginBottom: 15,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  donorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  volunteerName: {
    fontSize: 13,
    color: '#0056b3',
    fontWeight: '500',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 12,
    color: '#888888',
  },
  liveBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 10,
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