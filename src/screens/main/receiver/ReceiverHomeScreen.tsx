import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { receiverService } from '../../../services/receiverService';
import { Donation } from '../../../services/commonService';
import { COLORS } from '../../../constants/colors';

export default function ReceiverHomeScreen() {
  const { data: incomingDeliveries = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['receiverHub'],
    queryFn: receiverService.getReceiverHub,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderIncomingCard = ({ item }: { item: Donation }) => (
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
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.addressText}>Location: {item.location}</Text>
      <Text style={styles.quantity}>Quantity: {item.quantity}</Text>

      {/* Show the secret OTP directly to the receiver */}
      <View style={styles.otpContainer}>
        <Text style={styles.otpLabel}>Your Secure Delivery OTP:</Text>
        <View style={styles.otpBox}>
          <Text style={styles.otpValue}>{item.generated_otp || 'Processing...'}</Text>
        </View>
        <Text style={styles.otpHint}>Give this code to the volunteer when they arrive to complete the delivery.</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receiver Dashboard</Text>
      <Text style={styles.subtitle}>Track confirmed food donations heading your way.</Text>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Failed to load your hub.</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
            <Text style={{ color: COLORS.primary }}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={incomingDeliveries}
          keyExtractor={(item) => item.donationId}
          renderItem={renderIncomingCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No incoming food donations at the moment.</Text>
              <Text style={styles.subEmptyText}>When a volunteer confirms your request, it will appear here with your tracking OTP.</Text>
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
  addressText: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 13,
    color: '#666666',
  },
  otpContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c3e6cb',
    alignItems: 'center'
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
    paddingHorizontal: 20,
    borderRadius: 8,
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontWeight: 'bold',
    color: '#333333',
    fontSize: 16,
    marginBottom: 5
  },
  subEmptyText: {
    color: '#666666',
    fontSize: 13,
    textAlign: 'center'
  }
});