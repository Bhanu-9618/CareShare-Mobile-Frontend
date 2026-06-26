import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, DimensionValue } from 'react-native';
import { COLORS } from '../constants/colors'; 

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  width?: DimensionValue;
  backgroundColor?: string;
}

export default function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  width = '100%',
  backgroundColor = COLORS.primary, 
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        { width, backgroundColor }, 
        (disabled || loading) && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.secondary || '#fff'} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});