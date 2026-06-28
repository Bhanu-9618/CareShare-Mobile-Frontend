import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useApp, FoodItem } from '../../context/AppContext';

export default function VolunteerInventoryScreen({ navigation }: any) {
    const { user, foodList, updateFoodStatus } = useApp();
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

    const myInventory = foodList.filter(
        (item) =>
            item.currentVolunteerId === user?.id &&
            (item.status === 'Picked Up' || item.status === 'Live' || item.status === 'Requested')
    );

    const handleConfirmRequest = (item: FoodItem) => {
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        updateFoodStatus(item.id, 'Requested', item.currentVolunteerId, item.assignedReceiverId, generatedOtp);

        Alert.alert(
            'Request Confirmed',
            `Delivery secure OTP code generated: ${generatedOtp}. Please proceed to destination.`
        );
    };

    const handleCancelRequest = (item: FoodItem) => {
        updateFoodStatus(item.id, 'Live', item.currentVolunteerId, null, null);
        Alert.alert('Request Cancelled', 'The food status is reset back to Live feed.');
    };

    const handleDeliveredPress = (item: FoodItem) => {
        setSelectedItem(item);
        setOtpInput('');
        setOtpModalVisible(true);
    };

    const handleVerifyOtp = () => {
        if (!selectedItem) return;

        if (otpInput === selectedItem.generatedOtp) {
            updateFoodStatus(selectedItem.id, 'Completed', selectedItem.currentVolunteerId, selectedItem.assignedReceiverId, null);
            setOtpModalVisible(false);
            setSelectedItem(null);
            Alert.alert('✅ Delivery Successful', 'OTP verified! Food has been delivered successfully.');
        } else {
            Alert.alert('❌ Invalid OTP', 'The OTP you entered does not match. Please try again.');
        }
    };

    const renderInventoryItem = ({ item }: { item: FoodItem }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.foodName}>{item.foodName}</Text>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: item.status === 'Requested' ? '#d1ecf1' : '#d4edda' },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: item.status === 'Requested' ? '#0c5460' : '#155724' },
                        ]}
                    >
                        {item.status}
                    </Text>
                </View>
            </View>

            <Text style={styles.detailText}>🏢 From: {item.hotelName}</Text>
            <Text style={styles.detailText}>📦 Quantity: {item.quantity}</Text>

            {item.status === 'Requested' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.confirmButton]}
                        onPress={() => handleConfirmRequest(item)}
                    >
                        <Text style={styles.buttonText}>Confirm Request</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => handleCancelRequest(item)}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.status === 'Live' && !item.generatedOtp && (
                <Text style={styles.infoText}>Waiting for a Care Center to request this item...</Text>
            )}

            {item.generatedOtp && (
                <>
                    <View style={styles.otpBox}>
                        <Text style={styles.otpLabel}>Active Transit OTP:</Text>
                        <Text style={styles.otpValue}>{item.generatedOtp}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.deliveredButton}
                        onPress={() => handleDeliveredPress(item)}
                    >
                        <Text style={styles.deliveredButtonText}>✅ Delivered</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Pickup Inventory</Text>
            <Text style={styles.subtitle}>Manage food currently in your transit possession.</Text>

            <FlatList
                data={myInventory}
                keyExtractor={(item) => item.id}
                renderItem={renderInventoryItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Your inventory is empty.</Text>
                        <Text style={styles.subEmptyText}>Go to Available Food feed to claim and pickup items.</Text>
                    </View>
                }
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={otpModalVisible}
                onRequestClose={() => setOtpModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter OTP</Text>
                        <Text style={styles.modalSubtitle}>Please enter the 4-digit OTP provided by the receiver.</Text>
                        
                        <TextInput
                            style={styles.otpInput}
                            value={otpInput}
                            onChangeText={setOtpInput}
                            keyboardType="number-pad"
                            placeholder="OTP"
                            maxLength={4}
                        />

                        <View style={styles.modalActionRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => setOtpModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalVerifyButton]}
                                onPress={handleVerifyOtp}
                            >
                                <Text style={styles.buttonText}>Verify</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    infoText: {
        fontSize: 12,
        color: '#666666',
        fontStyle: 'italic',
        marginTop: 10,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    confirmButton: {
        backgroundColor: '#28a745',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    otpBox: {
        marginTop: 15,
        backgroundColor: '#e2e3e5',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    otpLabel: {
        fontSize: 13,
        color: '#383d41',
        fontWeight: '500',
    },
    otpValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
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
    deliveredButton: {
        marginTop: 15,
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    deliveredButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 25,
        width: '85%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 20,
    },
    otpInput: {
        width: '100%',
        backgroundColor: '#f1f3f5',
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 10,
        padding: 15,
        fontSize: 24,
        textAlign: 'center',
        letterSpacing: 5,
        marginBottom: 25,
    },
    modalActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    modalCancelButton: {
        backgroundColor: '#6c757d',
    },
    modalVerifyButton: {
        backgroundColor: '#007bff',
    },
});