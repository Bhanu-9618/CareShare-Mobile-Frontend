import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import CustomButton from '../../components/CustomButton';

export default function OngoingTaskScreen({ navigation }: any) {
  const { user, foodList, updateFoodStatus } = useApp();

  const activeTasks = foodList.filter(
    (item) => item.currentVolunteerId === user?.id && item.status === 'Accepted'
  );

  if (activeTasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No ongoing tasks at the moment.</Text>
        <Text style={styles.subEmptyText}>Go to the feed and claim a donation to start!</Text>
      </View>
    );
  }

  const handleNextStep = (taskId: string) => {
    updateFoodStatus(taskId, 'Live', user?.id);
    Alert.alert('Status Updated', 'Food item marked as Picked Up from the hotel!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ongoing Delivery Tasks</Text>
      <Text style={styles.subtitle}>Track your progress ({activeTasks.length}/5).</Text>

      {activeTasks.map((activeTask) => (
        <View key={activeTask.id} style={styles.taskWrapper}>
          <View style={styles.card}>
            <Text style={styles.foodName}>{activeTask.foodName}</Text>
            <Text style={styles.quantity}>Quantity: {activeTask.quantity}</Text>
            <Text style={styles.hotelName}>From: {activeTask.hotelName}</Text>
            <Text style={styles.addressText}>Address: {activeTask.address}</Text>
            <Text style={styles.addressText}>To: Community Center - Colombo 03</Text>
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
                  activeTask.status === 'Picked Up' ? styles.completedCircle : styles.pendingCircle,
                ]}
              />
              <Text
                style={[
                  styles.timelineText,
                  activeTask.status === 'Picked Up' ? styles.completedText : styles.pendingText,
                ]}
              >
                Picked Up From Hotel
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }} />

          {activeTask.status === 'Accepted' && (
            <CustomButton
              title="Picked Up From Hotel"
              onPress={() => handleNextStep(activeTask.id)}
            />
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 15,
  },
  hotelName: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '600',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 2,
  },
  receiverName: {
    fontSize: 14,
    color: '#333333',
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
    marginBottom: 5,
  },
  subEmptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});