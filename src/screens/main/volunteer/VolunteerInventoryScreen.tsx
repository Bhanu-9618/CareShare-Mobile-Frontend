import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { volunteerService } from '../../../services/volunteerService';
import { Donation } from '../../../services/commonService';
import { COLORS } from '../../../constants/colors';
import { formatReceiverAddress } from '../../../utils/helpers';

const { width } = Dimensions.get('window');
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../../types/navigation';

type Props = BottomTabScreenProps<RootTabParamList, 'My Inventory'>;

export default function VolunteerInventoryScreen({ navigation }: Props) {
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [selectedItem, setSelectedItem] = useState<Donation | null>(null);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const { data: inventoryData = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['volunteerInventory'],
        queryFn: volunteerService.getInventory,
    });

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const handleConfirmRequest = async (item: Donation) => {
        Alert.alert(
            'Confirm Request',
            `Are you sure you want to confirm the request for "${item.foodName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            setIsProcessing(item.donationId);
                            const res = await volunteerService.confirmRequest(item.donationId);
                            Alert.alert(
                                'Request Confirmed',
                                res.message || 'The request was successfully confirmed and OTP has been sent to the receiver!',
                                [{ text: 'OK', onPress: () => refetch() }]
                            );
                        } catch (error: unknown) {
                            const err = error as any;
                            const errorMsg = err.response?.data?.message || 'Failed to confirm the request.';
                            Alert.alert('Error', errorMsg);
                        } finally {
                            setIsProcessing(null);
                        }
                    }
                }
            ]
        );
    };

    const handleCancelRequest = async (item: Donation) => {
        Alert.alert(
            'Cancel Request',
            `Are you sure you want to cancel the request for "${item.foodName}"?`,
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            setIsProcessing(item.donationId);
                            const res = await volunteerService.cancelRequest(item.donationId);
                            Alert.alert(
                                'Request Cancelled',
                                res.message || 'The request was successfully rejected and the donation is back on the Live feed.',
                                [{ text: 'OK', onPress: () => refetch() }]
                            );
                        } catch (error: unknown) {
                            const err = error as any;
                            const errorMsg = err.response?.data?.message || 'Failed to cancel the request.';
                            Alert.alert('Error', errorMsg);
                        } finally {
                            setIsProcessing(null);
                        }
                    }
                }
            ]
        );
    };

    const handleDeliveredPress = (item: Donation) => {
        setSelectedItem(item);
        setOtpInput('');
        setOtpModalVisible(true);
    };

    const handleVerifyOtp = async () => {
        if (!selectedItem) return;
        if (!otpInput || otpInput.length < 4) {
            Alert.alert('Invalid Input', 'Please enter a 4-digit OTP.');
            return;
        }

        try {
            setIsProcessing(selectedItem.donationId);
            const res = await volunteerService.deliverDonation(selectedItem.donationId, otpInput);
            setOtpModalVisible(false);
            setSelectedItem(null);
            setOtpInput('');
            Alert.alert('✅ Delivery Successful', res.message || 'OTP verified! Food has been delivered successfully.', [
                { text: 'OK', onPress: () => refetch() }
            ]);
        } catch (error: unknown) {
            const err = error as any;
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Invalid OTP. Please check with the receiver and try again.';
            Alert.alert('❌ Verification Failed', errorMsg);
        } finally {
            setIsProcessing(null);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.emptyText}>Failed to load inventory.</Text>
                <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
                    <Text style={{ color: COLORS.primary }}>Tap to retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderInventoryItem = ({ item }: { item: Donation }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.foodName}>{item.foodName}</Text>
                    {item.donorName ? <Text style={styles.donorName}>{item.donorName}</Text> : null}
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: item.status === 'REQUESTED' ? '#d1ecf1' : '#d4edda' },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: item.status === 'REQUESTED' ? '#0c5460' : '#155724' },
                        ]}
                    >
                        {item.status}
                    </Text>
                </View>
            </View>
            <Text style={styles.detailText}>📦 Quantity: {item.quantity}</Text>

            {item.receiverName && (
                <View style={styles.receiverContainer}>
                    <Text style={styles.receiverLabel}>Drop-off Location:</Text>
                    <Text style={styles.receiverName}>{item.receiverName}</Text>
                    {item.receiverAddress && (
                        <Text style={styles.receiverAddress}>{formatReceiverAddress(item.receiverAddress)}</Text>
                    )}
                </View>
            )}

            {item.status === 'REQUESTED' && !item.generated_otp && (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.confirmButton]}
                        onPress={() => handleConfirmRequest(item)}
                        disabled={isProcessing === item.donationId}
                    >
                        <Text style={styles.buttonText}>
                            {isProcessing === item.donationId ? "Confirming..." : "Confirm Request"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => handleCancelRequest(item)}
                        disabled={isProcessing === item.donationId}
                    >
                        <Text style={styles.buttonText}>
                            {isProcessing === item.donationId ? "Canceling..." : "Cancel"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.status === 'LIVE' && !item.generated_otp && (
                <Text style={styles.infoText}>Waiting for a Care Center to request this item...</Text>
            )}

            {item.generated_otp && (
                <>
                    <View style={[styles.otpBox, { justifyContent: 'center' }]}>
                        <Text style={styles.otpLabel}>Status: Ready for Delivery</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.deliveredButton}
                        onPress={() => handleDeliveredPress(item)}
                    >
                        <Text style={styles.deliveredButtonText}>✅ Mark as Delivered</Text>
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
                data={inventoryData}
                keyExtractor={(item) => item.donationId}
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
                                disabled={isProcessing !== null}
                            >
                                <Text style={styles.buttonText}>
                                    {isProcessing !== null ? 'Verifying...' : 'Verify'}
                                </Text>
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
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
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
    donorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginTop: 2,
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
        marginTop: 8,
        marginBottom: 4,
    },
    receiverContainer: {
        backgroundColor: '#fdf3e7',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#f39c12',
        marginTop: 5,
    },
    receiverLabel: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    receiverName: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    receiverAddress: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
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
        marginBottom: 8,
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