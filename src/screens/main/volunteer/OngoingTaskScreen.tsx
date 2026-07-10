import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import CustomButton from '../../../components/CustomButton';
import { volunteerService } from '../../../services/volunteerService';
import { Donation } from '../../../services/commonService';
import { COLORS } from '../../../constants/colors';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../../types/navigation';

type Props = BottomTabScreenProps<RootTabParamList, 'My Task'>;

export default function OngoingTaskScreen({ navigation }: Props) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const { data: ongoingTasks = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['ongoingTasks'],
    queryFn: volunteerService.getOngoingTasks,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Failed to load tasks.</Text>
        <CustomButton title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  if (ongoingTasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No ongoing tasks at the moment.</Text>
        <Text style={styles.subEmptyText}>Go to the feed and claim a donation to start!</Text>
      </View>
    );
  }

  const handleNextStep = async (taskId: string) => {
    try {
      setIsProcessing(taskId);
      const res = await volunteerService.pickupDonation(taskId);
      Alert.alert('Success', res.message || 'Donation picked up successfully!', [
        { text: 'OK', onPress: () => refetch() }
      ]);
    } catch (error: unknown) {
      const err = error as any;
      const errorMsg = err.response?.data?.message || 'Failed to pick up donation.';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCancel = async (taskId: string) => {
    Alert.alert(
      'Cancel Task',
      'Are you sure you want to cancel this delivery task?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setIsProcessing(taskId);
              const res = await volunteerService.unclaimDonation(taskId);
              Alert.alert('Success', res.message || 'Donation unclaimed successfully!', [
                { text: 'OK', onPress: () => refetch() }
              ]);
            } catch (error: unknown) {
              const err = error as any;
              const errorMsg = err.response?.data?.message || 'Failed to cancel donation.';
              Alert.alert('Error', errorMsg);
            } finally {
              setIsProcessing(null);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ongoing Delivery Tasks</Text>
      <Text style={styles.subtitle}>Track your progress ({ongoingTasks.length}/5).</Text>

      {ongoingTasks.map((activeTask: Donation) => (
        <View key={activeTask.donationId} style={styles.taskWrapper}>
          <View style={styles.detailsContainer}>
            <Text style={styles.foodName}>{activeTask.foodName}</Text>
            {activeTask.donorName ? <Text style={styles.donorName}>{activeTask.donorName}</Text> : null}
            
            <View style={styles.locationContainer}>
              <Text style={styles.locationLabel}>Pickup Location:</Text>
              <Text style={styles.locationText}>{activeTask.location}</Text>
            </View>
          </View>

          <View style={styles.timelineContainer}>
            <Text style={styles.sectionTitle}>Delivery Progress</Text>

            <View style={styles.timelineRow}>
              <View style={[styles.circle, styles.completedCircle]} />
              <Text style={[styles.timelineText, styles.completedText]}>Donation Claimed</Text>
            </View>
            <View style={styles.line} />

            <View style={styles.timelineRow}>
              <View
                style={[
                  styles.circle,
                  activeTask.status === 'LIVE' ? styles.completedCircle : styles.pendingCircle,
                ]}
              />
              <Text
                style={[
                  styles.timelineText,
                  activeTask.status === 'LIVE' ? styles.completedText : styles.pendingText,
                ]}
              >
                Picked Up From Hotel
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }} />

          {activeTask.status === 'ACCEPTED' && (
            <View>
              <CustomButton
                title={isProcessing === activeTask.donationId ? "Processing..." : "Picked Up From Hotel"}
                onPress={() => handleNextStep(activeTask.donationId)}
                disabled={isProcessing === activeTask.donationId}
              />
              <View style={{ marginTop: 10 }} />
              <CustomButton
                title={isProcessing === activeTask.donationId ? "Processing..." : "Cancel"}
                onPress={() => handleCancel(activeTask.donationId)}
                disabled={isProcessing === activeTask.donationId}
              />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  taskWrapper: {
    marginBottom: 40,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsContainer: {
    marginBottom: 25,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  donorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 2,
  },
  quantity: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 15,
  },
  locationContainer: {
    backgroundColor: '#eef2f7',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff'
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  timelineContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 15,
  },
  completedCircle: {
    backgroundColor: '#28a745',
  },
  pendingCircle: {
    backgroundColor: '#dee2e6',
    borderWidth: 2,
    borderColor: '#ced4da',
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: '#dee2e6',
    marginLeft: 7,
    marginVertical: 4,
  },
  timelineText: {
    fontSize: 14,
    fontWeight: '500',
  },
  completedText: {
    color: '#28a745',
  },
  pendingText: {
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  subEmptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});